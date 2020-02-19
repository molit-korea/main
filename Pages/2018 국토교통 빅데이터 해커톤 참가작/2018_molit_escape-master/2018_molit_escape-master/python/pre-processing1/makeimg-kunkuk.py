import numpy
output = open('dotimg00000', 'w')
import gzip
import re
import matplotlib.pyplot as plt
import math
plt.figure(figsize=(30,30))
for i in range(3) :
    xl = []
    yl = []
    num="0000"+str(i)
    with gzip.open('D:/2018 빅데이터 해커톤/dtg_0801_버스전체/1/1/part-r-'+num+'.gz', 'rb') as f:
    
        count = 0
        row = f.readline()
        while row :
            data = str(row)
            data = str(data[2:-3])
#        print(data)
#        print(data.__len__())
            k = 0
            for i in range(0,data.__len__()) :
                if data[i]== '|':
                    k = k + 1
                    if k == 12 :
                        xs = data[i+1:i+10]
                    if k == 13 :
                        ys = data[i+1:i+10]
                        break
            x = int(xs)
            y = int(ys)
            if 37536243 <= y and y <= 37547594 and 127063983 <= x and x <= 127083580 : # in Kunkuk block
                xl.append(x)
                yl.append(y)
            row = f.readline()
    plt.plot(xl,yl, ".",markersize=1,linewidth=None,markerfacecolor='black',color='red')
    del xl
    del yl


    
plt.savefig('resimg-kunkuk-3.png',transparent=True)
f.close()


print("finished")
output.close()
   