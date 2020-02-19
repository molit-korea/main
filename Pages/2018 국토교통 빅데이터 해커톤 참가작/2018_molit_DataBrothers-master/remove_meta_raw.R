# unit_area <- 3.305785 # 1평=3.305785m^2

# inital setting
rm(list = ls())
dir <- 'C:/Users/Taewoong/Projects/Hackerthon/01_Code'
setwd(dir)

source("functions/import_packages.r")
library(readxl)
library(xlsx)

# input
rest_type <- '아파트' # '다세대', '아파트', '오피스텔'
price_type <- '매매' # '전세', '월세'
out_name <- paste('TBL_서울시_', rest_type, '_', price_type, '.csv', sep='')

# file path
filepath <- '../00_Data/실거래가_RAW'
out_path = "../00_Data/실거래가_OUT"
#dir.create(out_path)

# set time sequence
time_seq <- tibble(c_date = seq(as.Date('2015-01-01'), as.Date('2015-12-01'), by = 'month'))
yr_mon <- format(time_seq$c_date, "%Y%m")

filename <- paste(rest_type, '(', price_type,')_실거래가_', yr_mon, '.xlsx', sep='')
file_path_name <- paste(filepath, filename, sep = '/')

# collect all data to one df
for (ix in 1:length(file_path_name)){
ix <- 1
rest_price <- as.tibble(read_excel(file_path_name[ix], skip = 15))
rest_price
write.xlsx(rest_price, filename[ix], sheetName = "sheet1", append = FALSE, row.names=FALSE)
}
