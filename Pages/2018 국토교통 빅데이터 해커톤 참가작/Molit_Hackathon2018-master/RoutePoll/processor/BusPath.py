from Cluster import Cluster
from Coordinate import Coordinate

import requests
from bs4 import BeautifulSoup

class BusPath:
    frontCluster: Cluster
    endCluster: Cluster

    clusters = [Cluster]

    def __init__(self, frontCluster: Cluster, endCluster: Cluster):
        self.frontCluster = frontCluster
        self.endCluster = endCluster

        self.getInitialBusPath()


    def getInitialBusPath(self):
        frontBusStopReq = requests.get(url="http://ws.bus.go.kr/api/rest/stationinfo/getStationByPos?ServiceKey=" +
                               "xjMzo%2FLBk00kwsQo4TucSZU3HAzRNW3W2NsZN8Tb2OHGKJ%2FiNwVwySpPAO3cquznmfrhSF1HjirSI%2BWgPW5DMg%3D%3D&" +
                               "tmX=" + str(self.frontCluster.getCenterLat()) + "&tmY=" + str(self.frontCluster.getCenterLng()) + "&radius=200")

        endBusStopReq = requests.get(url="http://ws.bus.go.kr/api/rest/stationinfo/getStationByPos?ServiceKey=" +
                                           "xjMzo%2FLBk00kwsQo4TucSZU3HAzRNW3W2NsZN8Tb2OHGKJ%2FiNwVwySpPAO3cquznmfrhSF1HjirSI%2BWgPW5DMg%3D%3D&" +
                                           "tmX=" + str(self.endCluster.getCenterLat()) + "&tmY=" + str(self.endCluster.getCenterLng()) + "&radius=200")

        frontSoup = BeautifulSoup(frontBusStopReq.text, "lxml")
        endSoup = BeautifulSoup(endBusStopReq.text, "lxml")

        stationNameF = frontSoup.find_all(name="stationnm")
        distF = frontSoup.find_all(name="dist")
        longitudeF = frontSoup.find_all(name="gpsx")
        latitudeF = frontSoup.find_all(name="gpsy")

        stationNameE = endSoup.find_all(name="stationnm")
        distE = endSoup.find_all(name="dist")
        longitudeE = endSoup.find_all(name="gpsx")
        latitudeE = endSoup.find_all(name="gpsy")

        longitudeF = longitudeF[0].string
        longitudeE = longitudeE[0].string
        latitudeF = latitudeF[0].string
        latitudeE = latitudeE[0].string

        fc = Coordinate(latitudeF, longitudeF)
        ec = Coordinate(latitudeE, longitudeE)
        self.frontCluster.busStopCoordinate = fc
        self.endCluster.busStopCoordinate = ec