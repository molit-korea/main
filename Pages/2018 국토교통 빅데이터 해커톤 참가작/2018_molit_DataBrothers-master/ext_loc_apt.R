# inital setting
rm(list = ls())
dir <- 'C:/Users/Taewoong/Projects/Hackerthon/01_Code'
setwd(dir)

source("functions/import_packages.r")

# file path
filepath <- "../00_Data/실거래가_OUT"
filename <- 'TBL_서울시_아파트_매매.csv'
out_name_gu <- 'LOC_GU_아파트.csv'
out_name_dong <- 'LOC_DONG_아파트.csv'

# read data
file_path_name <- paste(filepath, filename, sep = '/')
rest_price <- as.tibble(fread(file_path_name))
rest_price

# extract name of gu and dong 
str_loc_gu <- as.tibble(unique(rest_price$c_gu)) %>%
	select(c_gu = value)

str_loc_dong <- rest_price %>%
	group_by(c_gu, c_dong)%>%
	summarize(c_mean = mean(c_value)) %>%
	select(c_gu, c_dong)

write.csv(str_loc_gu, paste(filepath, out_name_gu, sep='/'), row.names=FALSE)
write.csv(str_loc_dong, paste(filepath, out_name_dong, sep='/'), row.names=FALSE)

