from modules.speedparser.SpeedParser import SpeedParser
from modules.speedparser.AvgSpeedParser import AvgSpeedParser

"""
parser = SpeedParser()
speedData = parser.readSpeed(1039256)
print(speedData)
"""

parser = AvgSpeedParser()
avgSpeedData = parser.readSpeed(1000002, 4)
print(avgSpeedData)


