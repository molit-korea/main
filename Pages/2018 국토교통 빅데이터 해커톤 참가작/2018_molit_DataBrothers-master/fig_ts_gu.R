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

#for (tar_data in 1:4){


data_type <- c('Mean', 'Median', 'MeanPA', 'MedianPA')
value_type <- c('Historical', 'Forecast', 'P_value', 'ARIMA_model')

# file path
file_path <- "../00_Data/실거래가_OUT/"
fig_path <- "../00_Data/Figures/RMSE/"

# file name
data_fn <- paste('TSG', rest_type, price_type, data_type[tar_data],
			 value_type[tar_value], sep='_')
fig_fn <- paste('서울시', rest_type, price_type, '구단위_시계열', 
			data_type[tar_data], sep='_')
loc_fn <- paste('LOC_GU_', rest_type,'.csv', sep='')

# read data
loc_data <- as.tibble(fread(paste(file_path, loc_fn, sep = '')))
data <- as.tibble(fread(paste(file_path, data_fn, '.csv', sep = '')))

tar_loc <- loc_data$c_gu[1]
tar_data <- data %>% filter(c_gu==tar_loc)

plot(tar_data$c_value/10000)

tiff(paste(fig_path, fig_name, '.tif',sep=''), 
	width = 20, height = 20, units = 'cm', res = 300)

# out, box, whisk, med, staple
# lty(line style), lwd(line width), col(line color)
# pch(symbol style), cex(size of symbol), bg(background color)

x.label <- ""
y.label <- "p-value"
title <- paste('서울시', rest_type, price_type, '동단위 시계열 모델 검정')
y.lim <- c(-0.1, 1.1)
x.lim <- c(0.5, (4 + 0.5))

plot(0,0, xaxt='n', xlab=x.label, ylab=y.label, main=title, 
		xlim=x.lim, ylim=y.lim)

grid(nx=NA, ny=NULL, col='lightgrey')
lines(x=c(-1,100), y=c(0.05,0.05), col='black', lty=2)     

boxplot(data[3:6], add=TRUE, xaxt='n', medcol="blue", medlwd=1.5, 
		boxlty=1, whisklty=2, staplelwd=1, 
		outcol="red", outpch=3, outcex=1)

dats <- c('ARIMA', 'Prophet', 'Holt-Winter', 'MLM')
axis(side=1, at=1:4, labels=dats)
means <- c(mean(data$ARIMA),mean(data$Prophet),mean(data$HoltWinter),mean(data$MLM))
points(means, col="red", pch=1, lwd=1, cex=1.7)


dev.off()

}

