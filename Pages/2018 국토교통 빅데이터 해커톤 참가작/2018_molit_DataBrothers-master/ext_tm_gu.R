# inital setting
rm(list = ls())
dir <- 'C:/Users/Taewoong/Projects/Hackerthon/01_Code'
setwd(dir)

source("functions/import_packages.r")
library(rgdal) 

# file path
filepath <- "../00_Data/서울시_좌표"
filename <- '서울시 행정구역 시군구 정보 (좌표계_ WGS1984).xlsx'
out_name <- 'WGS84_GU_서울시_위치.csv'
file_path_name <- paste(filepath, filename, sep = '/')

# read data
#dong_cord <- as.tibble(fread(file_path_name))
dong_cord <- as.tibble(read_excel(file_path_name))

colnames(dong_cord)[3] <- 'c_gu'
colnames(dong_cord)[6] <- 'c_lat'
colnames(dong_cord)[7] <- 'c_lon'

df_cord <- dong_cord %>%
	transform(c_lat=as.numeric(c_lat), c_lon=as.numeric(c_lon)) %>%
	select(c_gu, c_id=시군구코드, c_lon, c_lat)

xy <- cbind(df_cord$c_lon, df_cord$c_lat) 
tm <- project(xy, "+proj=utm +zone=52 ellps=WGS84") 	
tm[,1]
df_cord <- df_cord %>% mutate(c_tm_y=tm[,1], c_tm_x=tm[,2])

write.csv(df_cord, paste(filepath, out_name, sep='/'), row.names=FALSE)

