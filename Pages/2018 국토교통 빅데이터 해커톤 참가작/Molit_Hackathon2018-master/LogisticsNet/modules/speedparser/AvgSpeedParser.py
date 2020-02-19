import os
import sys
import pathlib as paths
import csv
import numpy as np

class AvgSpeedParser:
    datasetPath_DEFAULT = paths.Path.joinpath(paths.Path(os.getcwd()).parent, "datasets/")
    def __init__(self):
        print("Average Speed Parser 0.0.1")
        print("DEFAULT DATASET PATH : ", self.datasetPath_DEFAULT)

    def readSpeed(self, linkID: int, hour: int = None, roadID:bool = False, roadLength:bool = False):
        self.linkID = linkID
        self.hour = hour
        self.roadID = roadID
        self.roadLength = roadLength

        return self.iterateData(self.linkID, self.hour)

    def iterateData(self, linkID: int, hour: int):
        retArr = []
        avgSpeed: np.float32 = 0
        with open(paths.Path.joinpath(self.datasetPath_DEFAULT, "Avg_Speed.csv"), mode='r', encoding='cp949') as file:
            reader = csv.reader(file, delimiter=',')
            count = 0
            for row in reader:
                if count > 0:
                    if int(row[0]) == linkID and (hour is None):
                        retArr.append(row)
                    elif int(row[0]) == linkID and hour is not None:
                        avgSpeed = row[9]
                        avgSpeed = np.float32(avgSpeed)
                count += 1

        if hour is not None:
            return avgSpeed
        elif hour is None:
            return retArr







