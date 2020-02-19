#-*- coding: utf-8 -*-

"""
추출된 csv파일로부터 shp파일 생성(projection: WGS84)
ArcGIS가 설치된 경우 실행 가능
MakeXYEventLayer를 이용하여 csv파일을 shp파일로 변환
"""

import arcpy
import time
from arcpy import env
import os

csvfolder = './extract/'
shpfolder = './shp/'

if not os.path.exists(shpfolder):
    os.mkdir(shpfolder)

# 파일 지오데이터베이스 생성
if not os.path.exists('./CarRecord.gdb'):
    arcpy.CreateFileGDB_management("./", "CarRecord.gdb", "9.2")

# Set environment setting
arcpy.env.workspace = './CarRecord.gdb'
arcpy.env.overwriteOutput = True

for csv in os.listdir(csvfolder):
    # csvfolder내의 csv파일에 대하여 처리
    if csv.endswith('.csv'):
        start_time = time.time()
        try:
            # Set the local variables
            in_Table = csvfolder + csv
            shpfilename = os.path.splitext(csv)[0]  # 순수 파일명
            x_coords = "PosX"                       # 경도
            y_coords = "PosY"                       # 위도
            out_Layer = 'csvEventLayer'             # 임시 레이어 파일
            # 좌표계 설정
            spRef = arcpy.SpatialReference("WGS 1984")
            print 'Start Process: ' + shpfilename
            # Make the XY event layer
            arcpy.MakeXYEventLayer_management(in_Table, x_coords, y_coords, out_Layer, spRef, '#')

            # Copy features to shapefile
            arcpy.CopyFeatures_management(out_Layer, shpfolder + shpfilename + '.shp')

            print 'End Process: ' + shpfilename
            # 각 파일별 처리 시간 출력
            t = time.time() - start_time
            minute = int(t) / 60
            second = t - 60 * minute
            print 'Processing Time: {0} : {1} seconds'.format(minute, second)

        except:
            # If an error occurred print the message to the screen
            print arcpy.GetMessages()


print 'script complete!!!!!'