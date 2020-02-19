# inital setting
rm(list = ls())

dir <- "C:/Users/Taewoong/Projects/Hackerthon/01_Code"
setwd(dir)

source("functions/import_packages.r")

library(ggmap)
library(raster)
library(viridis)

# input
rest_type <- '아파트' # '다세대', '아파트', '오피스텔'
price_type <- '매매' # '매매', '전세'
tar_data <- 4 # mean: 1, median: 2, mean/area: 3, median/area: 4
tar_date <- c('2011-04-01', '2015-04-01', '2018-04-01') 

# set file names
data_type <- c('Mean', 'Median', 'MeanPA', 'MedianPA')
value_type <- c('Historical', 'Forecast')
file_path <- "../00_Data/실거래가_OUT/"
file_name_1 <- paste('MPG_서울시_구별', rest_type, price_type, 
			value_type[1], sep='_')

file_name_2 <- paste('MPG_서울시_구별', rest_type, price_type, 
			data_type[tar_data], value_type[2], sep='_')


# read data
data_1 <- as.tibble(fread(paste(file_path, file_name_1, '.csv', sep = ''))) %>%
		filter(c_date==tar_date)
		
data_2 <- as.tibble(fread(paste(file_path, file_name_2, '.csv', sep = ''))) %>%
		filter(c_date==tar_date)

# read shape
korea <- shapefile('../00_Data/서울시_좌표/TL_SCCO_SIG.shp')

# shp to dataframe
korea <- fortify(korea,region='SIG_CD')
head(korea)

# merge
merge_data <- merge(korea, data_1, by="id")
merge_data <- merge_data[order(merge_data$order), ]
head(merge_data)

# Seoul
seoul <- merge_data[merge_data$id <= 11740,]

ggplot() + 
  	geom_polygon(data=seoul,
	aes(x=long, y=lat, group=group, fill=c_mean-c_median), colour="black", size=.1) +
  	scale_fill_gradient2(limits=c(-5000,5000), low="blue", mid="white", high="red", name="Mean") +
  	theme_void() + coord_fixed(1) + ggtitle("아파트 매매")


head(seoul)

ggplot() + geom_polygon(data=seoul,
		aes(x=long, y=lat, group=group), 
		fill='white', color='black')

ggplot() + geom_polygon(data=seoul,
		aes(x=long, y=lat, group=group, fill=c_mean), color='black') +
		scale_fill_viridis(direction=-1) + theme_void()


ggplot() + geom_polygon(data=seoul,
		aes(x=long, y=lat, group=group, fill=c_mean), color='black') +
		scale_fill_viridis(direction=-1) + theme_void() +
		guides(fill=F)




