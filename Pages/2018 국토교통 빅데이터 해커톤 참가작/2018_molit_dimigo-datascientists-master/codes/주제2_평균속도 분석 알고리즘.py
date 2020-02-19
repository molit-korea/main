i=input("시간 : ")         #i = 시간
k=input("도로 LinkID : ")  #k = 현재 도로 ID
import pandas as pd
def extract_value(value_str):    #null값은 None으로 반환
    if pd.isnull(value_str):
        return None
    return int(value_str)
i=extract_value(i)     #정수형으로 변환
k=extract_value(k)     #정수형으로 변환
speed = pd.read_csv("speed.csv",encoding = "euckr")
speed["전체평균속도"]=speed["전체평균속도"].apply(extract_value)
j=speed[(speed["LinkID"]==k)&(speed["시간"]==i)]["전체평균속도"] #현재 도로와 현재 시간의 조건을 만족하는 speed파일의 전체 평균속도
                                                                #cloumn을 j에 입력
j=j.tolist() #리스트형으로 변환
j=extract_value(j[0]/10) # ??
filename="{}hour {}-{}.csv".format(i,j*10,j*10+10)   #현재 시간에 속도가
a = pd.read_csv(filename)                            # a = filename
b = a[a["LinkID"]==k]                               #a에서 현재 도로의 ID와 동일한 정보만 b에 입력
c = b.index.values.astype(int)[0]                   #b에서 ~~값들의 위치를 정수형으로 c에 반환
print(c)
if c == 0:
    print()
elif c == 1:
    print(a["LinkID"].loc[c-1])

elif c == 2:
    print(a["LinkID"].loc[c-2])
    print(a["LinkID"].loc[c-1])
elif c == 3:
    print(a["LinkID"].loc[c-3])
    print(a["LinkID"].loc[c-2])
    print(a["LinkID"].loc[c-1])
elif c == 4:
    print(a["LinkID"].loc[c-4])
    print(a["LinkID"].loc[c-3])
    print(a["LinkID"].loc[c-2])
    print(a["LinkID"].loc[c-1])
else:
    c-=5
    for z in range(0,4):
        print(a["LinkID"].loc[c+z])
for z in range(1,6):
    print(a["LinkID"].loc[c+z])
