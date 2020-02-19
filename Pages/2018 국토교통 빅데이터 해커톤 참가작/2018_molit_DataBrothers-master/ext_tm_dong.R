# inital setting
rm(list = ls())
dir <- 'C:/Users/Taewoong/Projects/Hackerthon/01_Code'
setwd(dir)

source("functions/import_packages.r")
library(rgdal) 

# file path
filepath <- "../00_Data/서울시_좌표"
filename <- '서울시 행정구역 읍면동 위치정보 (좌표계_ WGS1984).xlsx'
out_name <- 'WGS84_DONG_서울시_위치.csv'
file_path_name <- paste(filepath, filename, sep = '/')

# read data
dong_cord <- as.tibble(read_excel(file_path_name))

colnames(dong_cord)[2] <- 'c_code'
colnames(dong_cord)[3] <- 'c_dong'
colnames(dong_cord)[5] <- 'c_lat'
colnames(dong_cord)[6] <- 'c_lon'

# code data
code_fname <- '법정동코드 전체자료.txt'
code_path_name <- paste(filepath, code_fname, sep = '/')
code_data <- as.tibble(fread(code_path_name))

colnames(code_data)[1] <- 'c_code'
colnames(code_data)[2] <- 'c_name'
colnames(code_data)[3] <- 'c_exist'

str_loc <- strsplit(code_data$c_name, " ")
str_loc_si <- str_loc[[1]][1]
str_loc_gu <- str_loc[[1]][2]
str_loc_dong <- str_loc[[1]][3]
for (i in 2:length(str_loc)){
	str_loc_si[i] <- str_loc[[i]][1]
	str_loc_gu[i] <- str_loc[[i]][2]
	str_loc_dong[i] <- str_loc[[i]][3]
}

check_code <- tibble(c_code = substr(code_data$c_code, 1, 8),
		c_si = str_loc_si,
		c_gu = str_loc_gu,
		c_dong_c = str_loc_dong)

df_cord <- dong_cord %>%
	left_join(check_code, by='c_code')%>%
	transform(c_lat=as.numeric(c_lat), c_lon=as.numeric(c_lon)) %>%
	select(c_si, c_gu, c_dong, c_id=c_code, c_lon, c_lat)

xy <- cbind(df_cord$c_lon, df_cord$c_lat) 
tm <- project(xy, "+proj=utm +zone=52 ellps=WGS84") 	
tm[,1]
df_cord <- df_cord %>% mutate(c_tm_y=tm[,1], c_tm_x=tm[,2])

write.csv(df_cord, paste(filepath, out_name, sep='/'), row.names=FALSE)

