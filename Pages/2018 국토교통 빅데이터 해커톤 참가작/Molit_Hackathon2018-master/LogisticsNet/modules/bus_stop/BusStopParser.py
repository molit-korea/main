# xjMzo%2FLBk00kwsQo4TucSZU3HAzRNW3W2NsZN8Tb2OHGKJ%2FiNwVwySpPAO3cquznmfrhSF1HjirSI%2BWgPW5DMg%3D%3D

from requests import Request
import requests
import untangle
from bs4 import BeautifulSoup
import sys
"""
X : Longitude
Y : Latitude
"""

req = requests.get(url="http://ws.bus.go.kr/api/rest/stationinfo/getStationByPos?ServiceKey=" +
                  "xjMzo%2FLBk00kwsQo4TucSZU3HAzRNW3W2NsZN8Tb2OHGKJ%2FiNwVwySpPAO3cquznmfrhSF1HjirSI%2BWgPW5DMg%3D%3D&" +
                   "tmX=126.985017&tmY=37.516904" + "&radius=200")

response = req.text
print(response)

doc = untangle.parse(req.text)
print(doc)
print(doc.ServiceResult.comMsgHeader)
soup = BeautifulSoup(response, 'lxml')
print(soup.find_all(name="stationid"))
print(soup.find_all(name="stationnm"))
print(soup.find_all(name="dist"))
print(soup.find_all(name="gpsy"))
print(soup.find_all(name="gpsx"))

stationID = soup.find_all(name="stationid")


"""
        let origin = "37.516904,126.985017";
        let destination = "37.345234,127.930432";
"""