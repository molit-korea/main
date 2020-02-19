# -*- coding: utf-8 -*-
"""
속도제한 변경구역과 3_csv2Feature를 통해 얻어진 각각의 shp파일을 ArcGIS를 통해 처리된 최종 shp파일을 입력으로 함
(여기서는 SpeedByLocal.shp)
각 속도제한구역에 대한 속도분포, 평균, 표준편차를 그래프로 표현하고 Visualize.pdf로 저장
마지막에 생성된 csv파일을 SpeedByLocal.shp 파일과 join하면 속성값으로 평균, 표준편차 입력 가능
"""
from simpledbf import Dbf5
import pandas as pd
import os
import os.path
import matplotlib.pyplot as plt

resultfolder = '../Result/'
if not os.path.exists(resultfolder):
    os.mkdir(resultfolder)

# 최종 shp파일 중 dbf파일을 이용
dbf = Dbf5("./SpeedByLocal.dbf", codec='utf-8')
df_dbf = dbf.to_dataframe()
# db를 지역코드(임의생성)로 정렬
df_dbf = df_dbf.sort_values(by=['Location'])
# 각 지역코드별 통계자료 생성
group_stats = df_dbf.groupby(df_dbf['Location']).describe().transpose()

# groupnames = list(group_stats.columns)
# 각 지역별 Speed에 대한 평균값 생성
group_stats1 = df_dbf['Speed'].groupby(df_dbf['Location']).mean()
group_stats1 = pd.DataFrame(group_stats1)
group_stats1['Location'] = group_stats1.index
speed_stats = group_stats1
speed_mean = speed_stats.reset_index(drop=True)
speed_mean.columns = ['Mean', 'Location']

# 각 지역별 Speed에 대한 표준편차값 생성
group_stats1 = df_dbf['Speed'].groupby(df_dbf['Location']).std()
group_stats1 = pd.DataFrame(group_stats1)
group_stats1['Location'] = group_stats1.index
speed_stats = group_stats1
speed_std = speed_stats.reset_index(drop=True)
speed_std.columns = ['Std', 'Location']

fig = plt.figure()
# 각 지역별 표준편차 분포 그래프
ax1 = fig.add_subplot(2, 1, 1)
ax1.plot(speed_std.Location, speed_std.Std, label='Standard Deviation', c='r', lw=1)
ax1.legend()
ax1.set_ylabel('Standard Deviation')
plt.tick_params(axis='x', labelsize=5, rotation=90)

# 각 지역별 Speed 분포 그래프
ax2 = fig.add_subplot(2, 1, 2)
ax2.get_xaxis().set_ticks([])
ax2.scatter(x='Location', y='Speed', data=df_dbf, label='Speed', alpha=0.15, c='k', s=5)
ax2.set_ylabel('Speed')
ax2.legend()
ax2.set_ylim(0, 120)
plt.tick_params(axis='x', labelsize=5, rotation=90)
# 각 지역별 평균 그래프
# 평균 그래프는 speed분포와 중첩
ax3 = ax2.twinx()
ax3.plot(speed_mean.Location, speed_mean.Mean, label='Mean', c='b', lw=1)
ax3.set_ylabel('Mean')

ax3.legend()
ax3.set_ylim(0, 120)

# 그래프를 pdf / jpg파일로 저장

plt.savefig(resultfolder + 'Visualize.pdf')
plt.savefig(resultfolder + 'Visualize.jpg')
plt.show()

df = pd.merge(speed_mean, speed_std, how='left')
df.to_csv('std_mean.csv')
