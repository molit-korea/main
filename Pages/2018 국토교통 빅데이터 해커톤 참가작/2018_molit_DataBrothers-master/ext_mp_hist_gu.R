# inital setting
rm(list = ls())
dir <- 'C:/Users/Taewoong/Projects/Hackerthon/01_Code'
setwd(dir)

source("functions/import_packages.r")

# input
rest_type <- '아파트' # '다세대', '아파트', '오피스텔'
price_type <- '전세' # '매매', '전세'

# file path
file_path <- "../00_Data/실거래가_OUT/"

# set time sequence
time_seq <- tibble(c_date = seq(as.Date('2011-01-01'), as.Date('2018-04-01'), by = 'month'))
yr_mon <- format(time_seq$c_date, "%Y%m")

# set file names
file_name_1 <- paste('TBL_Mod_서울시_구별', rest_type, price_type, sep='_')
file_name_2 <- '../서울시_좌표/WGS84_GU_서울시_위치'
out_name <- paste('MPG_서울시_구별', rest_type, price_type, 'Historical', sep='_')

# read data
data_1 <- as.tibble(fread(paste(file_path, file_name_1, '.csv', sep = '')))
data_2 <- as.tibble(fread(paste(file_path, file_name_2, '.csv', sep = '')))

df1 <- data_1 %>%
	left_join(data_2, by="c_gu") %>%
	select(c_date, c_si, c_gu, id=c_id, c_mean, c_median, c_mean_per_area,
		c_median_per_area, is_na)

out_df <- df1

write.csv(out_df, paste(file_path, out_name, '.csv', sep=''), row.names=FALSE)


