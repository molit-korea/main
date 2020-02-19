## data extraction ## 

# data extraction 1

ext_data_01 <- function(rest_price, input, rest_loc){

col_date <- input[1]
col_loc <- input[2]
col_value <- input[3]
rest_pred_len <- input[4]


# target data extraction
# check missing value

colnames(rest_price)[col_date] <- "c_date"
colnames(rest_price)[col_loc] <- "c_loc"
colnames(rest_price)[col_value] <- "c_value"

rest_price <- rest_price %>% mutate(c_date = ymd(c_date))


rest_all_price <- tibble(c_date = seq(min(rest_price$c_date), max(rest_price$c_date), by = 'month'))
rest_train_len <- length(rest_all_price$c_date) - rest_pred_len
rest_split_date <- rest_all_price$c_date[rest_train_len]

rest_foo <- rest_price %>% filter(c_loc == rest_loc)

price <- rest_foo %>%
  right_join(rest_all_price, by = "c_date") %>%
  mutate(is_na = is.na(c_value)) %>%
  mutate(c_value = na.kalman(c_value)) %>%
  mutate(c_value = log(c_value)) %>%
  rownames_to_column() %>%
  select(c_date = c_date,
	   c_value = c_value,
	   is_na = is_na)

price$is_na[price$is_na == "true"] <- as.numeric(1)
price$is_na[price$is_na == "false"] <- as.numeric(0)

price_train <- price %>% filter(c_date <= rest_split_date)
price_valid <- price %>% filter(c_date > rest_split_date)

return(list(price, price_train, price_valid))

}



#############################################################################



ext_tsdata_filna_01 <- function(rest_price, input, rest_loc, log=FALSE){

col_date <- input[1]
col_loc <- input[2]
col_value <- input[3]

min_data_len <- 40
max_na_len <- round(min_data_len*0.1)

# target data extraction
# check missing value
colnames(rest_price)[col_date] <- "c_date"
colnames(rest_price)[col_loc] <- "c_loc"
colnames(rest_price)[col_value] <- "c_value"

rest_price <- rest_price %>% mutate(c_date = ymd(c_date))

rest_all_price <- tibble(c_date = seq(min(rest_price$c_date), max(rest_price$c_date), by = 'month'))
rest_train_len <- length(rest_all_price$c_date) - rest_pred_len
rest_split_date <- rest_all_price$c_date[rest_train_len]

rest_price$c_value <- log(rest_price$c_value)
rest_foo <- rest_price %>% filter(c_loc == rest_loc)

if (length(rest_foo$c_value) >= min_data_len){
price <- rest_foo %>%
  right_join(rest_all_price, by = "c_date") %>%
  mutate(is_na = is.na(c_value),
	   c_loc = rest_loc) %>%
  mutate(c_value = na.kalman(c_value)) %>%
  rownames_to_column() %>%
  select(c_date = c_date,
	   c_loc = c_loc,
	   c_value = c_value,
	   is_na = is_na)

if (!log){
	price$c_value <- exp(price$c_value)
}

price$is_na[price$is_na == "true"] <- as.numeric(1)
price$is_na[price$is_na == "false"] <- as.numeric(0)

if (sum(price$is_na) >= max_na_len){
is_empty <- isTRUE(TRUE)
} else{
is_empty <- isTRUE(FALSE)
}

} else{

price <- rest_foo
is_empty <- isTRUE(TRUE)

}

return(list(price, is_empty))

}

