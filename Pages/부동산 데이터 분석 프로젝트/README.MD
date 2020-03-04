# 부동산 데이터 분석 프로젝트
## [RealEstate_BigData_Analysis_Project](https://github.com/fsinc2020/main/tree/master/Pages/%EB%B6%80%EB%8F%99%EC%82%B0%20%EB%8D%B0%EC%9D%B4%ED%84%B0%20%EB%B6%84%EC%84%9D%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/RealEstate_BigData_Analysis_Project-master)
- 국토교통부에서 제공하는 아파트/오피스텔 실거래가 빅데이터를 활용한 분석 프로젝트 (https://github.com/ddolsoon/RealEstate_BigData_Analysis_Project)

### Step

#### acquire
	- city,subcity,dong_latlng_acquire.py 를사용하여, 시/도, 군, 동 위경도 좌표 수집
	- crawling/crawling.py 를 사용하여, 아파트/오피스텔 실거래가(2008 ~ 2018), 아파트/오피스텔(2011 ~ 2018) 전/월세 데이터 수집 
	- crawling/crawling.py의 API 호출의 경우, 행정코드를 통해서 요청하는데 행정코드 파일은 KIKmix.20180122.xlsx 입니다.
#### process
	- Processing_apartment_rent.ipynb, ... , Processing_office_trade.ipynb 코드에서 전처리 및 Join 연산을 수행하여,
	- final_apartment_rent.csv, final_apartment_trade.csv, final_office_rent.csv, final_office_trade.csv 생성.
	- csv_to_json.py 을 이용하여, ES mapping schema 형식에 맞는 json 파일 생성. 
	
#### storage
	- 부동산 데이터 mapping schema 작성 (apart_rents, apart_trades, office_rents, office_trades 4개의 index)
	- 부동산 데이터 json 파일 색인 (Bulk API 이용)
	-  [mapping schema 및 Bulk API 사용법은 storage/README.md파일에  기입하였습니다.]
	- 원격에서 접속할수 있도록, 서버 설정 $sudo sysctl -w vm.max_map_count=262144


#### visual
	- Kibana를 이용하여, 부동산 전월세/실거래가 시각화 (163.180.117.252:5601)
	- Node.js 와 Naver Map API v3를 이용한 시각화 (visual/latestproject)
```
node app.js (서버 실행)
```

### Project Structure
![1](https://user-images.githubusercontent.com/25413011/41504455-4915395a-722a-11e8-8277-a77db0900895.jpg)

### Project Result

### STEP : acquire

### contents
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

### STEP : storage

### contents
1. 엘라스틱 서치 부동산 데이터 색인
- 데이터별 타입에 맞는 Mapping Schema 작성.
- 위경도 좌표 -> geopoint type
- 날짜 -> date type
- 주소 -> keyword type
- 실거래가/전/월세 가격 -> long
- 총 4개의 Index 사용 (office_rent, office_trade, apart_rent, apart_trade)

### STEP : process

### contents
1. Naver Map API의 Geocode를 통해서, 위경도 좌표가 수집되지 않는 세부 주소 제거
2. 세부주소,위경도 좌표와 아파트 세부주소 좌표 Join 연산
3. 거래 날짜 표준 Json Date Format 으로 변환 (yyyy-mm-ddThh:mm:ss)
4. ElasticSearch 색인을 위해서, Bulk API Format에 맞는 Json 파일로 변환

### STEP : analysis & visual

### contents
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

## [Budongsan](https://github.com/fsinc2020/main/tree/master/Pages/%EB%B6%80%EB%8F%99%EC%82%B0%20%EB%8D%B0%EC%9D%B4%ED%84%B0%20%EB%B6%84%EC%84%9D%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/budongsan)

- https://github.com/keepcosmos/budongsan
**현재 데이터는 2016년까지만 제공됩니다. http://rtdown.molit.go.kr/download/downloadMainList.do**

국토교통부(molit.go.kr)와 한국 감정원에서 제공하는 아파트, 단독/다가구, 연립/다세대 주택 실거래 정보 분석을 위한 dataset과 함수를 제공합니다.

현재는, http://rtdown.molit.go.kr 에서 제공되는 2006~2016년까지의 모든 실거래 정보에 대한 R dataset을 제공하고 있습니다.

매매 데이터는 2006년 부터, 전월세 데이터는 2011년부터 존재합니다.

#### 패키지 설치하기
* `budongsan` 패키지를 설치하기 위해선 `devtools` 패키지가 필요합니다.

```{r}
install.packages("devtools")
devtools::install_github("keepcosmos/budongsan")
# 100MB 이상의 데이터로 다소 시간이 소요될 수 있습니다.

library(budongsan)
```

#### Datasets
`molit.rt.{type}.{year}` 형식으로 데이터를 불러옵니다.
* type:
  - `apt`: 아파트
  - `sh`: 단독 / 다가구
  - `rh`: 연립 / 다세대
* year: 2006 ~ 2016

```{r}
# 2016년 아파트 전월세 및 매매 실거래 데이터
molit.rt.apt.2016

# 2016년 단독/다가구 전월세 및 매매 실거래 데이터
molit.rt.sh.2016

# 2015년 연립/다세대 전월세 및 매매 실거래 데이터
molit.rt.rh.2015
```
* `help(molit.rt.apt)` 혹은 `?molit.rt.apt` 명령어를 통해 데이터에 대한 상세 정보를 확인할 수 있습니다.
* 데이터 양이 큽니다. `data.table` 패키지를 먼저 추가해주면 더 빠르게 데이터를 활용할 수 있습니다.
* 면적은 평방미터, 가격은 만원단위로 표시됩니다.

#### 타입별 전체 데이터 불러오기
각 주택 타입별, 지역별 전체 데이터를 불러올 수 있습니다. 해당방법으로 데이터를 불러올 경우 컬럼이름 영어로 변환됩니다.

```{r}
# 단독 주택 전체 불러오기
molit.rt.get("sh")

# 지역별 아파트 불러오기
molit.rt.get("apt", "성남시")
molit.rt.get("apt", "판교")

# 해당 함수로 데이터를 불러올 경우 Default로 컬럼이름은 영어로 변환됩니다. 한국어로 적용된 컬럼이름을 원하실 경우 `colnames.locale="ko"` 파라미터를 추가해주세요.
molit.rt.get("apt", "서울특별시", colnames.locale="ko")

```


### Contribution
* 잘못된 데이터 / 제대로 cleaning된지 않은 데이터를 찾아주시는 것도 큰 도움이 됩니다.
* 해당 데이터를 활용한 어떤 분석이든 공유해주세요. PR뿐 아니라 Issue를 통한 제안이나 Gist를 통해 본인이 분석한 Script를 공유해주셔도 됩니다.
* molit.go.kr에서 다운받은 raw 파일은 package size 문제로 `data-raw` 브랜치에서 관리합니다. 데이터를 정리한 후 rda파일만 master에 머지하고 있으니 참고해주세요.

#### TODO
* 부동산 거래 정보 정보에 필요한 유용한 함수들 추가
* 한국감정원 아파트 실거래가격지수에 대한 Open API 클라이언트 구현
  * 실거래가격지수 통계 조회 서비스
  * 아파트 실거래 가격 지수 조회 서비스

## [《파이썬을 활용한 부동산 데이터 분석》 예제 코드](https://github.com/fsinc2020/main/tree/master/Pages/%EB%B6%80%EB%8F%99%EC%82%B0%20%EB%8D%B0%EC%9D%B4%ED%84%B0%20%EB%B6%84%EC%84%9D%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/python-real-estate-master)
- https://github.com/wikibook/python-real-estate

## [View동산](https://github.com/fsinc2020/main/tree/master/Pages/%EB%B6%80%EB%8F%99%EC%82%B0%20%EB%8D%B0%EC%9D%B4%ED%84%B0%20%EB%B6%84%EC%84%9D%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/realestate-server-master)

### 부동산 시세 변동 확인 & 지역 커뮤니티 서비스
- https://github.com/ParkChunSo/realestate-server

#### 서비스 개요
원하는 지역의 부동산 시세 변동을 확인하고 지역별 커뮤니티를 활용하여 정보를 공유하는 웹 페이지 입니다.

### 시스템 구성도
![screenshot_1](https://github.com/fsinc2020/main/blob/master/Pages/%EB%B6%80%EB%8F%99%EC%82%B0%20%EB%8D%B0%EC%9D%B4%ED%84%B0%20%EB%B6%84%EC%84%9D%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/realestate-server-master/image/system.PNG)

### 실행 화면
![screenshot_2](https://github.com/fsinc2020/main/blob/master/Pages/%EB%B6%80%EB%8F%99%EC%82%B0%20%EB%8D%B0%EC%9D%B4%ED%84%B0%20%EB%B6%84%EC%84%9D%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/realestate-server-master/image/chart_page.PNG)
![screenshot_3](https://github.com/fsinc2020/main/blob/master/Pages/%EB%B6%80%EB%8F%99%EC%82%B0%20%EB%8D%B0%EC%9D%B4%ED%84%B0%20%EB%B6%84%EC%84%9D%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/realestate-server-master/image/search_page.PNG)
![screenshot_4](https://github.com/fsinc2020/main/blob/master/Pages/%EB%B6%80%EB%8F%99%EC%82%B0%20%EB%8D%B0%EC%9D%B4%ED%84%B0%20%EB%B6%84%EC%84%9D%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/realestate-server-master/image/community_page.PNG)

### 구현 사항

#### Back end

##### spring batch
1. 모든 지역의 매매, 전세, 월세 데이터를 가져오기 위해 파티셔닝 기능 구현
2. 비지니스 로직을 통해 데이터 가공
3. JPA를 사용하여 Database에 저장
4. 월별 데이터를 가져오기 위해 스케쥴링 기능 구현
5. github : <https://github.com/KimYunsang-v/realestate_batch>

##### spring boot (REST API)
1. JPA를 사용하여 영속성 관리와 DB 테이블 객체화
2. QueryDSL로 쿼리를 메소드화 하고 런타임에 발생 할 수 있는 에러 컴파일시 처리
3. 주소를 지역코드로 변경하기 위해 In-memory 방식의 Redis를 사용하여 속도 향상
4. AOP 기능을 사용하여 custom exception 구현
5. Spring security + jwt로 로그인시 토큰을 발행하고 리퀘스트 요청 시 토큰 확인하여 사용자 인증 -> 보안 강화
6. Swagger를 사용하여 API 문서 자동화
7. github : <https://github.com/KimYunsang-v/realestate-server>

##### AWS & Docker
1. AWS EC2서버에 Docker를 사용하여 API server, MySQL, redis 컨테이너 운영
2. API Server github와 Dockerhub를 연동하여 github 트리거 발생 시 docker image 빌드 자동화 
3. docker repositoy : <https://hub.docker.com/repository/docker/qwdbstkd123/realestate>


#### Front end

##### React.js
1. 컴포넌트 단위 화면 구성
2. Semantic-ui를 사용하여 엘리먼트 구성
3. github : <https://github.com/KimYunsang-v/realestate_front>
