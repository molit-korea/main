# inital setting
rm(list = ls())
dir <- 'C:/Users/Taewoong/Projects/Hackerthon/01_Code'
setwd(dir)

source("functions/import_packages.r")

# input
rest_type <- '아파트' # '다세대', '아파트', '오피스텔'
price_type <- '월세' # '매매', '전세'

# file path
filepath <- "../00_Data/실거래가_OUT"
dong_loc_fn <- paste('LOC_DONG_', rest_type,'.csv', sep='')
dong_fn <- paste('TBL_서울시_동별_', rest_type, '_', price_type, '.csv', sep='')
out_fn <- paste('TBL_Mod_서울시_동별_', rest_type, '_', price_type, '.csv', sep='')

# read data
dong_loc <- as.tibble(fread(paste(filepath, dong_loc_fn, sep = '/')))
dong_data <- as.tibble(fread(paste(filepath, dong_fn, sep = '/')))


##############################################################

for (ik in 1:length(dong_loc$c_dong)){

ik <- 36

gu_name <- dong_loc$c_gu[ik]
dong_name <- dong_loc$c_dong[ik]

tar_gu_data <- dong_data %>% filter(c_gu == gu_name) %>%
	transform(c_date = as.Date(c_date))

tar_dong_data <- tar_gu_data %>% filter(c_dong == dong_name) %>%
	transform(c_date = as.Date(c_date))

start_date <- min(tar_dong_data$c_date)
end_date <- max(tar_dong_data$c_date)
time_seq <- tibble(c_date = seq(as.Date(start_date), as.Date(end_date), by = 'month'))

tar_dong_seq <- tar_dong_data %>%
	right_join(time_seq, by = 'c_date') %>%
	mutate(c_si = tar_dong_data$c_si[1],
		c_gu = tar_dong_data$c_gu[1],
		c_dong = tar_dong_data$c_dong[1])

if (sum(is.na(tar_dong_seq))){
print(price_type)
print(dong_name)
}

df1 <- tar_gu_data %>% 
	mutate(c_dist = (c_tm_y-tar_dong_data$c_tm_y[1])^2+(c_tm_x-tar_dong_data$c_tm_x[1])^2)


df2 <- df1 %>%
	group_by(c_date) %>%
	summarize(c_mean = sum(((1/c_dist)*c_mean)/sum(1/c_dist)),
		c_median = sum(((1/c_dist)*c_median)/sum(1/c_dist)),
		c_mean_per_area = sum(((1/c_dist)*c_mean_per_area)/sum(1/c_dist)),
		c_median_per_area = sum(((1/c_dist)*c_median_per_area)/sum(1/c_dist)),
		c_mean_mon = sum(((1/c_dist)*c_mean_mon)/sum(1/c_dist)),
		c_median_mon = sum(((1/c_dist)*c_median_mon)/sum(1/c_dist)),
		c_mean_mon_per_area = sum(((1/c_dist)*c_mean_mon_per_area)/sum(1/c_dist)),
		c_median_mon_per_area = sum(((1/c_dist)*c_median_mon_per_area)/sum(1/c_dist)),
		c_rate = sum(((1/c_dist))/sum(1/c_dist))) %>%
	ungroup()


na_date <- tar_dong_seq$c_date[is.na(tar_dong_seq$c_median)]

if (length(na_date)!=0){
for (ix in 1:length(na_date)){
tar_dong_seq[tar_dong_seq$c_date==na_date[ix],5:8] <- df2[tar_dong_seq$c_date==na_date[ix],2:5]
}
}

if (ik==1){
tar_dong_out <- tar_dong_seq[,1:8] %>% as.tibble()
} else{
tar_dong_out <- rbind(tar_dong_out, tar_dong_seq[,1:8])
}


}

write.csv(tar_dong_out, paste(filepath, out_fn, sep='/'), row.names=FALSE)





