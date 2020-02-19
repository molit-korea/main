# inital setting
rm(list = ls())
dir <- 'C:/Users/Taewoong/Projects/Hackerthon/01_Code'
setwd(dir)

source("functions/import_packages.r")

# input
rest_type <- '아파트' # '다세대', '아파트', '오피스텔'
price_type <- '전세' # '매매', '전세'

# file path
filepath <- "../00_Data/실거래가_OUT"
gu_loc_fn <- paste('LOC_GU_', rest_type,'.csv', sep='')
gu_fn <- paste('TBL_서울시_구별_', rest_type, '_', price_type, '.csv', sep='')
out_fn <- paste('TBL_Mod_서울시_구별_', rest_type, '_', price_type, '.csv', sep='')

# read data
gu_loc <- as.tibble(fread(paste(filepath, gu_loc_fn, sep = '/')))
gu_data <- as.tibble(fread(paste(filepath, gu_fn, sep = '/')))


##############################################################

for (ik in 1:length(gu_loc$c_gu)){

gu_name <- gu_loc$c_gu[ik]

tar_gu_data <- gu_data %>% filter(c_gu == gu_name) %>%
	transform(c_date = as.Date(c_date))

start_date <- min(tar_gu_data$c_date)
end_date <- max(tar_gu_data$c_date)
time_seq <- tibble(c_date = seq(as.Date(start_date), as.Date(end_date), by = 'month'))

tar_gu_seq <- tar_gu_data %>%
	right_join(time_seq, by = 'c_date') %>%
	mutate(is_na = as.integer(is.na(c_mean)))

if (sum(is.na(tar_gu_seq))){
print(price_type)
print(dong_name)
}

df1 <- tar_gu_seq %>%
	transform(c_mean = na.kalman(c_mean),
		c_median = na.kalman(c_median),
		c_mean_per_area = na.kalman(c_mean_per_area),
		c_median_per_area = na.kalman(c_median_per_area))


if (ik==1){
tar_gu_out <- df1[,c(1:7,12)] %>% as.tibble()
} else{
tar_gu_out <- rbind(tar_gu_out, df1[,c(1:7,12)])
}


}

write.csv(tar_gu_out, paste(filepath, out_fn, sep='/'), row.names=FALSE)

