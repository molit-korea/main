# inital setting
rm(list = ls())
dir <- 'C:/Users/Taewoong/Projects/Hackerthon/01_Code'
setwd(dir)

source("functions/import_packages.r")
source("functions/ts_models.r")

# input
rest_type <- '아파트' # '다세대', '아파트', '오피스텔'
price_type <- '매매' # '매매', '전세'
#tar_col <- 1 # mean:1, median:2, mean/area:3, median/area:4

for(tar_col in 1:4){

rest_forc_len <- 3 # month
level <- c(80, 95)

# file path
filepath <- "../00_Data/실거래가_OUT"
gu_loc_fn <- paste('LOC_GU_', rest_type,'.csv', sep='')
gu_fn <- paste('TBL_Mod_서울시_구별_', rest_type, '_', price_type, '.csv', sep='')

value_type <- c('Mean', 'Median', 'MeanPA', 'MedianPA')
out_name <- paste('TSG', rest_type, price_type, value_type[tar_col], sep='_')

# read data
gu_loc <- as.tibble(fread(paste(filepath, gu_loc_fn, sep = '/')))
gu_data <- as.tibble(fread(paste(filepath, gu_fn, sep = '/')))

##############################################################
k <- 1

for (gu_name in gu_loc$c_gu){

loc_name <- paste(gu_data$c_si[1], gu_name)

tar_data <- gu_data %>% filter(c_gu == gu_name) %>%
	transform(c_date = as.Date(c_date))

start_date <- min(tar_data$c_date)
end_date <- max(tar_data$c_date)
time_seq <- tibble(c_date = seq(as.Date(start_date), as.Date(end_date), by = 'month'))

colnames(tar_data)[tar_col+3] <- 'c_value'

tar_ts <- tar_data %>%
	right_join(time_seq, by = 'c_date') %>%
	select(c_date, c_si, c_gu, c_value, is_na)

# run arima, prophet, hotwinter, mlm
arima_table <- run_arima_novalid(tar_ts, loc_name, rest_forc_len, level=level, log=TRUE)
prophet_table <- run_prophet_novalid(tar_ts, loc_name, rest_forc_len, level=level, log=TRUE)
mlm_table <- run_mlm_novalid(tar_ts, loc_name, rest_forc_len, level=level, log=TRUE)

if (length(tar_ts$c_date)>= 24){

holtwinter_table <- run_holtwinter_novalid(tar_ts, loc_name, rest_forc_len, level=level, log=TRUE)

# combine tables
table_1 <- arima_table[[1]] %>%
	mutate(Prophet = prophet_table[[1]]$Prophet,
		 HoltWinter = holtwinter_table[[1]]$HoltWinter,
		 MLM = mlm_table[[1]]$MLM)

table_2 <- rbind(arima_table[[2]], prophet_table[[2]],
			holtwinter_table[[2]], mlm_table[[2]])

table_3 <- arima_table[[3]] %>%
	mutate(Prophet = prophet_table[[3]]$Prophet,
		 HoltWinter = holtwinter_table[[3]]$HoltWinter,
		 MLM = mlm_table[[3]]$MLM)

} else{

table_1 <- arima_table[[1]] %>%
	mutate(Prophet = prophet_table[[1]]$Prophet,
		 HoltWinter = 0,
		 MLM = mlm_table[[1]]$MLM)

table_2 <- rbind(arima_table[[2]], prophet_table[[2]], mlm_table[[2]])

table_3 <- arima_table[[3]] %>%
	mutate(Prophet = prophet_table[[3]]$Prophet,
		 HoltWinter = 0,
		 MLM = mlm_table[[3]]$MLM)
}


table_4 <- arima_table[[4]]
table_5 <- prophet_table[[4]]


if (k==1){
out_table_1 <- table_1
out_table_2 <- table_2
out_table_3 <- table_3
out_table_4 <- table_4
out_table_5 <- table_5
k <- k+1
} else{
out_table_1 <- rbind(out_table_1, table_1)
out_table_2 <- rbind(out_table_2, table_2)
out_table_3 <- rbind(out_table_3, table_3)
out_table_4 <- rbind(out_table_4, table_4)
out_table_5 <- rbind(out_table_5, table_5)
}


}

# save tables
out_tbl <- list(out_table_1, out_table_2,
	out_table_3, out_table_4, out_table_5)

outn    = paste(out_name, 'Historical.csv', sep='_')
outn[2] = paste(out_name, 'Forecast.csv', sep='_')
outn[3] = paste(out_name, 'P_value.csv', sep='_')
outn[4] = paste(out_name, 'ARIMA_model.csv', sep='_')
outn[5] = paste(out_name, 'Prophet_fcast.csv', sep='_')

for(ix in 1:5){
write.csv(out_tbl[[ix]], paste(filepath, outn[ix], sep='/'),
	    row.names=FALSE)
}

}





