
from django.shortcuts import render
from django.http import HttpResponse

import pandas
from pandas import read_csv, DataFrame, Series
from pandas.io import gbq

import json
from operator import itemgetter
import datetime
import sys
sys.stdout.flush()


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
    dataset = dataset[dataset[which_col] != what_value]
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
    dataset = data_load(table_name)

    if unit == '시단위' or unit == '시 단위':
        pass
    elif unit == '동단위' or unit == '동 단위':
        pass
    elif unit == '구단위' or unit == '구 단위':
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

""" Save_bq 분기 """
def save_bq2(dataset, in_table_name):
    if in_table_name == 'raw_crime' or in_table_name == 'test1':
        save_bq(dataset, 'test1')
    elif in_table_name == 'raw_price' or in_table_name == 'test2':
        save_bq(dataset, 'test2')

#################################################################
# Get & Response
#################################################################
result = "{}"

def index(request):
    if request.GET["function"] == "data_load" :
        dataset = data_load(request.GET["table_name"])
        save_bq2(dataset, request.GET["table_name"])
        result = "..Done.."

    elif request.GET['function'] == 'col_filtering':
        col_name_list = request.GET["col_name_list"]
        col_name_list = col_name_list.split(',')

        for i in range(len(col_name_list)):
            if col_name_list[i] == 'occurorarrest':
                col_name_list[i] = 'occur_or_arrest'
            elif col_name_list[i] == 'houseprice':
                col_name_list[i] = 'house_price'
            else:
                continue

        dataset = col_filtering(request.GET["table_name"], request.GET["ex_or_include"], col_name_list = col_name_list)
        save_bq2(dataset, request.GET["table_name"])
        result = "..Done.."

    elif request.GET['function'] == 'row_filtering':
        which_col = request.GET["which_col"]
        if which_col == 'occurorarrest':
            which_col = 'occur_or_arrest'
        else:
            which_col = request.GET["which_col"]

        dataset = row_filtering(request.GET["table_name"], request.GET["what_value"], which_col=which_col)
        save_bq2(dataset, request.GET['table_name'])
        result = "..Done.."

    elif request.GET['function'] == 'group_by':
        dataset = group_by(request.GET["table_name"], request.GET["col_name"], request.GET["sum_or_mean"])
        save_bq2(dataset, request.GET["table_name"])
        result = "..Done.."

    elif request.GET['function'] == 'unification_address':
        dataset = unification_address(request.GET["table_name"], request.GET["col_name"], request.GET["unit"])
        save_bq2(dataset, request.GET["table_name"])
        result = "..Done.."

    elif request.GET['function'] == 'join':
        dataset = join(request.GET["table_name1"], request.GET['col_name1'], request.GET["table_name2"], request.GET["col_name2"], request.GET["how"])
        save_bq(dataset,'test3')
        result = "..Done.."
    
    return HttpResponse(result)


