import os
import sys
import pathlib as paths
import csv

class SpeedParser:
    datasetPath_DEFAULT = paths.Path.joinpath(paths.Path(os.getcwd()).parent, "datasets/")
    def __init__(self):
        print("Speed Parser 0.0.1")
        print("DEFAULT DATASET PATH : ", self.datasetPath_DEFAULT)

    def readSpeed(self, linkID: int):
        self.linkID = linkID

        return self.iterateData(self.linkID)

    def iterateData(self, linkID: int):
        retArr = []
        with open(paths.Path.joinpath(self.datasetPath_DEFAULT, "Speed.csv"), mode='r', encoding='cp949') as file:
            reader = csv.reader(file, delimiter=',')
            count = 0
            for row in reader:
                if count > 0:
                    if int(row[3]) == linkID:
                        retArr.append(row)
                count += 1
        return retArr







