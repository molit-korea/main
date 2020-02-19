import pandas
from pandas import read_csv, DataFrame, Series
from pandas.io import gbq
import time
from datetime import datetime
import json
import operator


""" BIG QUERY SAVE (to test1 or test2 or test3 table) """
def save_bq(dataset, table_name):
    table_name = 'hackerton.' + table_name
    pandas.DataFrame.to_gbq(dataset, table_name, 'hackerton-206409', if_exists = 'replace', chunksize = 1000, verbose = True)


""" DATA LOAD : raw_crime 데이터 불러줘! """
def data_load(table_name): # table_name : bigquery table name (raw_crime, raw_price, test1, test2, test3)
    q = "select * " + "from [hackerton-206409:hackerton." + table_name + "]"
    data = pandas.read_gbq(query = q, project_id = 'hackerton-206409')
    return(data)
    

""" FILTERING : ~~ 열들만 보여줘! / ~~ 열들은 빼줘! """
def col_filtering(table_name, ex_or_include, col_name_list): # table_name : test1 or test2 or test3
    dataset = data_load(table_name)
    col_name_list = col_name_list.split(',')

    if ex_or_include == 'exclude':
        for i in col_name_list:
            try:
                del dataset[i]
            except:
                continue
        return(dataset)
    
    elif ex_or_include == 'include':
        dataset = dataset[col_name_list]
        return(dataset)

def row_filtering(table_name, what_value, which_col = 'all'):
    dataset = data_load(table_name)

    if what_value == 'null' or what_value == 'na':
        dataset = dataset.dropna()
        return(dataset)
    else:
        dataset = dataset[dataset[which_col] == what_value]
        return(dataset)


""" GROUP_BY """
def group_by(table_name, col_name, sum_or_mean):
    dataset = data_load(table_name)

    if sum_or_mean == 'sum':
        out = dataset.groupby([col_name], as_index = False).sum()
        return(out)

    elif sum_or_mean == 'mean':
        out = dataset.groupby([col_name], as_index = False).mean()
        return(out)


""" UNIFICATION ADDRESS """
def unification_address(table_name, col_name, unit):
    dataset = table_name
    #dataset = data_load(table_name)

    if unit == '시':
        pass
    elif unit == '동':
        pass
    elif unit == '구':
        for i in range(len(dataset)):
            if dataset[col_name][i].split(' ')[1] == '구로구':
                dataset[col_name][i] = '구로'
            else:
                dataset[col_name][i] = dataset[col_name][i].split(' ')[1].replace('구','')
        return(dataset)


""" JOIN """
def join(table_name1, col_name1, table_name2, col_name2, how): #how :inner, outer
    dataset1 = data_load(table_name1)
    dataset2 = data_load(table_name2)
    joined_dataset = pandas.merge(dataset1, dataset2, how = how, left_on = [col_name1], right_on = [col_name2])
    del joined_dataset[col_name2]
    return(joined_dataset)


""" TEST """
#save_bq(data_load('raw_crime'), 'test1')
#save_bq(row_filtering('test1', '검거', 'c'), 'test1')
#save_bq(col_filtering('test1','include','a,d'),'test1')
#save_bq(group_by('test1','a','sum'), 'test3')