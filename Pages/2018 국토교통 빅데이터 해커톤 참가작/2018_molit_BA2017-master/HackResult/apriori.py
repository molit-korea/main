import pandas as pd
from mlxtend.frequent_patterns import apriori
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import association_rules
import numpy as np

# list를 string 으로 읽는 문제 해결
def string_to_list(x):
    return x[2:-2].split("', '")

# list를 string 으로 읽는 문제 해결
def fix_string_to_list(df):
    df.explain=df.explain.apply(string_to_list)
    df.org=df.org.apply(string_to_list)
    df.service=df.service.apply(string_to_list)
    df['service_used']=df.service.apply(lambda x: len(x))
    return df

def service_preprocessing(ref,your_input):
    # service used preprocessing
    ref=ref.query('service_used>1').reset_index(drop=True)

    # servie category list 
    service_category_list=ref.service_category.unique()

    if your_input in service_category_list:
        ref=ref[ref.service_category==your_input]
        print(your_input,'영역에만 한정된 추천 데이터를 보고 싶으신 거군요! 알겠어용')
        print(your_input,'영역에서는 이렇게 함께 자주 쓰인답니당')
    else:
        print('전체 서비스에서 추천 데이터를 보고 싶으신 거군요! 알겠어용')
        print('전체 영역에서는 이렇게 함께 자주 쓰인답니당')
        
    dataset=list(ref.service)
    return dataset


def transaction_encoding(dataset):
    oht = TransactionEncoder()
    oht_ary = oht.fit(dataset).transform(dataset)
    new_df = pd.DataFrame(oht_ary, columns=oht.columns_)
    return new_df

def apriori_modeling(new_df):
    # frequent itemset
    frequent_itemsets = apriori(new_df, min_support=0.05, use_colnames=True)
    
    # a-rules
    rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1.2)
    
    return frequent_itemsets,rules

def apriori_results(your_input):
    # read data 
    ref=pd.read_csv('C:/Users/JunmoNam/Desktop/HK/sna_project.csv',index_col=0)
    ref.service_category=ref.service_category.apply(lambda x: x[5:])
    ref=fix_string_to_list(ref)

    dataset=service_preprocessing(ref,your_input)
    new_df=transaction_encoding(dataset)

    fi,r=apriori_modeling(new_df)
    r.antecedants=r.antecedants.apply(lambda x: str(x)[12:-3])
    r.consequents=r.consequents.apply(lambda x: str(x)[12:-3])
    results=r.sort_values(by=['confidence','lift'],ascending=False).iloc[:,[0,1,5]]
    results.columns=['이 데이터 조합은','이 데이터들과 자주 쓰여요!','우린 잘 어울려요!']
    results.iloc[:,-1]=np.round(results.iloc[:,-1],4)
    return results