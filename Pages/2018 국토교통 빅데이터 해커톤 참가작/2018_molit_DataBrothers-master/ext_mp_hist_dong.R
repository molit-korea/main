# inital setting
rm(list = ls())
dir <- 'C:/Users/Taewoong/Projects/Hackerthon/01_Code'
setwd(dir)

source("functions/import_packages.r")

# input
rest_type <- '아파트' # '다세대', '아파트', '오피스텔'
price_type <- '매매' # '매매', '전세'
tar_data <- 1 # mean: 1, median: 2, mean/area: 3, median/area: 4
tar_value <- 1  # historical: 1, forecast: 2, p_value: 3, ARIMA_model: 4

# file path
file_path <- "../00_Data/실거래가_OUT/"

data_type <- c('Mean', 'Median', 'MeanPA', 'MedianPA')
value_type <- c('Historical', 'Forecast', 'P_value', 'ARIMA_model')
file_name_1 <- paste('TSG', rest_type, price_type[1], data_type[tar_data],
			 value_type[tar_value], sep='_')
file_name_2 <- paste('TSG', rest_type, price_type[2], data_type[tar_data],
			 value_type[tar_value], sep='_')
file_name_3 <- paste('TSD', rest_type, price_type[1], data_type[tar_data],
			 value_type[tar_value], sep='_')
file_name_4 <- paste('TSD', rest_type, price_type[2], data_type[tar_data],
			 value_type[tar_value], sep='_')


fig_name <- paste('서울시', rest_type, 'RMSE', 
			data_type[tar_data], sep='_')

# read data
data_1 <- as.tibble(fread(paste(file_path, file_name_1, '.csv', sep = ''))) %>% filter(is_na==0)
data_2 <- as.tibble(fread(paste(file_path, file_name_2, '.csv', sep = ''))) %>% filter(is_na==0)
data_3 <- as.tibble(fread(paste(file_path, file_name_3, '.csv', sep = ''))) %>% filter(is_na==0)
data_4 <- as.tibble(fread(paste(file_path, file_name_4, '.csv', sep = ''))) %>% filter(is_na==0)
