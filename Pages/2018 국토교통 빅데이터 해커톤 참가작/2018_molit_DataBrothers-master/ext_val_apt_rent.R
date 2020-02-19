# unit_area <- 3.305785 # 1평=3.305785m^2

# inital setting
rm(list = ls())
dir <- 'C:/Users/Taewoong/Projects/Hackerthon/01_Code'
setwd(dir)

source("functions/import_packages.r")

# input
rest_type <- '아파트' # '다세대', '아파트', '오피스텔'
price_type <- '월세' # '월세'

# file path
filepath <- "../00_Data/실거래가_OUT"
filename <- paste('TBL_서울시_', rest_type, '_', price_type, '.csv', sep='')
out_gu_name <- paste('TBL_서울시_구별_', rest_type, '_', price_type, '.csv', sep='')
out_dong_name <- paste('TBL_서울시_동별_', rest_type, '_', price_type, '.csv', sep='')

file_path_name <- paste(filepath, filename, sep = '/')


# read data
rest_price <- as.tibble(fread(file_path_name))

df_gu <- rest_price %>%
	group_by(c_date, c_si, c_gu) %>%
	summarise(c_mean = mean(c_value, na.rm = TRUE),
		c_median = median(c_value, na.rm = TRUE),
		c_mean_per_area = mean(c_value/(c_area/3.305785), na.rm = TRUE),
		c_median_per_area = median(c_value/(c_area/3.305785), na.rm = TRUE),
		c_mean_mon = mean(c_value_mon, na.rm = TRUE),
		c_median_mon = median(c_value_mon, na.rm = TRUE),
		c_mean_mon_per_area = mean(c_value_mon/(c_area/3.305785), na.rm = TRUE),
		c_median_mon_per_area = median(c_value_mon/(c_area/3.305785), na.rm = TRUE)) %>%
	ungroup()

df_dong <- rest_price %>%
	group_by(c_date, c_si, c_gu, c_dong) %>%
	summarise(c_mean = mean(c_value, na.rm = TRUE),
		c_median = median(c_value, na.rm = TRUE),
		c_mean_per_area = mean(c_value/(c_area/3.305785), na.rm = TRUE),
		c_median_per_area = median(c_value/(c_area/3.305785), na.rm = TRUE),
		c_mean_mon = mean(c_value_mon, na.rm = TRUE),
		c_median_mon = median(c_value_mon, na.rm = TRUE),
		c_mean_mon_per_area = mean(c_value_mon/(c_area/3.305785), na.rm = TRUE),
		c_median_mon_per_area = median(c_value_mon/(c_area/3.305785), na.rm = TRUE)) %>%
	ungroup()


# cordination info.
dong_cord_fname <- '../00_Data/서울시_좌표/WGS84_DONG_서울시_위치.csv'
gu_cord_fname <- '../00_Data/서울시_좌표/WGS84_GU_서울시_위치.csv'
dong_cord_info <- as.tibble(fread(dong_cord_fname))
gu_cord_info <- as.tibble(fread(gu_cord_fname))

df_dong <- df_dong %>%
  left_join(dong_cord_info, by = c("c_si","c_gu","c_dong"))

df_gu <- df_gu %>%
  left_join(gu_cord_info, by = "c_gu")


# save df
write.csv(df_gu, paste(filepath, out_gu_name, sep='/'), row.names=FALSE)
write.csv(df_dong, paste(filepath, out_dong_name, sep='/'), row.names=FALSE)




