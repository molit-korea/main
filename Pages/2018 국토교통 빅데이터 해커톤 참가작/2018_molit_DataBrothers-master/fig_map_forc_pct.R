# inital setting
rm(list = ls())

dir <- "C:/Users/Taewoong/Projects/Hackerthon/01_Code"
setwd(dir)

source("functions/import_packages.r")
source("functions/plotting_functions.r")

library(ggmap)
library(raster)
library(viridis)

# input
rest_type <- '아파트' # '다세대', '아파트', '오피스텔'
price_type <- c('매매', '전세') # '매매', '전세'
tar_data <- 2 # mean: 1, median: 2, mean/area: 3, median/area: 4
tar_date <- '2018-07-01' 

# set file names
data_type <- c('Mean', 'Median', 'MeanPA', 'MedianPA')
bar_title <- c('가격차이\n(백만원)', '가격차이\n(백만원)', '가격차이\n(백만원)', '가격차이\n(백만원)')
fig_title <- c('Upper 95 percentile', 'Median', 'Lower 95 Percentile') 
value_type <- c('Historical', 'Forecast')
file_path <- "../00_Data/실거래가_OUT/"
fig_path <- "../00_Data/Figures/Historical/"
file_name_1 <- paste('MPG_서울시_구별', rest_type, price_type[1], 
			value_type[1], sep='_')

file_name_2 <- paste('MPG_서울시_구별', rest_type, price_type[1], 
			data_type[tar_data], value_type[2], sep='_')

file_name_3 <- paste('MPG_서울시_구별', rest_type, price_type[2], 
			value_type[1], sep='_')

file_name_4 <- paste('MPG_서울시_구별', rest_type, price_type[2], 
			data_type[tar_data], value_type[2], sep='_')


out_name <- paste('MPG_PCT_서울시_구별', rest_type, data_type[tar_data],
		value_type[2], sep='_')

ttl_lab <- c('(a)', '(b)', '(c)', '(d)', '(e)', '(f)')
scale_lim <- list(c(-150, 150), c(-150, 150), c(-3.4, 3.4), c(-3.4, 3.4))

p <- list(1,2,3,4)

ik <- 1

for (ix in 1:3){



# read data
data_1 <- as.tibble(fread(paste(file_path, file_name_1, '.csv', sep = ''))) %>%
		filter(c_date=='2018-04-01')
		
data_2 <- as.tibble(fread(paste(file_path, file_name_2, '.csv', sep = ''))) %>%
		filter(c_date==tar_date)

data_3 <- as.tibble(fread(paste(file_path, file_name_3, '.csv', sep = ''))) %>%
		filter(c_date=='2018-04-01')
		
data_4 <- as.tibble(fread(paste(file_path, file_name_4, '.csv', sep = ''))) %>%
		filter(c_date==tar_date)

# read shape
korea <- shapefile('../00_Data/서울시_좌표/TL_SCCO_SIG.shp')

# shp to dataframe
korea <- fortify(korea,region='SIG_CD')

# merge
merge_data_1 <- merge(korea, data_1, by="id")
merge_data_1 <- merge_data_1[order(merge_data_1$order), ]
merge_data_2 <- merge(korea, data_2, by="id")
merge_data_2 <- merge_data_2[order(merge_data_2$order), ]
merge_data_3 <- merge(korea, data_3, by="id")
merge_data_3 <- merge_data_3[order(merge_data_3$order), ]
merge_data_4 <- merge(korea, data_4, by="id")
merge_data_4 <- merge_data_4[order(merge_data_4$order), ]

# Seoul
seoul_1 <- merge_data_1[merge_data_1$id <= 11740,]
seoul_2 <- merge_data_2[merge_data_2$id <= 11740,]
seoul_3 <- merge_data_3[merge_data_3$id <= 11740,]
seoul_4 <- merge_data_4[merge_data_4$id <= 11740,]

colnames(seoul_1)[10+tar_data] <- "c_value"
colnames(seoul_2)[11+ix] <- "c_fcast"
seoul_2$c_fcast <- seoul_2$c_fcast-seoul_1$c_value

colnames(seoul_3)[10+tar_data] <- "c_value"
colnames(seoul_4)[11+ix] <- "c_fcast"
seoul_4$c_fcast <- seoul_4$c_fcast-seoul_3$c_value

# combine
x <- list(seoul_2, seoul_4)

for (iy in 1:2){

title <- paste(ttl_lab[ik], ' ', price_type[iy], '가 ', fig_title[ix],' (',
		year(as.Date(tar_date)), '.0', month(as.Date(tar_date)),
			'), sep='')


xp <- x[[iy]]
#par(mar=c(4.5,4.5,2,0.5))

p[[ik]] <- ggplot() + geom_polygon(data=xp,
	aes(x=long, y=lat, group=group, fill=c_fcast/100), color='black') +
	scale_fill_gradient2(limits=scale_lim[[tar_data]], 
			low="blue", mid="white", high="red", name=bar_title[tar_data]) + 
	theme_void() + coord_fixed(1) + ggtitle(title)


ik <- ik+1

}
}



tiff(paste(fig_path, out_name, '.tif',sep=''), 
	width = 20, height = 20, units = 'cm', res = 300)

layout <- matrix(c(1,2,3,4,5,6),3,2,byrow=TRUE)
multiplot(p[[1]], p[[2]], p[[3]], p[[4]], p[[5]], p[[6]], layout=layout)

dev.off()





