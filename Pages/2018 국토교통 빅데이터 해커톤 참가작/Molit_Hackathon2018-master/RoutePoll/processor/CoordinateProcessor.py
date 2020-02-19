import os
import sys
from path import Path

class Coordinate:
    def __init__(self, fromCoord: float, toCoord: float):
        self.fromCoord = fromCoord
        self.toCoord = toCoord
        print("Initializing coordinate instance")
        print("FROM : ", self.fromCoord)
        print("TO : ", self.toCoord)

        self.preprocess()

    def preprocess(self):
        self.fromCoord = str(self.fromCoord).replace("(", "").replace(")", "")
        self.toCoord = str(self.toCoord).replace("(", "").replace(")", "")

    def writeData(self):
        parent = Path.getcwd() + "\\ServerDatabase\\"
        if os.path.exists(parent) is not True:
            os.mkdir(parent)

        dataFilePath = parent + "CoordinateData.csv"
        print("Data File Path : ", dataFilePath)

        with open(dataFilePath, mode='a+', encoding='UTF-8') as file:
            file.write(self.fromCoord + "," + self.toCoord + "\n")

