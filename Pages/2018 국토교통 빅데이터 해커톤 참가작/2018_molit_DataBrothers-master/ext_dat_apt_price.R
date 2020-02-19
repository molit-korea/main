# unit_area <- 3.305785 # 1평=3.305785m^2

# inital setting
rm(list = ls())
dir <- 'C:/Users/Taewoong/Projects/Hackerthon/01_Code'
setwd(dir)

source("functions/import_packages.r")

# input
rest_type <- '아파트' # '다세대', '아파트', '오피스텔'
price_type <- '매매' 
out_name <- paste('TBL_서울시_', rest_type, '_', price_type, '.csv', sep='')

# file path
filepath <- '../00_Data/실거래가_RAW'
out_path = "../00_Data/실거래가_OUT"
#dir.create(out_path)

# set time sequence
time_seq <- tibble(c_date = seq(as.Date('2011-01-01'), as.Date('2018-04-01'), by = 'month'))
yr_mon <- format(time_seq$c_date, "%Y%m")

filename <- paste(rest_type, '(', price_type,')_실거래가_', yr_mon, '.xlsx', sep='')
file_path_name <- paste(filepath, filename, sep = '/')

# collect all data to one df
for (ix in 1:length(file_path_name)){

rest_price <- as.tibble(read_excel(file_path_name[ix]))
colnames(rest_price)[6] <- 'c_area'
colnames(rest_price)[9] <- 'c_value'

str_loc <- strsplit(rest_price$시군구," ")
str_loc_si <- str_loc[[1]][1]
str_loc_gu <- str_loc[[1]][2]
str_loc_dong <- str_loc[[1]][3]
for (i in 2:length(str_loc)){
	str_loc_si[i] <- str_loc[[i]][1]
	str_loc_gu[i] <- str_loc[[i]][2]
	str_loc_dong[i] <- str_loc[[i]][3]
}

df <- rest_price %>%
	transform(c_area = as.numeric(c_area),
		 c_value = as.integer(gsub(",","", c_value))) %>%
	mutate(c_date=time_seq$c_date[ix], c_si=str_loc_si,  
		 c_gu=str_loc_gu, c_dong=str_loc_dong) %>%
	select(c_date=c_date, c_si=c_si, c_gu=c_gu, c_dong=c_dong, 
		 c_area=c_area, c_value=c_value) %>%
	as.tibble()

if (ix==1){
df_out <- df
} else{
df_out <- rbind(df_out, df)
}

}

# save df
write.csv(df_out, paste(out_path, out_name, sep='/'), row.names=FALSE)
