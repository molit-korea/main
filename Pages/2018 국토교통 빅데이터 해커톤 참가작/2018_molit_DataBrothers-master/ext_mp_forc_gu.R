# inital setting
rm(list = ls())
dir <- 'C:/Users/Taewoong/Projects/Hackerthon/01_Code'
setwd(dir)

source("functions/import_packages.r")

# input
rest_type <- '아파트' # '다세대', '아파트', '오피스텔'
price_type <- '전세' # '매매', '전세'
#tar_data <- 1 # mean: 1, median: 2, mean/area: 3, median/area: 4

for (tar_data in 1:4){

# file path
file_path <- "../00_Data/실거래가_OUT/"

# set file names
data_type <- c('Mean', 'Median', 'MeanPA', 'MedianPA')
file_name_1 <- paste('TSG', rest_type, price_type, data_type[tar_data],
			 'Forecast', sep='_')
file_name_2 <- '../서울시_좌표/WGS84_GU_서울시_위치'
out_name <- paste('MPG_서울시_구별', rest_type, price_type, data_type[tar_data],
		'Forecast', sep='_')

# read data
data_1 <- as.tibble(fread(paste(file_path, file_name_1, '.csv', sep = ''))) %>%
		filter(c_model=='ARIMA')

col_split <- strsplit(data_1$c_loc,' ')

c_si <- col_split[[1]][1]
c_gu <- col_split[[1]][2]

for (ix in 2:length(data_1$c_loc)){
c_si[ix] <- col_split[[ix]][1]
c_gu[ix] <- col_split[[ix]][2]
}

data_1 <- data_1 %>% mutate(c_si=c_si, c_gu=c_gu) %>%
		select(c_date, c_si, c_gu, c_model, c_forecast, low95, hi95)

data_2 <- as.tibble(fread(paste(file_path, file_name_2, '.csv', sep = ''))) %>%
		select(c_gu, c_id)

df1 <- data_1 %>%
	left_join(data_2, by='c_gu')%>%
	select(c_date, c_si, c_gu, id=c_id, c_model, c_forecast, low95, hi95)

out_df <- df1

write.csv(out_df, paste(file_path, out_name, '.csv', sep=''), row.names=FALSE)

}




