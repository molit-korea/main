# inital setting
rm(list = ls())
dir <- 'C:/Users/Taewoong/Projects/Hackerthon/01_Code'
setwd(dir)

source("functions/import_packages.r")
source("functions/ts_models.r")

# input
rest_type <- '아파트' # '다세대', '아파트', '오피스텔'
price_type <- '매매' # '매매', '전세'
tar_data <- 1 # mean: 1, median: 2, mean/area: 3, median/area: 4
tar_value <- 3  # historical: 1, forecast: 2, p_value: 3, ARIMA_model: 4

for (tar_data in 1:4){

# file path
file_path <- "../00_Data/실거래가_OUT/"
fig_path <- "../00_Data/Figures/p_value/"

data_type <- c('Mean', 'Median', 'MeanPA', 'MedianPA')
value_type <- c('Historical', 'Forecast', 'P_value', 'ARIMA_model')
file_name <- paste('TSD', rest_type, price_type, data_type[tar_data],
			 value_type[tar_value], sep='_')
fig_name <- paste('서울시', rest_type, price_type, '동단위_시계열_모델_검정', 
			data_type[tar_data], sep='_')

# read data
data <- as.tibble(fread(paste(file_path, file_name, '.csv', sep = '')))


tiff(paste(fig_path, fig_name, '.tif',sep=''), 
	width = 16, height = 16, units = 'cm', res = 300)

# out, box, whisk, med, staple
# lty(line style), lwd(line width), col(line color)
# pch(symbol style), cex(size of symbol), bg(background color)

cx <- 1.4
x.label <- ""
y.label <- "p-value"
title <- "(b) '동' 단위 매매가"
y.lim <- c(-0.1, 1.1)
x.lim <- c(0.5, (4 + 0.5))

plot(0,0, xaxt='n', xlab=x.label, ylab=y.label, 
	xlim=x.lim, ylim=y.lim, cex.axis=cx, cex.lab=cx)

title(title, font.main=1, cex.main=cx, adj=0, line=0.7)

#grid(nx=NA, ny=NULL, col='lightgrey')
     
boxplot(data[3:6], add=TRUE, xaxt='n', yaxt='n',
	medcol="blue", medlwd=2, 
	boxlty=1, boxlwd=1, 
	whisklty=2, whisklwd=1,
	staplelwd=1, 
	outcol="red", outpch=3, outlwd=1.2, outcex=1.5)

dats <- c('ARIMA', 'Prophet', 'Holt-Winter', 'MLM')
axis(side=1, at=1:4, labels=dats, cex.axis=1.2)
means <- c(mean(data$ARIMA),mean(data$Prophet),mean(data$HoltWinter),mean(data$MLM))
points(means, col="red", pch=1, lwd=2, cex=2)

lines(x=c(-1,100), y=c(0.05,0.05), col='blue', lwd=1.5, lty=2)

dev.off()

}

