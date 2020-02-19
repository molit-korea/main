import pandas as pd
speed = pd.read_csv("speed.csv", encoding = 'euckr')
speed_time = []
for a in range(0,101378):
    for i in range(0, 24):
        speed_time.append(i)

sum = 0
p=int(input("도로 ID를 입력하세요 : "))
u = p
p-=1000000
import pandas as pd
yearvader = pd.read_csv("yearVader.csv", encoding = 'euckr')
print("yearVader 읽기 완료")
yearvader_tpath = yearvader["TPath"]
yearvader_tpcnt = yearvader["TPCnt"]
linkid = [] #linkid 리스트형으로 변수 생성
for i in range(0, 101378):
    linkid.append(i)
for k in range(1, 101378):
    linkid[k] = 1000000 + k
for q in range(0, 7204061):

    if yearvader_tpath.loc[q].find("{}".format(linkid[p-1])) != -1 :
            sum+=yearvader_tpcnt.loc[q].astype(int)
if sum >= 1000:
    z=0.1
else:
    z=0



j=0
a=2433048
s = speed[speed["시간"] == 0]["전체평균속도"].mean()
while(j<=2433048):


    speed_time[j]=s
    j=j+24

j=1
s = speed[speed["시간"] == 1]["전체평균속도"].mean()
while(j<=2433049):


    speed_time[j]=s
    j=j+24
j=2
s = speed[speed["시간"] == 2]["전체평균속도"].mean()
while(j<=2433050):


    speed_time[j]=s
    j=j+24
j=3
s = speed[speed["시간"] == 3]["전체평균속도"].mean()
while(j<=2433051):


    speed_time[j]=s
    j=j+24
j=4
s = speed[speed["시간"] == 4]["전체평균속도"].mean()
while(j<=2433052):


    speed_time[j]=s
    j=j+24
j=5
s = speed[speed["시간"] == 5]["전체평균속도"].mean()
while(j<=2433053):


    speed_time[j]=s
    j=j+24
j=6
s = speed[speed["시간"] == 6]["전체평균속도"].mean()
while(j<=2433054):


    speed_time[j]=s
    j=j+24
j=7
s = speed[speed["시간"] == 7]["전체평균속도"].mean()
while(j<=2433055):


    speed_time[j]=s
    j=j+24

j=8
s = speed[speed["시간"] == 8]["전체평균속도"].mean()
while(j<=2433056):


    speed_time[j]=s
    j=j+24
j=9
s = speed[speed["시간"] == 9]["전체평균속도"].mean()
while(j<=2433057):


    speed_time[j]=s
    j=j+24
j=10
s = speed[speed["시간"] == 10]["전체평균속도"].mean()
while(j<=2433058):


    speed_time[j]=s
    j=j+24
j=11
s = speed[speed["시간"] == 11]["전체평균속도"].mean()
while(j<=2433059):


    speed_time[j]=s
    j=j+24
j=12
s = speed[speed["시간"] == 12]["전체평균속도"].mean()
while(j<=2433060):


    speed_time[j]=s
    j=j+24
j=13
s = speed[speed["시간"] == 13]["전체평균속도"].mean()
while(j<=2433061):


    speed_time[j]=s
    j=j+24
j=14
s = speed[speed["시간"] == 14]["전체평균속도"].mean()
while(j<=2433062):


    speed_time[j]=s
    j=j+24
j=15
s = speed[speed["시간"] == 15]["전체평균속도"].mean()
while(j<=2433063):


    speed_time[j]=s
    j=j+24
j=16
s = speed[speed["시간"] == 16]["전체평균속도"].mean()
while(j<=2433064):


    speed_time[j]=s
    j=j+24
j=17
s = speed[speed["시간"] == 17]["전체평균속도"].mean()
while(j<=2433065):


    speed_time[j]=s
    j=j+24

j=18
s = speed[speed["시간"] == 18]["전체평균속도"].mean()
while(j<=2433066):


    speed_time[j]=s
    j=j+24
j=19
s = speed[speed["시간"] == 19]["전체평균속도"].mean()
while(j<=2433067):


    speed_time[j]=s
    j=j+24
j=20
s = speed[speed["시간"] == 20]["전체평균속도"].mean()
while(j<=2433068):


    speed_time[j]=s
    j=j+24
j=21
s = speed[speed["시간"] == 21]["전체평균속도"].mean()
while(j<=2433069):


    speed_time[j]=s
    j=j+24
j=22
s = speed[speed["시간"] == 22]["전체평균속도"].mean()
while(j<=2433070):


    speed_time[j]=s
    j=j+24
j=23
s = speed[speed["시간"] == 23]["전체평균속도"].mean()
while(j<=2433071):


    speed_time[j]=s
    j=j+24
speed_time = pd.Series(speed_time)
normalized_speed_time = (speed_time - speed_time.min())/(speed_time.max()-speed_time.min())
speed["정규화된 시간"] = 1-normalized_speed_time
speed["정규화된 전체평균속도"] = 1-(speed["전체평균속도"] - speed["전체평균속도"].min())/(speed["전체평균속도"].max()-speed["전체평균속도"].min())
speed["정규화값"]=speed["정규화된 시간"]+speed["정규화된 전체평균속도"]
speed["정규화값"]=(speed["정규화값"] - speed["정규화값"].min())/(speed["정규화값"].max()-speed["정규화값"].min())

speedh = []
summ=0
for a in range(0,101378):
    for i in range(0, 24):
        speedh.append(i)

for l in range(0, 24):
    m=(u-1000001)*24+l

    summ = summ+speed["정규화값"][m]

    summ = summ/24
    speedh[u]=summ+z
if speedh[u] >=0 and speedh[u]<0.2:
    print("아주 좋음")
if speedh[u] >=0.2 and speedh[u]<0.4:
    print("좋음")
if speedh[u] >=0.4and speedh[u]<0.6:
    print("보통")
if speedh[u] >=0.6 and speedh[u]<0.8:
    print("나쁨")
if speedh[u] >=0.8 and speedh[u]<1:
    print("아주 나쁨")
