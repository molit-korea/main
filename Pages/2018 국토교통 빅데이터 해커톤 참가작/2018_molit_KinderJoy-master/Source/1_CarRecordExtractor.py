#-*- coding: utf-8 -*-

"""
기초데이터 확장자를 txt로 바꾼 다음 'bus'폴더에 저장
강원도(42), 속도: 5이상, 데이터 취득간격:2초
조건을 만족하는 데이터를 csv파일(탭으로 구분)로 '42'폴더에 추출
"""


import pandas as pd
import os.path
import time

chunksize = 10**6

# DTG기초데이터 필드 구성
fieldnames = ['TripKey', 'DeviceModel', 'ChadaeNumber', 'CarType', 'RegCarNumber', 'RegBusinessNumber',
                  'DriverCode', 'DailyDistance', 'AccumulatedDistance', 'Speed', 'RPM', 'BreakSignal', 'PosX',
                  'PosY', 'GIS_V', 'AX', 'AY', 'ComState', 'Loc_CD', 'BusinessLoc_CD', 'Business_CD', 'DateTime']
# 추출할 데이터 필드
subfields = ['CarType', 'Speed', 'PosX', 'PosY', 'Loc_CD', 'DateTime']


def data_backup(s, dat, fname):
    """
    일괄 처리시 메모리 부족 현상이 발생하여 수차례에 걸쳐 dataframe을 csv파일로 저장
    :param s: 파일 순번
    :param dat: dataframe
    :param fname: 저장파일명
    :return: 없음
    """

    df = pd.DataFrame(columns=fieldnames)
    df = df.from_records(dat)
    fname = './42/' + fname + str(s).rjust(3, '0') + '.csv'
    df.to_csv(fname, index=False, sep='\t')


def addpoint2(txt):
    """
    2째 자리에 소수점 입력
    """
    text = str(txt)
    return float(text[:2] + '.' + text[2:])


def addpoint3(txt):
    """
    3째 자리에 소수점 입력
    """
    text = str(txt)
    return float(text[:3] + '.' + text[3:])


carrecordfolder = "../Data/"
if not os.path.exists('./42'):
    os.mkdir('./42/')

for f in os.listdir(carrecordfolder):
    # carrecordfolder내 txt파일에 대하여 처리
    if f.endswith('.txt'):
        start_time = time.time()
        n = 0
        inputfilename = os.path.splitext(f)[0]
        print inputfilename
        input_df = pd.read_csv(carrecordfolder + f, chunksize=chunksize, encoding='utf-8',  sep='|', skipinitialspace=True, header=None,
                       low_memory=False)
        # 추출 데이터 저장소 생성
        new_df = pd.DataFrame(columns=fieldnames)
        for chunk in input_df:
            if len(chunk) <= 0:
                break
            n += 1
            print '{0} {1}'.format(n, len(chunk))
            chunk.columns = fieldnames
            # 추출: 속도가 5초과, 강원도지역, 취득간격 2초
            subdf1 = chunk.loc[(chunk['Loc_CD'] == 42) & (chunk['Speed'] > 5) & (chunk['DateTime'] % 200 == 0)]
            new_df = new_df.append(subdf1, ignore_index=True, sort=False)

            print '{0}th Back Up!!'.format(n)
            if len(new_df) > 0:
                # 경위도에 소수점입력
                new_df['PosX'] = new_df['PosX'].apply(addpoint3)
                new_df['PosY'] = new_df['PosY'].apply(addpoint2)
                # 차량타입, 속도, 경도, 위도, 지역, 날짜시간 데이터만 추출/저장
                data_backup(n, new_df[subfields], inputfilename)
                # 데이터 저장소를 비우고...
            new_df = pd.DataFrame(columns=fieldnames)
            # 각 파일별 처리 시간 출력
            t = time.time() - start_time
            minute = int(t) / 60
            second = t - 60 * minute
            print 'Processing Time: {0} : {1} seconds'.format(minute, second)

print "All Done!!"



