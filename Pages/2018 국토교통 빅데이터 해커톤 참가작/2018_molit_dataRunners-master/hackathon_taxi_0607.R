setwd("C:/Users/Ari/Desktop/hackathon")

# install.packages("data.table")
# install.packages("ggplot2")
# install.packages("xlsx")
# install.packages("ggmap")
# install.packages("bit64")
# install.packages("car")

library(data.table)
library(ggplot2)
library(xlsx)
library(dplyr)
library(ggmap)
library(bit64)
library(car)

# 1. data load ------------------------------------------------------------

taxi.dat <- readRDS("data/dtg_taxi_dat_rds")
link.dat <- read.csv("link/link_2015_11000_seoul.csv", header = T)
node.xy.dat <- read.csv("link/node_2015_wgs84.csv", header = T)

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
tar.link.node.list$ang <- c("북","서","서","남","동","북","서","북","서","동",
                            "남","남","서","서","남","동","서","북","남","동",
                            "남","북","동","남","남","서","동","북","남","서",
                            "동","","남","","북","북","서","동","북",
                            "동","북","남","북","남","북","서")
tar.link.node.list$ang_1 <- ifelse(tar.link.node.list$ang=="남",105, 
                                   ifelse(tar.link.node.list$ang=="북", 105,
                                          ifelse(tar.link.node.list$ang=="서", 15,
                                                 ifelse(tar.link.node.list$ang=="동", 15, 0))))
tar.link.node.list$ang_2 <- ifelse(tar.link.node.list$ang=="남",285, 
                                   ifelse(tar.link.node.list$ang=="북", 285,
                                          ifelse(tar.link.node.list$ang=="서", 195,
                                                 ifelse(tar.link.node.list$ang=="동", 195, 0))))
tar.link.node.list$ang_chk <- ifelse(tar.link.node.list$ang=="남"&tar.link.node.list$ang_1==105,"정방향", 
                                   ifelse(tar.link.node.list$ang=="서"&tar.link.node.list$ang_1==15,"정방향","역방향"))

tar.road.list <- data.frame(X1=tar.link.node.list$fnode_name, X2=tar.link.node.list$tnode_name)
tar.road.list <- tar.road.list[-which(tar.road.list$X1=="양재역"&tar.road.list$X2=="양재역"),]

remove_outlier <- function(outdata){
  
  model <- lm("차량위치_Y ~ 차량위치_X", data=outdata)
  outlier_list <- outlierTest(model, n.max = 999999)
  result_out <- outdata[-which(rownames(outdata) %in% names(outlier_list$bonf.p)),]
  return(result_out)
}

# 2. data extract ---------------------------------------------------------
# taxi.dat.04to24 <- taxi.dat[정보_발생_일시 %between% c(17080704000000, 17080723595900)]
  
# initialize
stop.sec = 10
cnt = 0
result = data.frame(no=NULL, link=NULL, cnt_car=NULL, cnt_stop=NULL, per_carstop=NULL, avg_spd=NULL, var_spd=NULL)
result.avgspd.by.link = data.frame()

# 
for(i in 1:nrow(tar.road.list)){
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
  mean(taxi.dat$차량속도)
  # 
  taxi.dat.sub <- remove_outlier(taxi.dat.sub_)
  taxi.dat.check <- tar.link.node.list[tar.link.node.list$fnode_name==node1 & tar.link.node.list$tnode_name==node2,]
  
  taxi.dat.sub$ang <- ifelse(taxi.dat.sub$GIS_방위각 %between% c(taxi.dat.check$ang_1,taxi.dat.check$ang_2), "정방향", "역방향")
  taxi.dat.sub$k_link_id <- ifelse(taxi.dat.sub$ang == "정방향", taxi.dat.check$k_link_id,
                                   tar.link.node.list$k_link_id[tar.link.node.list$fnode_name==node2 & tar.link.node.list$tnode_name==node1])
  
  # group
  taxi.carno.list <- unique(taxi.dat.sub$차대번호) 
  
  cnt.j <- 0
  # cat("\ni=",i,"\n")
  
  for(j in 1:length(taxi.carno.list)){
    
    taxi.dat.tmp <- taxi.dat.sub[taxi.dat.sub$차대번호 == taxi.carno.list[j]]  
    taxi.dat.tmp.rle <- rle(taxi.dat.tmp$차량속도)
    taxi.dat.tmp.rle.stop <- taxi.dat.tmp.rle$lengths[taxi.dat.tmp.rle$values==0]
    taxi.dat.tmp.rle.count <- length(taxi.dat.tmp.rle.stop[taxi.dat.tmp.rle.stop>=stop.sec])
    
    cnt.j <- cnt.j + taxi.dat.tmp.rle.count
    cnt <- cnt + taxi.dat.tmp.rle.count
    
    # cat(" ",taxi.dat.tmp.rle.count) 
    # if(j %% 100 == 0){
    #   cat(" ",taxi.dat.tmp.rle.count) 
    # }
    
  }
  result.tmp <- data.frame(no=i, link=paste0(node1,"~",node2), cnt_car=length(taxi.carno.list), cnt_stop=cnt.j, per_carstop= round(cnt.j/length(taxi.carno.list),2),
                           avg_spd=round(mean(taxi.dat.sub$차량속도),2), var_spd=round(var(taxi.dat.sub$차량속도),2))
  result <- rbind(result, result.tmp)
  
  # result.avgspd.by.link
  taxi.dat.sub[,time:=substr(정보_발생_일시,7,8)]
  avgspd.by.time_ <- taxi.dat.sub[order(time), round(mean(차량속도),3), by=c("k_link_id", "time")]
  avgspd.by.time1 <- avgspd.by.time_[k_link_id==unique(avgspd.by.time_$k_link_id)[1]]
  avgspd.by.time2 <- avgspd.by.time_[k_link_id==unique(avgspd.by.time_$k_link_id)[2]]
  result.avgspd.by.link <- rbind(result.avgspd.by.link, data.frame(k_link_id=unique(avgspd.by.time1$k_link_id), t(avgspd.by.time1$V1)))
  result.avgspd.by.link <- rbind(result.avgspd.by.link, data.frame(k_link_id=unique(avgspd.by.time2$k_link_id), t(avgspd.by.time2$V1)))
  
  cat(paste0("\n# i=",i,"\t| ",node1," ~ ",node2,"\t\t| cnt.carno=",length(taxi.carno.list),"\t| cnt.stop=",cnt.j,"\t| per.stop=",round(cnt.j/length(taxi.carno.list),2),
             "\t| avg.spd=",round(mean(taxi.dat.sub$차량속도),2),"\t| var.spd=",round(var(taxi.dat.sub$차량속도),2)))
}
colnames(result.avgspd.by.link) <- c("k_link_id", 0:23)
result.avgspd.by.link

# ------------------------------------------------------------------------

# map
p3 <- get_map(location = c(lon=127.024646, lat=37.504442), zoom = 13, maptype = "roadmap")
ggmap(p3) + 
  geom_point(data = tar.nodelist.xy, aes(x = POINT_X, y = POINT_Y), size=4, alpha=0.8, col="blue") + 
  geom_text(data = tar.nodelist.xy, aes(x = POINT_X, y = POINT_Y+0.001, label = node_name))

# map for taxi
p3 <- get_map(location = c(lon=127.024646, lat=37.504442), zoom = 13, maptype = "roadmap")
ggmap(p3) + 
  geom_point(data = taxi.c1, aes(x = 차량위치_X, y = 차량위치_Y), size=1, col="blue")