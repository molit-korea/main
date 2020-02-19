import pandas as pd
car = pd.read_csv("car.csv", encoding ='euckr')
import pandas as pd
speed=pd.read_csv("speed.csv", encoding = 'euckr')

import matplotlib.pyplot as plt
plt.plot(speed["전체평균속도"], car["버스"])
plt.xlabel("Overall average speed")
plt.ylabel("Bus")
plt.title("average speed and bus")
def extract_value(value_str):
    if pd.isnull(valiue_str):
        return None
    return int(value_str)
speed["전체평균속도"]=speed["전체평균속도"].dropna()
car["버스"]=car["버스"].dropna()
from scipy.stats import linregress
import numpy as np
slope,intercept,r_value,p_value,stderr_slope=linregress(speed["전체평균속도"],car["버스"])
plt.show()
