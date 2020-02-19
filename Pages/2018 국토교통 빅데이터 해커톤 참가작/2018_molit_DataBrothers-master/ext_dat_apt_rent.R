# unit_area <- 3.305785 # 1평=3.305785m^2

# inital setting
rm(list = ls())
dir <- 'C:/Users/Taewoong/Projects/Hackerthon/01_Code'
setwd(dir)

source("functions/import_packages.r")

# input
rest_type <- '아파트' # '다세대', '아파트', '오피스텔'
price_type <- '전월세' 

out_name_all <- paste('TBL_서울시', rest_type, '전세.csv', sep='_')
out_name_mon <- paste('TBL_서울시', rest_type, '월세.csv', sep='_')

# file path
filepath <- '../00_Data/실거래가_RAW'
out_path = "../00_Data/실거래가_OUT"
#dir.create(out_path)

# set time sequence
time_seq <- tibble(c_date = seq(as.Date('2011-01-01'), as.Date('2018-04-01'), by = 'month'))
yr_mon <- format(time_seq$c_date, "%Y%m")

filename <- paste(rest_type, '(', price_type, ')_실거래가_', yr_mon, '.xlsx', sep='')
file_path_name <- paste(filepath, filename, sep = '/')

# collect all data to one df
for (ix in 1:length(file_path_name)){

rest_price <- as.tibble(read_excel(file_path_name[ix]))

colnames(rest_price)[7] <- 'c_area'
colnames(rest_price)[10] <- 'c_value'
colnames(rest_price)[11] <- 'c_value_mon'

a1 <- sum(is.na(rest_price$c_area))
a2 <- sum(is.na(rest_price$c_value))
a3 <- sum(is.na(rest_price$c_value_mon))

if (a1+a2+a3){
a1
a2
a3
}

rest_price <- rest_price %>%
	transform(c_area = as.numeric(c_area),
		 c_value = as.integer(gsub(",","", c_value)),
		 c_value_mon = as.integer(c_value_mon))

rest_all <- rest_price %>% filter(전월세구분 == '전세')
rest_mon <- rest_price %>% filter(전월세구분 == '월세')

all_loc <- strsplit(rest_all$시군구," ")
all_loc_si <- all_loc[[1]][1]
all_loc_gu <- all_loc[[1]][2]
all_loc_dong <- all_loc[[1]][3]
for (i in 2:length(all_loc)){
	all_loc_si[i] <- all_loc[[i]][1]
	all_loc_gu[i] <- all_loc[[i]][2]
	all_loc_dong[i] <- all_loc[[i]][3]
}

mon_loc <- strsplit(rest_mon$시군구," ")
mon_loc_si <- mon_loc[[1]][1]
mon_loc_gu <- mon_loc[[1]][2]
mon_loc_dong <- mon_loc[[1]][3]
for (i in 2:length(mon_loc)){
	mon_loc_si[i] <- mon_loc[[i]][1]
	mon_loc_gu[i] <- mon_loc[[i]][2]
	mon_loc_dong[i] <- mon_loc[[i]][3]
}

df_all <- rest_all %>%
	mutate(c_date=time_seq$c_date[ix], c_si=all_loc_si,  
		 c_gu=all_loc_gu, c_dong=all_loc_dong) %>%
	select(c_date=c_date, c_si=c_si, c_gu=c_gu, c_dong=c_dong, 
		 c_area=c_area, c_value=c_value)

df_mon <- rest_mon %>%
	mutate(c_date=time_seq$c_date[ix], c_si=mon_loc_si,  
		 c_gu=mon_loc_gu, c_dong=mon_loc_dong) %>%
	select(c_date=c_date, c_si=c_si, c_gu=c_gu, c_dong=c_dong, 
		 c_area=c_area, c_value=c_value, c_value_mon=c_value_mon)

if (ix==1){
df_all_out <- df_all
df_mon_out <- df_mon
} else{
df_all_out <- rbind(df_all_out, df_all)
df_mon_out <- rbind(df_mon_out, df_mon)
}

}

# save df
write.csv(df_all_out, paste(out_path, out_name_all, sep='/'), row.names=FALSE)
write.csv(df_mon_out, paste(out_path, out_name_mon, sep='/'), row.names=FALSE)
