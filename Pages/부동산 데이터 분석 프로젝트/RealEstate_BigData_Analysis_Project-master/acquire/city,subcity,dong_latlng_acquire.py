from urllib.parse import quote
from urllib.request import Request, urlopen
import csv
import ssl
import json
import time
import pandas as pd

google_map_key = "google API Key 입력"

# url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + kor_url + '&key=' + google_map_key + '&language=ko'
# print("url : ", url)


latlng_dict = {}

add_latlng_dict = {}

def get_latlng(url, address, google_map_key):
    if address not in latlng_dict: # dict에 없을때만, api 호출
        req = Request(url, headers={'X-Mashape-Key': google_map_key})
        ssltext = ssl.SSLContext(ssl.PROTOCOL_TLSv1)
        company_addr_json = urlopen(req, context=ssltext).read().decode('utf8')
        addr = json.loads(company_addr_json)
        print(addr)
        addr_detail = addr['results'][0]
        latitude_addr = addr_detail['geometry']['location']['lat']
        longitude_addr = addr_detail['geometry']['location']['lng']
        result = str(latitude_addr) + "," + str(longitude_addr)
        latlng_dict[address] = result  # dict 에 저장

        add_latlng_dict[address] = result  # 새롭게 추가된 좌표 dict 에 저장
        print(latitude_addr)
        print(longitude_addr)
    else:
        return
    # 위경도좌표


path = './apartment_trade_data_all.csv'
data = pd.read_csv(path, header=None, skiprows=[0])

# 먼저 데이터 읽어오기
with open("apartment_trade_latlng.csv", "r") as f:
    latlng_data = csv.reader(f)
    for line in latlng_data:
        latlng_dict[line[0]] = line[1] + "," + line[2]


count = 0
for address in data[13]:

    # print(address)
    kor_url = quote(address)
    url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + kor_url + '&key=' + google_map_key + '&language=ko'
    get_latlng(url, address, google_map_key)
    # print(url)
    count += 1
    print(count, " : ", len(latlng_dict.keys()))
    # time.sleep(1)


with open("apartment_trade_latlng.csv", "a") as f:
    for key, value in add_latlng_dict.items():
        f.write(key + "," + value.split(',')[0] + "," + value.split(',')[1])
        f.write('\n')







