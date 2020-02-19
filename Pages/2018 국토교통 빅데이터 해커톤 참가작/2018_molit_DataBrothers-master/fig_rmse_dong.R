# inital setting
rm(list = ls())
dir <- 'C:/Users/Taewoong/Projects/Hackerthon/01_Code'
setwd(dir)

source("functions/import_packages.r")
source("functions/ts_models.r")

# input
rest_type <- '아파트' # '다세대', '아파트', '오피스텔'
price_type <- c('매매', '전세') # '매매', '전세'
tar_data <- 1 # mean: 1, median: 2, mean/area: 3, median/area: 4
tar_value <- 1  # historical: 1, forecast: 2, p_value: 3, ARIMA_model: 4

#for (tar_data in 1:4){

# file path
file_path <- "../00_Data/실거래가_OUT/"
fig_path <- "../00_Data/Figures/RMSE/"

data_type <- c('Mean', 'Median', 'MeanPA', 'MedianPA')
value_type <- c('Historical', 'Forecast', 'P_value', 'ARIMA_model')
file_name_1 <- paste('TSD', rest_type, price_type[1], data_type[tar_data],
			 value_type[tar_value], sep='_')
file_name_2 <- paste('TSD', rest_type, price_type[2], data_type[tar_data],
			 value_type[tar_value], sep='_')
fig_name <- paste('서울시', rest_type, '동단위_RMSE', 
			data_type[tar_data], sep='_')

# read data
data_1 <- as.tibble(fread(paste(file_path, file_name_1, '.csv', sep = ''))) %>%
	filter(is_na==0)
data_2 <- as.tibble(fread(paste(file_path, file_name_2, '.csv', sep = ''))) %>%
	filter(is_na==0)
data_11 <- data_1 %>% filter(HoltWinter!=0)
data_22 <- data_2 %>% filter(HoltWinter!=0)

x <- list(data_1$c_value/10000, data_2$c_value/10000, 
		data_11$c_value, data_22$c_value) 
y <- list(data_1$ARIMA/10000, data_2$ARIMA/10000, 
		data_1$Prophet/10000, data_2$Prophet/10000, 
		data_11$HoltWinter/10000, data_22$HoltWinter/10000, 
		data_1$MLM/10000, data_2$MLM/10000)

title <- c("(a) '구' 단위 매매", "(b) '구' 단위 전세", 
		"(c) '구' 단위 매매", "(d) '구' 단위 전세", 
		"(e) '구' 단위 매매", "(f) '구' 단위 전세", 
		"(g) '구' 단위 매매", "(h) '구' 단위 전세")

x.label <- c('ARIMA 추정가 (억원)', 'Prophet 추정가 (억원)', 
		'Holt-Winter 추정가 (억원)', 'MLM 추정가 (억원)')
y.label <- '실거래가 (억원)'
cx <- 1.4

tiff(paste(fig_path, fig_name, '.tif',sep=''), 
	width = 16, height = 30, units = 'cm', res = 300)

par(mfrow=c(4,2))

ik <- 1

for (ix in 1:4){
for (iy in 1:2){

if (ix==3){ 
xp <- x[[iy+2]]
} else{
xp <- x[[iy]]
}

yp <- y[[ik]]

y.max <- c(max(xp),max(yp))
y.lim <- c(0, ceiling(max(y.max)+1/10))
x.lim <- y.lim

plot(-1000,-1000, xlab=x.label[ix], ylab=y.label, las=1, 
	xlim=x.lim, ylim=y.lim, cex.axis=cx, cex.lab=cx)


points(xp, yp, pch=21, col="black", bg="blue", lwd=1, cex=1.5)
lines(x=c(-100,10000), y=c(-100,10000), col='red', lwd=2, lty=1)
title(title[ik], font.main=1, cex.main=cx, adj=0, line=0.7)

rmse <- sqrt(sum((xp-yp)^2)/length(xp))
text(150, 450, sprintf("RMSE = %.4f",rmse), cex = cx)

ik <- ik+1

}
}

dev.off()
