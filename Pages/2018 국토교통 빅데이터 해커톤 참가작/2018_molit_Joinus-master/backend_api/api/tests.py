# -*- coding: utf-8 -*-

from django.test import TestCase
import pandas
from pandas import read_csv, DataFrame, Series
import time
from datetime import datetime
import shapefile
import json
from matplotlib import pyplot as plt
import seaborn as sns


""" Dataset 1 """
# Data load
dataset1 = read_csv('/home/kyubum/workspace/Hackerton/backend_api/api/dataset/crime/crime.csv', encoding='EUC-KR')

# 특정 행 삭제 (발생/검거 가 검거인 행 삭제) & Column Filtering
dataset1 = dataset1.dropna() 
dataset1 = dataset1[dataset1['발생검거'] != '검거'] 
dataset1 = dataset1[['구분','건수']] 

# Group by sum
f_dataset1 = dataset1.groupby(['구분'], as_index = False).sum()

# Column name setting
f_dataset1.columns = ['area1', 'crime_count_2016y']


""" Dataset 2 """
# Raw data load & Change 'shp' to list
shp_data = shapefile.Reader('/home/kyubum/workspace/Hackerton/backend_api/api/dataset/price/seoul/seoul.shp', encording = 'EUC-KR')
geomet = shp_data.shapeRecords()
datalist = []
for i in geomet:
    datalist.append(i.record)

# Bytes in list to string
for i in range(len(datalist)):
    for j in range(len(datalist[i])):
        try:
            datalist[i][j] = datalist[i][j].decode("EUC-KR")
        except:
            continue

# List to dataframe
col_name_list = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17']
dataset2 = pandas.DataFrame(datalist, columns = col_name_list)


# Add join column
join_col_list = []
for i in range(len(datalist)):
    if dataset2['3'][i].split(' ')[1] == '중구':
        join_col_list.append('중부')
    elif dataset2['3'][i].split(' ')[1] == '구로구':
        join_col_list.append('구로')
    else:
        join_col_list.append(dataset2['3'][i].split(' ')[1].replace('구',''))

dataset2['join_col'] = join_col_list

# Group by avg (avg price for each area) -> Create final df for join (output : f_dataset2)
f_dataset2 = dataset2[['16','join_col']]
f_dataset2 = f_dataset2.groupby(['join_col'], as_index = False).mean()

# Column name setting
f_dataset2.columns = ['area2', 'price']
#print(f_dataset2)


""" Join """
join_df = pandas.merge(f_dataset1, f_dataset2, left_on = ['area1'], right_on = ['area2'], how = 'inner')
del join_df['area2']
print(join_df)
#jsontest = join_df.to_json(orient = 'table')



""" Ex Input """
# http://localhost/api/?function=data_load&table_name=raw_crime
# http://localhost/api/?function=row_filtering&table_name=test1&what_value=%EB%B0%9C%EC%83%9D&which_col=c
# http://localhost/api/?function=col_filtering&table_name=test1&ex_or_include=exclude&col_name_list=b,c
# http://localhost/api/?function=group_by&table_name=test1&col_name=a&sum_or_mean=sum

# http://localhost/api/?function=data_load&table_name=raw_price
# http://localhost/api/?function=col_filtering&table_name=test2&ex_or_include=include&col_name_list=c,p
# http://localhost/api/?function=unification_address&table_name=test2&col_name=c&unit=구
# http://localhost/api/?function=group_by&table_name=test2&col_name=c&sum_or_mean=mean

# http://localhost/api/?function=join&table_name1=test1&col_name1=a&table_name2=test2&col_name2=c