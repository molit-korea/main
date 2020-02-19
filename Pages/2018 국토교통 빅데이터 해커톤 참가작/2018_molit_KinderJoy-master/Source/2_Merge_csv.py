#-*- coding: utf-8 -*-

"""
기초자료로부터 추출한 csv파일 수가 많으므로 다루기 쉽도록
40개 파일을 하나로 재생성
"""


import pandas as pd
import os
import os.path

def merge_csv():
    n = 0
    s = 1
    includeheader = True
    for csvfile in os.listdir(pth):
        if csvfile.endswith('.csv'):
            n += 1
            # 40개 파일마다 파일명을 달리하여 저장
            if n % (40 * s + 1) == 0:
                s += 1
                includeheader = True

            with open(extractpath + 'extract' + str(s).rjust(2, '0') + '.csv', "a+") as ex:
                with open(pth + csvfile, "r") as rd:
                    # 최초의 csv파일에만 헤더 포함
                    if includeheader:
                        data = rd.read()
                        includeheader = False
                    else:
                        data1 = rd.readlines()[1:]
                        data = ''.join(data1)
                ex.write(data)
            print csvfile


pth = './42/'
extractpath = './extract/'

if not os.path.exists(extractpath):
    os.mkdir(extractpath)
# csv파일을 병합
merge_csv()

