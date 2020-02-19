import pandas as pd            #파일 생성
def extract_value(value_str):
    if pd.isnull(value_str):
        return None
    return int(value_str)
car = pd.read_csv("car.csv",encoding="euckr")
speed = pd.read_csv("speed.csv",encoding = "euckr")
speed["전체평균속도"]=speed["전체평균속도"].apply(extract_value)
speed.dropna()
for i in range(1, 24):
    for j in range(1, 14):
        a=speed[(speed["전체평균속도"]>=j*10-10)&(speed["전체평균속도"]<=j*10)&(speed["시간"]==i-1)]
        filename="{}hour {}-{}.csv".format(i-1,j*10-10,j*10)
        a.to_csv(filename)
