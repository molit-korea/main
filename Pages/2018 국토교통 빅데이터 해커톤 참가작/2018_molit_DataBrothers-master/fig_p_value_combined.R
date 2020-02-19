# inital setting
rm(list = ls())
dir <- 'C:/Users/Taewoong/Projects/Hackerthon/01_Code'
setwd(dir)

source("functions/import_packages.r")
source("functions/ts_models.r")

# input
rest_type <- '아파트' # '다세대', '아파트', '오피스텔'
price_type <- c('매매', '전세') # '매매', '전세'
tar_data <- 4 # mean: 1, median: 2, mean/area: 3, median/area: 4
tar_value <- 3  # historical: 1, forecast: 2, p_value: 3, ARIMA_model: 4


# file path
file_path <- "../00_Data/실거래가_OUT/"
fig_path <- "../00_Data/Figures/p_value/"

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


fig_name <- paste('서울시', rest_type, 'P_value', 
			data_type[tar_data], sep='_')

# read data
data_1 <- as.tibble(fread(paste(file_path, file_name_1, '.csv', sep = ''))) %>% filter(is_na==0)
data_2 <- as.tibble(fread(paste(file_path, file_name_2, '.csv', sep = ''))) %>% filter(is_na==0)
data_3 <- as.tibble(fread(paste(file_path, file_name_3, '.csv', sep = ''))) %>% filter(is_na==0)
data_4 <- as.tibble(fread(paste(file_path, file_name_4, '.csv', sep = ''))) %>% filter(is_na==0)


x <- list(data_1, data_2, data_3, data_4)

title <- c("(a) '구' 단위 매매", "(b) '구' 단위 전세", 
		"(c) '동' 단위 매매", "(d) '동' 단위 전세")

x.label <- ''
y.label <- c("p-value",'')
y.lim <- c(-0.1, 1.1)
x.lim <- c(0.5, (4 + 0.5)) 
cx <- 1.4

tiff(paste(fig_path, fig_name, '.tif',sep=''), 
	width = 25, height = 20, units = 'cm', res = 300)

par(mfrow=c(2,2))

ik <- 1

for (ix in 1:2){
for (iy in 1:2){

xp <- x[[ik]]

par(mar=c(4.5,4.5,2,0.5))
plot(-1000,-1000, xlab=x.label, ylab=y.label[iy], 
	xaxt='n', las=1,
	xlim=x.lim, ylim=y.lim, cex.axis=cx, cex.lab=cx)


boxplot(xp[3:6], add=TRUE, xaxt='n', yaxt='n',
	medcol="blue", medlwd=2, 
	boxlty=1, boxlwd=1, 
	whisklty=2, whisklwd=1,
	staplelwd=1, 
	outcol="red", outpch=3, outlwd=1.2, outcex=1.5)

dats <- c('ARIMA', 'Prophet', 'Holt-Winter', 'MLM')
axis(side=1, at=1:4, labels=dats, cex.axis=1.2)
means <- c(mean(xp$ARIMA),mean(xp$Prophet),mean(xp$HoltWinter),mean(xp$MLM))
points(means, col="red", pch=1, lwd=2, cex=2)

lines(x=c(-1,100), y=c(0.05,0.05), col='blue', lwd=1.5, lty=2)
title(title[ik], font.main=1, cex.main=cx, adj=0, line=0.7)

ik <- ik+1

}
}

dev.off()
