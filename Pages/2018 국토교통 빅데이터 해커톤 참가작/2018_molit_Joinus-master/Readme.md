# Joinus: Preprocessing Bot
---
> 2018 국토교통 빅데이터 해커톤 참가작입니다.

***Joinus*** 는 국가 데이터, 개인 데이터, 기업소유 오픈 데이터 등등을 활용하여 자신만의 데이터셋을 만드는 것을 목표로 합니다.
챗봇이라는 손쉽고 접근성 높은 인터페이스(Interface)를 통해 누구나 어려운 쿼리(Query) 없이 데이터를 불러오고 원하는 방향으로 수정하며 다양한 데이터를 조합할 수 있게 합니다.
과정마다 만들어지는 데이터셋은 자신만의 저장소에 그대로 생성이 되며, 나아가 데이터 적제 인프라를 쉽게 얻는 것을 목표로 합니다.


# QuickStart
-----
> 설치 방법은 다음과 같습니다.

1. 소스코드 다운

```bash
git clone https://github.com/beyondat/2018_molit_Joinus.git
```
적당한 자신의 로컬 위치에 소스를 받는다.

2. Front-end 빌드
```bash
cd chat-bot-ui
npm install
npm run build
```
완료 후에 be폴더의 public폴더를 확인한다.

3. 서버 실행
```bash
cd ../be
npm install
npm start
```
localhost:3000으로 서버가 생성이 된다.



4. Application 실행
브라우저에 localhost:3000을 적고 접속을 한다.

[이것](https://storage.googleapis.com/beyondat_posting/2018_Hackathon/Joinus_Demo_Quick.mp4)과 같은 동작을 기대한다.


5. django server
> django api(preprocessing api) server run

```bash
pip freeze > requirements.txt
pip install -r requirements.txt
```

- 외붜서버에 django project 업로드
- cd django/backend_api
- python3 manage.py runserver 0.0.0.0:8081


 # 챗봇 사용가이드
---

![](https://storage.googleapis.com/beyondat_posting/2018_Hackathon/chatbot_output.png)


 ## [Data Load 기능 사용시 입력 예시]
 "crime 데이터셋 불러와줘"
 "crime 데이터셋 가지고 와줘"
 "crime 테이블 로드해줘"
 "price 테이블 가져와줘"

 ## [Row Filtering 기능 사용시 입력 예시]
 "crime 데이터셋에서 occurorarrest 열이 검거 행 빼줘"
 "price 데이터셋의 모든 열에서 Null 행 제거해줘"


 ## [Column Filtering 기능 사용시 입력 예시]
 "crime 데이터셋에서 crime, occurorarrest 열 빼줘"
 "price 데이터셋의 area, count 열만 보여줘"


 ## [Group By 기능 사용시 입력 예시]
 "crime 데이터의 area열을 기준으로 count 열의 그룹합 구해줘"
 "price 데이터의 address 열 별로 price열의 그룹평균 계산해줘"


 ## [유형변경_주소체계통일 기능시 입력 예시]
 price 데이터셋에서 address 열을 '구'단위로 바꿔줘
 crime 데이터셋의 area 열을 '시'단위로 변경해줘


 ## [Join 기능 사용시 입력 예시]
 "crime 데이터셋의 area열과 price 데이터셋의 address열을 기준으로 조인시켜줘"




 # API 사용 가이드
 ---

 -API 명세 [INPUT]

 [Data Load]
  http://localhost/api/?function=data_load&table_name=raw_crime
  (table_name : bigquery table name)

 [Row Filtering]
 http://localhost/api/?function=row_filtering&table_name=raw_crime&what_value=발생&which_col=occur_or_arrest
          (which_col(어떠한 열)이
           what_value (어떠한 값)무슨 값을 필터링 할 것인지

 [Column Filtering]
 http://localhost/api/?function=col_filtering&table_name=&ex_or_include=exclude&col_name_list=crime,occur_or_arrest
   (ex_or_include : 입력할 열을 포함할 것인지, 제거할 것인지 /
    col_name_list : 열 이름 리스트 -> ,로 구분)

 [Group By]
 http://localhost/api/?function=group_by&table_name=test1&col_name=area&sum_or_mean=sum
  (col_name = 그룹화시킬 기준 열 이름 / sum_or_mean = 그룹합 또는 그룹평균)

 [유형 변경 - 주소체계 통일]
 http://localhost/api/?function=unification_address&table_name=test2&col_name=address&unit=구단위
 (unit : 구단위/ 시단위/ 동단위)

 [Join]
 http://localhost/api/?function=join&table_name1=test1&col_name1=area&table_name2=test2&col_name2=address
 (col_name1, col_name2 : dataset1,2의 조인 기준이 되는 열의 이름)



 -API 명세 [OUTPUT]]
  각 전처리 함수가 완료된 dataset이 bigquery에 2차원 테이블 형태로 저장된다.
 ex. join api의 output : django_output1.png
       group by api (mean)의 output : django_output2.png


 ---------------------------------------------------------------------
 현재 0.3 version : sample database에 대해서만 구조화 되어 있음
 예정 0.4 version : 국토교통부에서 제공하는 모든 데이터를 대상으로 구조화할 예정


# License
---
MIT
