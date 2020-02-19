# -*- coding: utf-8 -*-

"""
추출된 csv파일로부터 shp파일 생성(projection: WGS84)
ArcGIS 설치 않아도 실행 가능.
시간이 오래 걸리는 단점
"""

import pandas as pd
import os.path
import shapefile as shp
import time



pth = './extract/'
shppath = './shp/'

if not os.path.exists(shppath):
    os.mkdir(shppath)

for csv in os.listdir(pth):
    start_time = time.time()
    if csv.endswith('.csv'):
        # csv파일에서 파일명만 추출
        savefile = os.path.splitext(csv)[0]

        w = shp.Writer(shp.POINT)

        # 필드 속성 설정
        w.field('CarType', 'C', 3)
        w.field('Speed', 'C', 4)
        w.field('PosX', 'F', 10, 6)
        w.field('PosY', 'F', 10, 6)
        w.field('Loc_CD', 'C', 2)
        w.field('DateTime', 'C', 14)

        top = -999999999
        bottom = 999999999
        left = 999999999
        right = -999999999

        df = pd.read_csv(pth + csv, delimiter='\t', encoding='utf-8', skipinitialspace=True)

        for i in range(0, len(df)):
            # 앞 작업에서 csv를 merge하는 과정에서 헤더까지 합쳐진 것을 확인
            # 헤더인 부분을 만나면 통과
            if df.iloc[i]['CarType']=='CarType':
                continue
            # 속성값 생성
            speed =  df.iloc[i]['Speed']
            cartype = df.iloc[i]['CarType']
            lon = float(df.iloc[i]['PosX'])
            lat = float(df.iloc[i]['PosY'])
            loc = df.iloc[i]['Loc_CD']
            datetime = df.iloc[i]['DateTime']

            # Boundary Box(Extent) 설정
            if top < lat:
                top = lat
            if bottom > lat:
                bottom = lat
            if left > lon:
                left = lon
            if right < lon:
                right = lon

            # Geometry 생성
            w.point(lon, lat)
            # 속성 기록
            w.record(cartype, speed, lon, lat, loc, datetime)

        # Boundary Box 입력
        w._bbox = [left, bottom, right, top]

        w.save(shppath + savefile + '.shp')
        # Projection 설정
        proj = open(shppath + savefile + '.prj', 'w')
        epsg = 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["degree",0.0174532925199433]]'
        proj.write(epsg)
        proj.close()

    # 각 shp생성시 걸리는 시간 확인
    t = time.time()-start_time
    minute = int(t)/60
    second = t - 60*minute
    print '{0} : {1} seconds'.format(minute, second)

print 'Jobs done..'
