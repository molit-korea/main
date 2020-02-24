# RealEstate_BigData_Analysis_Project
국토교통부에서 제공하는 아파트/오피스텔 실거래가 빅데이터를 활용한 분석 프로젝트

## Step

### acquire
	- city,subcity,dong_latlng_acquire.py 를사용하여, 시/도, 군, 동 위경도 좌표 수집
	- crawling/crawling.py 를 사용하여, 아파트/오피스텔 실거래가(2008 ~ 2018), 아파트/오피스텔(2011 ~ 2018) 전/월세 데이터 수집 
	- crawling/crawling.py의 API 호출의 경우, 행정코드를 통해서 요청하는데 행정코드 파일은 KIKmix.20180122.xlsx 입니다.
### process
	- Processing_apartment_rent.ipynb, ... , Processing_office_trade.ipynb 코드에서 전처리 및 Join 연산을 수행하여,
	- final_apartment_rent.csv, final_apartment_trade.csv, final_office_rent.csv, final_office_trade.csv 생성.
	- csv_to_json.py 을 이용하여, ES mapping schema 형식에 맞는 json 파일 생성. 
	
### storage
	- 부동산 데이터 mapping schema 작성 (apart_rents, apart_trades, office_rents, office_trades 4개의 index)
	- 부동산 데이터 json 파일 색인 (Bulk API 이용)
	-  [mapping schema 및 Bulk API 사용법은 storage/README.md파일에  기입하였습니다.]
	- 원격에서 접속할수 있도록, 서버 설정 $sudo sysctl -w vm.max_map_count=262144


### visual
	- Kibana를 이용하여, 부동산 전월세/실거래가 시각화 (163.180.117.252:5601)
	- Node.js 와 Naver Map API v3를 이용한 시각화 (visual/latestproject)
```
node app.js (서버 실행)
```

## Project Structure
![1](https://user-images.githubusercontent.com/25413011/41504455-4915395a-722a-11e8-8277-a77db0900895.jpg)

## Project Result

## STEP : acquire

## contents
1. 부동산 10년치 데이터 수집
- 아파트 실거래가 데이터 (2008 ~ 2018) : 5,967,446 건 (837MB)
- 아파트 전/월세 데이터 (2011 ~ 2018) : 4,631,930 건 (704MB)
- 오피스텔 전/월세 데이터 (2011 ~ 2018) : 390,186 건 (56MB)
- 오피스텔 실거래가 데이터 (2008 ~ 2018) : 351,810 건 (50MB)
- Data Size : 약 1.6GB

2. 시도/군/동 별 위경도 좌표 수집
- 시/도 위경도 좌표 : 16개
- 군/시 위경도 좌표 : 225개
- 아파트 전/월세 데이터 동 별 위경도 좌표 : 3,404 개
- 아파트 실거래가 데이터 동 별 위경도 좌표 : 3,460 개
- 오피스텔 전/월세 데이터 동 별 위경도 좌표 : 1,347 개
- 오피스텔 실거래가 데이터 동 별 위경도 좌표 : 1,298 개

## STEP : storage

## contents
1. 엘라스틱 서치 부동산 데이터 색인
- 데이터별 타입에 맞는 Mapping Schema 작성.
- 위경도 좌표 -> geopoint type
- 날짜 -> date type
- 주소 -> keyword type
- 실거래가/전/월세 가격 -> long
- 총 4개의 Index 사용 (office_rent, office_trade, apart_rent, apart_trade)

## STEP : process

## contents
1. Naver Map API의 Geocode를 통해서, 위경도 좌표가 수집되지 않는 세부 주소 제거
2. 세부주소,위경도 좌표와 아파트 세부주소 좌표 Join 연산
3. 거래 날짜 표준 Json Date Format 으로 변환 (yyyy-mm-ddThh:mm:ss)
4. ElasticSearch 색인을 위해서, Bulk API Format에 맞는 Json 파일로 변환

## STEP : analysis & visual

## contents
1. Naver Map API를  이용해서, 아파트/오피스텔 전/월세 실거래가 데이터 Visualization (Marker 이용)
- 지도 Zoom에 따른 시/동/군 단위의 거래 데이터 시각화
- 시/동/군 단위의 aggreagation으로 거래 데이터 평균가격 시각화 (Custom Marker를 통한 시각화)
![image](https://user-images.githubusercontent.com/25413011/41417195-9a102554-7027-11e8-9b31-543d52c73409.png)

2. Kibana를 통한 다양한 부동산 데이터 시각화
- 워드 클라우드를 통한 시/도별 아파트/오피스텔 평균 실거래가
- 파이차트를 통한 시/도별 거래 수
- 막대 그래프를 통한 아파트 면적별 거래 수
- 히스토그램을 통한 아파트 층수별 거래수 
![image](https://user-images.githubusercontent.com/25413011/41417204-a1547bb2-7027-11e8-9fba-430754c58a63.png)


