# 교통데이터 분석 프로젝트

## seoulsubway
Interactive Isochrone Map of Seoul Subway 
대한민국 수도권 지하철 반응형 시간거리지도

다음의 주소에서 반응형 웹페이지를 볼 수 있습니다.
https://vuski.github.io/seoulsubway/

다음의 주소에 관련 내용이 설명되어 있습니다.
https://www.vw-lab.com/68 

## VW LAB 
### 공주시와 충청남도의 인구이동 https://www.vw-lab.com/44

04778 서울특별시 성동구 왕십리로4길 3, 2층

브이더블유랩(VW LAB)은 물리적 건조환경과 그 바탕을 이루는 물질과 사회 현상에 관심을 가지고 있습니다.


브이더블유랩(VW LAB)은 다음의 분야에 강점을 지니고 있습니다.

건축 및 도시 전반의 물리적 현상에 대한 데이터 분석

그와 관련된 대용량 공간 정보의 시각화

VW LAB (VW LAB) is  interested in physical built environment and its fundamentals such as social phenomena and material kinds.

VW LAB has strengths in the following areas:

Data Analysis and Visualization on physical phenomena throughout architecture and urban environment


VW LAB is led by Kim, Seung Bum


출처: https://vw-lab.tistory.com/1 [VW LAB]




## 행정구역 경계 공간정보 파일

### 필요성 

- 공간 분석은 주로 공간 상에서 어떤 값의 분포, 또는 공간에서 값의 비교를 중심으로 이루어집니다.   
	*예1)  강남구와 강북구의 연간 예산 비교*  
    *예2) 서울시의 공공자전거 대여소 분포 현황*

- 이러한 공간 분석을 하려면 의미있는 공간 영역 단위가 필요합니다.  
    *예2) 대한민국의 기초자치단체 행정구역*
    *예1) 서울전역을 100미터 단위로 구분한 셀*  


- 이 Repo에서는 공간분석에서 활용할 수 있도록, 대한민국과 서울시를 행정구역 단위로 나눈 파일을 공유합니다.

### 행정구역의 단위

- #### 광역자치단체
	 1개의 특별시, 6개의 광역시, 8개의 도, 1개의 특별자치시, 1개의 특별자치도로 구성됩니다.

- #### 기초자치단체
	기초자치단체의 종류로는, 자치구(특별시, 광역시 산하), 자치시(도 산하), 자치군(광역시, 도 산하)이 있습니다.

	특별시와 6개 광역시에는 총 69개의 자치구가 설치되어 있으며, 또한 6개 광역시와 8개 도에는 총 75개의 자치시와 82개의 군이 설치되어 있습니다 (2018.1.1 기준)

	서울시에는 25개의 자치구가 있습니다(2017년 기준).

- #### 읍면동 
	시(자치시, 행정시)와 구(자치구, 일반구), 군의 하위 행정구역입니다.
전국에 3,502개 서울시에는 424개의 행정동이 있습니다(2018.1.1 기준).

- #### 집계구
	인구규모(최적 500명), 사회경제적 동질성(주택유형, 지가), 집계구 형상을 고려하여 구축한 최소 통계 집계구역입니다.

	서울시에는 19,445개의 집계구가 있습니다(2017년 기준).

### 활용에 따른 분류

- #### 행정구역 경계
	각 행정구역을 폴리곤(다각형) 형태로 나타냅니다.  geojson과 topojson 포맷을 사용합니다.
- #### 행정구역 중심점
	각 행정구역의 중심을 포인트(위/경도 좌표) 형태로 나타냅니다.  csv 포맷을 사용합니다.

###  파일의 특징
- 인코딩 형식은 EUC-KR입니다.
- 좌표계는 WGS84 (EPSG:4326) 입니다.
- 행정구역 경계 파일 중 geojson 포맷은 QGIS를 이용하여  shp 포맷을 변환하였습니다.
  - *SHP 포맷은 ESRI ArcView의 Native Format으로서, 최근에 2차원 벡터 데이터의 교환을 위한 사실상의 표준으로 되고 있는 GIS 포맷*
- 행정구역 경계 파일 중 topojson 포맷은 http://mapshaper.org 를 이용하여 geojson 포맷을 변환하였습니다.
- 행정구역 중심점은 QGIS를 이용하여 각 행정구역 경계 파일에서 추출하였습니다.

###  행정구역코드
- 행정안전부와 통계청의 행정구역 코드가 일치하지 않습니다.
- 집계구는 통계청 코드를, 나머지는 행정안전부 코드를 사용합니다.

| 구    분    | 코     드| 예   시                                              |
|-------------|----------|------------------------------------------------------|
| 광역자치단체|행정안전부|11 : 서울특별시                                       |
| 기초자치단체|행정안전부|11110 : 서울특별시 종로구                             |
| 읍면동      |행정안전부|11110515 : 서울특별시 종로구 청운효자동               |
| 집계구      | 통계청   |1105053010001:서울특별시 종로구 사직동의 첫번째 집계구|




###  참고 소스
- [공간정보시스템 기반 기술 연구소]( http://www.gisdeveloper.co.kr/?p=2332)
- [대한민국행정동경계](https://github.com/vuski/admdongkor)
- [통계지리정보서비스](https://sgis.kostat.go.kr/view/index)
- [통계분류포털](https://kssc.kostat.go.kr:8443/ksscNew_web/index.jsp)



## ITS 표준노드링크
-지능형 교통체계 관리시스템 http://nodelink.its.go.kr/



## AVS 
- Autonomous Visualization System (AVS) is a fast, powerful, web-based 3D visualization toolkit for building applications from your autonomous and robotics data. https://avs.auto/
