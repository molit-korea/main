import os
import sys
import path
import csv
from sklearn.cluster import KMeans
import numpy as np
import matplotlib.pyplot as plt
import requests

from Coordinate import Coordinate
from User import User
from Cluster import Cluster
from BusPath import BusPath

class PathFinder:
    databasePath: str = path.Path.getcwd().parent + "\\ServerDatabase\\Coordinate_CAT_B.csv"

    userList = []

    def __init__(self):
        print("PathFinder 0.0.1")
        self.readDatabase()


    def clustering(self, mainClusterSize = 8, subClusterSize = 16):
        classifier = KMeans(n_clusters=mainClusterSize)

        tmpList = np.zeros(shape=(len(self.userList), 4))
        for idx in range(len(self.userList)):
            tmpList[idx][0] = self.userList[idx].frontCoordinate.latitude
            tmpList[idx][1] = self.userList[idx].frontCoordinate.longitude
            tmpList[idx][2] = self.userList[idx].endCoordinate.latitude
            tmpList[idx][3] = self.userList[idx].endCoordinate.longitude

        frontList = tmpList[:,0:2]
        endList = tmpList[:,2:4]

        tmpList = np.concatenate((frontList, endList))

        classified = classifier.fit(tmpList)
        labels = classified.labels_

        pair_label = self.findPair(np.asarray(frontList), np.asarray(endList), clf=classified)
        string_label = self.convertNpArrayToStringArray(pair_label)

        siftedPair = self.siftValuableOnes(string_label)

        center = classifier.cluster_centers_

        clusters = []
        busPaths = []
        # TODO : create Cluster instances of <mainClusterSize>
        for idx in range(mainClusterSize):
            cluster = Cluster(idx, center[idx, 1], center[idx, 0])
            cluster.mainCluster = True
            clusters.append(cluster)

        for idx in range(len(siftedPair)):
            split = siftedPair[idx].split(" ")
            head = int(split[0])
            end = int(split[1].lstrip())

            for k in range(len(clusters)):
                if head == clusters[k].clusterID and clusters[k].isOccupied() is not True:
                    clusters[k].headedto = end
                    clusters[k].front = True
                    clusters[k].occupied = True
                    busPaths.append(BusPath(clusters[k], clusters[end]))
                    break

        print("========================== Initial Bus Paths Created ==========================")

        with open("F:\\PUBLIC\\Project\\Molit_Hackathon2018\\RoutePoll\\ServerDatabase\\BusPath.csv", encoding="UTF-8", mode="w+") as file:
            for idx in range(len(busPaths)):
                file.write(busPaths[idx].frontCluster.clusterID.__str__() + "," + busPaths[idx].frontCluster.isHeadedTo().__str__()
                           + "," + busPaths[idx].frontCluster.busStopCoordinate.latitude
                           + "," + busPaths[idx].frontCluster.busStopCoordinate.longitude + "," +
                           busPaths[idx].endCluster.busStopCoordinate.latitude + "," +
                           busPaths[idx].endCluster.busStopCoordinate.longitude + "\n")


    def plot(self, tmpList, labels):
        plt.scatter(tmpList[:, 1], tmpList[:, 0], c=labels, edgecolors='k')
        plt.show()


    def findPair(self, pair1, pair2, clf):
        start_label = []
        end_label = []
        result_label = []

        start_label = clf.predict(pair1)
        end_label = clf.predict(pair2)
        result_label = np.vstack((start_label, end_label))

        result_label = np.transpose(result_label)

        return result_label

    def convertNpArrayToStringArray(self, targetArray):
        retArr = []
        for idx in range(len(targetArray)):
            retArr.append(str(targetArray[idx]))

        return retArr

    def siftValuableOnes(self, pairLabel):
        valuable = {}
        for idx in range(1, len(pairLabel)):
            if pairLabel[idx] not in valuable:
                valuable[pairLabel[idx]] = 1
            elif pairLabel[idx] in valuable:
                valuable[pairLabel[idx]] += 1

        values = list(valuable.values())
        keys = list(valuable.keys())

        avg = 0
        for idx in range(len(valuable)):
            avg += values[idx]
        avg = avg // len(valuable)

        retArr = []
        for idx in range(len(valuable)):
            if valuable[keys[idx]] > avg:
                retArr.append(str(keys[idx])[1:][:-1])

        return retArr


    def readDatabase(self):
        with open(self.databasePath, encoding="UTF-8", mode='r') as file:
            reader = csv.reader(file, delimiter=',')
            counter: int = 0
            for row in reader:
                frontLatitude = row[0]
                endLatitude = row[2]
                frontLongitude = row[1]
                endLongitude = row[3]

                frontCoordinate = Coordinate(frontLatitude, frontLongitude)
                endCoordinate = Coordinate(endLatitude, endLongitude)

                user = User(frontCoordinate=frontCoordinate, endCoordinate=endCoordinate, userID=counter)
                self.userList.append(user)

                counter += 1