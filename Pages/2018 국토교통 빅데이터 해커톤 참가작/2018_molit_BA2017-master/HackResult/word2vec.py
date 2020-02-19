import pandas as pd
import os,re,pickle
import numpy as np
import warnings
warnings.filterwarnings(action='ignore', category=UserWarning, module='gensim')

import gensim
from gensim.models.doc2vec import LabeledSentence, Doc2Vec, TaggedDocument
from konlpy.tag import Twitter



def get_nouns(doc):
    mc=Twitter()
    noun_list=mc.nouns(doc)
    noun_list=[noun for noun in noun_list if len(noun)>1]
    return noun_list

# 정규표현식을 사용한 노이즈 제거
def delete_noise(text):
    noise = re.compile('[\t\n\r\xa0]')                
    result=noise.sub(' ',str(text))                   #  \t, \n, \r, \xa0 제거 
    result=re.sub('[^ ㄱ-ㅣ가-힣]+',' ',result)
    result=re.sub(' +<.*?>',' ',result)               # 특수문자 제거
    result=re.sub(r'[^\w]',' ',result)                # 특수문자 제거
    result=re.sub(' +',' ',result).strip()            # 여러 공백(multi space)을 하나의 공백으로 줄이기
    return result

def preprocessing_all(doc):
    result=delete_noise(doc)
    result=get_nouns(result)
    return result


# get similar movie code (x)
def get_similar_code(model,query):
    model.random.seed(23)
    new_vector = model.infer_vector(query,alpha=0.001)
    sims = model.docvecs.most_similar([new_vector],topn=30)
    sim_code = [code for code, sim in sims]
    sim=[sim for code, sim in sims]

    results=pd.DataFrame({'이 데이터를 추천해 드려요! ':sim_code,'이 데이터는 요정도 추천해 드려요! ':np.round(sim,3)})
    results=results.loc[:,[results.columns[1],results.columns[0]]]
    return results


def w2v(your_input):
	model=pd.read_pickle('C:/Users/JunmoNam/Desktop/HK/model.pickle')
	query=preprocessing_all(your_input)
	results = get_similar_code(model,query)
	return results
