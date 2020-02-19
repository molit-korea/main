vds_interval<-read.csv(file="/Volumes/Seagate Backup Plus Drive/VDS_range_speed_5min_1M_201904.csv",header=F)

#출근시간 한정0800~1000
morning_vds_interval<-subset(vds_interval,V2>0555 & V2<1005)
data<-data.frame(morning_vds_interval$V2,morning_vds_interval$V5)

# library
library(ggplot2)
library(gridExtra)

#Basic line plot 0600 am~1000 am
ggplot(data=data, aes(x=morning_vds_interval$V2,y=morning_vds_interval$V5))+geom_line(color="#00AFBB",size=1)+xlab("minutes of data")+ylab("Total Transformation")


# create data
set.seed(123)

#Quick display to assess the distribution and correlation of variables
install.packages("GGally")
library(GGally)

#Create data
weather<-read.csv(file="/Users/kjm0623v/Downloads/ETC_Weather_U.csv",header=F)
head(weather)

#multiple line plot
ggplot(data, aes(x=morning_vds_interval$V2,y=morning_vds_interval$V5)) + geom_line(aes(color = "#E7B800"), size = 1) +
  scale_color_manual(values = c("#00AFBB", "#E7B800")) +  theme_minimal()

