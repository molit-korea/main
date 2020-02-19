setwd("D:/해커톤/data/01 전처리 데이터")

# install.packages("data.table")
# install.packages("ggplot2")
# install.packages("xlsx")
# install.packages("ggmap")
# install.packages("bit64")
# install.packages("car")
# install.packages("TSdist")

library(data.table)
library(ggplot2)
library(xlsx)
library(dplyr)
library('ggmap')
library(bit64)
library(car)
library(TSdist)
library(reshape)

# 1. data load ------------------------------------------------------------

taxi.dat <- readRDS("dtg_taxi_dat_rds")
#taxi.dat <- readRDS("dtg_bus_dat_rds")

link.dat <- read.csv("link_2015.csv", header = T)
node.xy.dat <- read.csv("node_2015_wgs84.csv", header = T)

tar.link.list <- c('1039257', '1096146', '1038170', '1090936', '1038125', '1101163', # 강남대로 상행
                 '1039256', '1096147', '1038171', '1090937', '1038126', '1098446', # 강남대로 하행
                 '1038175', '1038194', #뱅뱅사거리 강남대로방향 동쪽행
                 '1038174', '1038212', #뱅뱅사거리 강남대로방향 서쪽행
                 '1038169', '1038214', #강남역 강남대로방향 서쪽행 (테헤란로구간)
                 '1038134', '1038127', #강남역 강남대로방향 동쪽행
                 '1039230', '1039234'  #신논현역 강남대로방향 서쪽행
)      
tar.node.list <- unique(unlist(link.dat[which(link.dat$k_link_id %in% tar.link.list),2:3]))
tar.node.xy <- node.xy.dat[which(node.xy.dat$k_node_id %in% tar.node.list),4:5]
tar.nodelist.xy <- node.xy.dat[which(node.xy.dat$k_node_id %in% tar.node.list), ]



tar.link.node.list.a <- merge.data.frame(link.dat, tar.nodelist.xy, by.x = "fnode_id", by.y = "k_node_id")
tar.link.node.list.b <- merge.data.frame(tar.link.node.list.a, tar.nodelist.xy, by.x = "tnode_id", by.y = "k_node_id")
tar.link.node.list <- data.frame(k_link_id=tar.link.node.list.b$k_link_id, road_name=tar.link.node.list.b$road_name, 
                                 fnode_id=tar.link.node.list.b$fnode_id, fnode_name=tar.link.node.list.b$node_name.x, 
                                 tnode_id=tar.link.node.list.b$tnode_id, tnode_name=tar.link.node.list.b$node_name.y)



tar.road.list <- data.frame(
  matrix(nrow=22, byrow=T, c(
    "신사역","논현역",
    "논현역","교보타워사거리",
    "교보타워사거리","차병원",
    "차병원","경복아파트",
    "경복아파트","르네상스호텔",
    "차병원","역삼역",
    "교보타워사거리","강남역",
    "역삼역","르네상스호텔",
    "강남역","역삼역",
    "법원검찰청","강남역",
    "서초역사거리","법원검찰청",
    "서초역사거리","서초3동사거리",
    "서초3동사거리","남부터미널",
    "법원검찰청","남부터미널",
    "남부터미널","뱅뱅사거리",
    "뱅뱅사거리","양재역",
    "양재역","교육개발원입구",
    "강남역","뱅뱅사거리",
    "르네상스호텔","강남세브란스",
    "도곡1동주민센터","강남세브란스",
    "역삼역","도곡1동주민센터",
    "뱅뱅사거리","도곡1동주민센터"
  )), stringsAsFactors=F)

remove_outlier <- function(outdata){
  model <- lm("차량위치_Y ~ 차량위치_X", data=outdata)
  outlier_list <- outlierTest(model, n.max = 999999)
  result_out <- outdata[-which(rownames(outdata) %in% names(outlier_list$bonf.p)),]
  return(result_out)
}


plot.frequency.spectrum <- function(X.k, xlimits=c(0,length(X.k))) {
  plot.data  <- cbind(0:(length(X.k)-1), Mod(X.k))
  
  # TODO: why this scaling is necessary?
  plot.data[2:length(X.k),2] <- 2*plot.data[2:length(X.k),2] 
  
  plot(plot.data, t="h", lwd=2, main="", 
       xlab="Frequency (Hz)", ylab="Strength", 
       xlim=xlimits, ylim=c(0,max(Mod(plot.data[,2]))))
}

# 2. data extract ---------------------------------------------------------

# taxi.dat.04to24 <- taxi.dat[정보_발생_일시 %between% c(17080704000000, 17080723595900)]

# initialize

stop.sec = 10
cnt = 0
result = data.frame(no=NULL, link=NULL, cnt_car=NULL, cnt_stop=NULL, per_carstop=NULL, avg_spd=NULL, var_spd=NULL)
result.avgspd.by.link = data.frame()

# 
par(mfrow=c(2,1))

#for(i in 1:nrow(tar.road.list)){
{
  
  i <- 7
  # for(i in 1:2){
  # node
  node1 <- tar.road.list[i,"X1"]
  node2 <- tar.road.list[i,"X2"]
  
  node1.lon <- min(tar.nodelist.xy$POINT_X[tar.nodelist.xy$node_name == node1|tar.nodelist.xy$node_name == node2])
  node2.lon <- max(tar.nodelist.xy$POINT_X[tar.nodelist.xy$node_name == node1|tar.nodelist.xy$node_name == node2])
  
  node1.lat <- min(tar.nodelist.xy$POINT_Y[tar.nodelist.xy$node_name == node1|tar.nodelist.xy$node_name == node2])
  node2.lat <- max(tar.nodelist.xy$POINT_Y[tar.nodelist.xy$node_name == node1|tar.nodelist.xy$node_name == node2])
  
  # subdata
  taxi.dat.sub_ <- taxi.dat[차량위치_X %between% c(node1.lon, node2.lon)&차량위치_Y %between% c(node1.lat, node2.lat)]
  # taxi.dat.sub <- taxi.dat.04to24[차량위치_X %between% c(node1.lon, node2.lon)&차량위치_Y %between% c(node1.lat, node2.lat)]
  # 
  
  taxi.dat.sub <- remove_outlier(taxi.dat.sub_)
  # group
  
  cnt.j <- 0
  
  # cat("\ni=",i,"\n")\
  pdf('taxi_carno_50.pdf')
  
  
  
  for(k in 0:23){
    taxi.dat.sub2 <- taxi.dat.sub[정보_발생_일시 %between% c( 17080700000000 + (k)*1000000,  17080700590000 + (k)*1000000 )]
    yy <- taxi.dat.sub2[taxi.dat.sub2$차량속도 == 0, ]$차량위치_Y
    taxi.carno.list <- unique(taxi.dat.sub2$차대번호) 
    par(mfrow=c(2,1))
    
    for(j in 1:length(taxi.carno.list)){
      
      taxi.dat.tmp <- taxi.dat.sub2[taxi.dat.sub2$차대번호 == taxi.carno.list[j]]  
      
      # print( paste(nrow(taxi.dat.tmp)))
       if(nrow(taxi.dat.tmp) < 50 ) next
      
      plot(x =(taxi.dat.tmp$정보_발생_일시%% 100000000), y = taxi.dat.tmp$차량속도, type='o',
          main = paste("Gyobo ~ Gangnam Station" , " (", k, ") ", taxi.carno.list[j], sep=' ' ))

      #plot.frequency.spectrum( fft(taxi.dat.tmp$차량속도))
      # 
      # 
      ########################
      plot(x = taxi.dat.tmp$차량위치_Y,  y = taxi.dat.tmp$차량속도, col = 'grey', type='o',
           main = paste("(", k, ") ", taxi.carno.list[j], min(taxi.dat.tmp$GIS_방위각), max(taxi.dat.tmp$GIS_방위각), sep=' ' ),
           xlim = c(min(taxi.dat.sub2$차량위치_Y), max(taxi.dat.sub2$차량위치_Y)), ylim = c(0, max(taxi.dat.sub2$차량속도)))
      abline( v= 37.5015, col='red') # 건널
      
      # if( min(taxi.dat.tmp$GIS_방위각) > 120 & max (taxi.dat.tmp$GIS_방위각) < 200){
      #   abline( v= 37.5015, col='skyblue') # 하행
      #  # abline( v= 37.5021, col='skyblue')
      # }
      # 
      # if( min(taxi.dat.tmp$GIS_방위각) < 30 | max (taxi.dat.tmp$GIS_방위각) > 300){
      #   abline( v= 37.5015, col='orange') #상행
      #   # abline( v= 37.5010, col='orange')

      # }
      ###########################
      # 
      # if( j == 1) plot(x = taxi.dat.tmp$차량위치_Y,  y = taxi.dat.tmp$차량속도, col = 'grey', type='l', 
      #                  main = paste("( ", k, " )  ", taxi.carno.list[j], sep='' ), 
      #                  xlim = , ylim = c(0, max(taxi.dat.sub2$차량속도)))
      # else
      #   points(x = taxi.dat.tmp$차량위치_Y,  y = taxi.dat.tmp$차량속도, col = 'grey', type='l', xlim = c(min(taxi.dat.sub2$차량위치_Y), max(taxi.dat.sub2$차량위치_Y)))
      # 
      # if( min(taxi.dat.tmp$GIS_방위각) > 120 & max (taxi.dat.tmp$GIS_방위각) < 200){
      #   abline( v= 37.5015, col='skyblue') # 하행
      #   abline( v= 37.5021, col='skyblue')
      # }
      # 
      # if( min(taxi.dat.tmp$GIS_방위각) < 30 | max (taxi.dat.tmp$GIS_방위각) > 300){
      #   abline( v= 37.5015, col='orange') #상행
      #   abline( v= 37.5010, col='orange')
      # }
    }
  }
  dev.off()
  
}

