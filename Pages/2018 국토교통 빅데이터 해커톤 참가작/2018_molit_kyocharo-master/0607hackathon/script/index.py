import csv
import collections as c
import os

TRACKING_SEC = 4

TRIP_NUM = 0
SPEED = 9
GPS_lat = 12
GPS_lng = 13
DIR = 14

SPEED_THRESHOLD_A = 11
SPEED_THRESHOLD_B = 7

IR = 1
DR = 2
RR = 3
UR = 4

count = 0
def work(filename):
    dic = {}
    file_open_list = {}
    with open("result/seoul-1528370240223/" + filename, "r", 16777216) as csv_file:  # using 16MB python file cache;
        try:
            csv_reader = csv.reader(csv_file)
            for row in csv_reader:

                trip_num = row[TRIP_NUM]

                file = None
                if trip_num in file_open_list:
                    file = file_open_list[trip_num]
                else:
                    file = open("result2/" + trip_num, "w+")
                    file_open_list[trip_num] = file

                if trip_num not in dic:  # new trip_num
                    dic[trip_num] = c.deque(maxlen=5)
                    dic[trip_num].append(row)
                    dic[trip_num].append(row)
                    dic[trip_num].append(row)
                    dic[trip_num].append(row)
                    dic[trip_num].append(row)
                else:
                    dic[trip_num].append(row)

                cur_speed = int(dic[trip_num][-1][SPEED])
                past_speed = int(dic[trip_num][-4][SPEED])

                writer = csv.writer(file)
                gps_lat = dic[trip_num][-1][GPS_lat]
                gps_lng = dic[trip_num][-1][GPS_lng]

                if int(gps_lng) < 10 or int(gps_lat) < 10:
                    continue

                if cur_speed - past_speed > SPEED_THRESHOLD_A:
                    writer.writerow([trip_num, gps_lat, gps_lng, IR])
                elif cur_speed - past_speed < - SPEED_THRESHOLD_B:
                    writer.writerow([trip_num, gps_lat, gps_lng, DR])

                cur_dir = int(dic[trip_num][-1][DIR])
                past_dir = int(dic[trip_num][-3][DIR])

                if abs(cur_dir - past_dir) >= 120 and past_speed > 15:
                    writer.writerow([trip_num, gps_lat, gps_lng, UR])
                elif abs(cur_dir - past_dir) >= 60 and past_speed > 15:
                    writer.writerow([trip_num, gps_lat, gps_lng, RR])
        except UnicodeDecodeError:
            print("Unicode decode error occured.")

if __name__ == "__main__" :
    for filename in os.listdir("result/seoul-1528370240223/"):
        print("working on " + filename)
        work(filename)
