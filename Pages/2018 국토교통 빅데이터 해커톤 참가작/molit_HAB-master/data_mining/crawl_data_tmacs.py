import openpyxl
import xml.etree.ElementTree as ET
import urllib.request
import googlemaps
import ssl
import math




#AIzaSyDMYP61ZjTotiqBvY5bHdeY6bCko5xitlg 지오코딩인증키
key='AIzaSyDMYP61ZjTotiqBvY5bHdeY6bCko5xitlg'
gmaps=googlemaps.Client(key)
def geocode(adr):  #구글 지오코딩이용하여 지역을 검색하면 위도,경도를 리턴
    geo=gmaps.geocode(adr,language='ko')
    #print(geo)
    #print(geo[0]['geometry']['location']['lat'])
    lat=float(geo[0]['geometry']['location']['lat'])
    #print(geo[0]['geometry']['location']['lng'])
    lng=float(geo[0]['geometry']['location']['lng'])
    #print(geo[0]['formatted_address'])
    return (lat, lng)

def findtemp(year, month, day, lat, lon):  #기상자료개방포털api 접속하여 입력받은 좌표와 가장 가까운 관측소 찾은 후 입력받은 날짜의 날씨정보 리턴
    context = ssl._create_unverified_context()
    url="https://data.kma.go.kr/OPEN_API/AWSM/"+year+"/"+month+"/XML/stn_aws.xml"
    req = urllib.request.Request(url)
    #data = urllib.request.urlopen(req).read().decode("utf-8")
    data = urllib.request.urlopen(req,context=context)
    root= ET.parse(data).getroot()

    #print(root.findall("info"))
    lowdis=9999
    lowid=""

    for element in root.findall("info"):
        flat=float(element.findtext("lat"))
        flng=float(element.findtext("lon"))
        dt=(((lat-flat)**2)+((lon-flng)**2))**0.5
        if dt<=lowdis:
            lowdis=dt
            lowid=element.findtext("stn_id")
#    print("지역번호 "+lowid)
    url="https://data.kma.go.kr/OPEN_API/AWSM/"+year+"/"+month+"/XML/awsmdays_"+lowid+".xml"
    req = urllib.request.Request(url)
    #data = urllib.request.urlopen(req).read().decode("utf-8")
    data = urllib.request.urlopen(req,context=context)
    root= ET.parse(data).getroot()
    date= day
    ta= ""
    wd=""
    rn=""
    for element in root.findall("info"):
        if element.findtext("tm") == date:
            ta=element.findtext("ta_day")
            wd=element.findtext("ws_day")
            rn=element.findtext("rn_day")
    return ta, wd, rn
"""
print("평균기온 "+ta)
print("평균풍속 "+wd)
print("평균강수량 "+rn)
"""
"""
excel = openpyxl.load_workbook('2015_사망사고.xlsx') #사망사고 엑셀파일에 해당날짜,좌표의 날씨 정보 입력
sheet = excel.get_sheet_by_name('2015_사망사고')
sheet['AB1'].value = 'rlat'  # 수정된 위도
sheet['AC1'].value = 'rlon'  # 수정된 경도
sheet['AD1'].value = 'temp'  # 평균온도
sheet['AE1'].value = 'wind'  # 평균풍속
sheet['AF1'].value = 'rain'  # 평균강우량
#print(type(sheet['B2'].value))

for i in range(2, 4449):
    if i == 1000 or i== 2000 or i == 3000 or i == 4000:
        print(i)
    num = str(i)
    tmp = str(sheet['AA'+num].value)
    rlat = float(tmp[:6])
    tmp = str(sheet['Z'+num].value)
    rlon = float(tmp[:7])
    wholedate = str(sheet['B'+num].value)
    sheet['AB' + num].value = str(rlat)
    sheet['AC' + num].value = str(rlon)
    year = str(sheet['A'+num].value)
    month = wholedate[4:6]
    day = wholedate[6:8]
    temp, wind, rain = findtemp(year,month, day, rlat, rlon)
    sheet['AD'+num].value = temp
    sheet['AE'+num].value = wind
    if rain == 'null':
        rain = '0'
    sheet['AF'+num].value = rain

excel.save('2015_ver1.xlsx')
excel.close()
"""

for i in range(56, 57): #지오코딩이용해서 사고누적지점의 좌표값 입력
    print(i)
    excel = openpyxl.load_workbook('사고누적지점_사고지점정보('+str(i)+').xlsx')
    sheet = excel.get_sheet_by_name('%EC%82%AC%EA%B3%A0%EB%88%84%EC%')
    sheet['L1'].value = 'lat'
    sheet['M1'].value = 'lon'
    for j in range(2, 32):
        if i == 49 and j>= 26:
            continue
        adr = sheet['A'+str(j)].value
        index = adr.find('역')
        if index != -1:
            adr = adr[:index+1]
        index = adr.find('(')
        if index != -1:
            adr = adr[:index]
        index = adr.find('부근')
        if index != -1:
            adr = adr[:index]
        index = adr.find('앞')
        if index != -1:
            adr = adr[:index]
        index = adr.find('근방')
        if index != -1:
            adr = adr[:index]
        index = adr.find('남단')
        if index !=-1:
            adr = adr[:index]
        index = adr.find('북단')
        if index != -1:
            adr = adr[:index]
        index = adr.find('동단')
        if index != -1:
            adr = adr[:index]
        index = adr.find('서단')
        if index != -1:
            adr = adr[:index]
        index = adr.find('동쪽')
        if index != -1:
            adr = adr[:index]
        index = adr.find('서쪽')
        if index != -1:
            adr = adr[:index]
        index = adr.find('북쪽')
        if index != -1:
            adr = adr[:index]
        index = adr.find('남쪽')
        if index != -1:
            adr = adr[:index]
        index = adr.find('입구')
        if index != -1:
            adr = adr[:index]
        #print(adr)
        if adr != '삼양입구 사거리' and adr != '삼양동 사거리':
            index = adr.find(' 사거리')
            if index != -1:
                adr = adr[:index]
            index = adr.find(' 삼거리')
            if index != -1:
                adr = adr[:index]
            index = adr.find(' 교차로')
            if index != -1:
                adr = adr[:index]
        if adr == '월계2교교차로':
            adr = '월계2교'
        if adr == '거리공원입구교차로':
            adr = '거리공원입구'
        if adr == '송파구청사거리':
            adr = '송파구청'
        if adr == '장지교교차로':
            adr = '장지교'
        if adr == '평화의문삼거리':
            adr = '평화의문'
        if adr == '용두1치안센터':
            adr = '용두2치안센터'
        if adr == '제2마장교 ':
            adr = '마장교'
        if adr == '청계9가교차로':
            adr = '청계9가'
        if adr == '중랑구청사거리':
            adr = '중랑구청'
        if adr == '코엑스교차로':
            adr = '코엑스'
        if adr == '구로제2교 ':
            adr = '구로1교'
        if adr == '여의교교차로':
            adr = '여의교'
        if adr == '도림사거리':
            adr = '도림동'
        if adr == '신길3거리':
            adr = '신길3동'
        if adr == '남부교육청오거리':
            adr = '남부교육청'
        if adr == '회중앙경리단':
            adr = '중앙경리단'
        if adr == '용산우체국교차로':
            adr = '용산우체국'
        if adr == '목화3차 ':
            adr = '독산동 목화아파트'
        if adr == '금천구청입구삼거리':
            adr = '금천구청'
        if adr == '선암I.C 오거리':
            adr = '선암I.C'
        if adr == '천호신사거리':
            adr = '천호'
        if adr == '청암인터그린타워 ':
            adr = '청암'
        if adr == '내행사거리':
            adr = '동두천 내행'
        if adr == '큰시장회전교차로':
            adr = '동두천 큰시장'
        if adr == '단위농협사거리':
            adr = '생연동 농협'
        if adr == '성동3거리':
            adr = '포천시 성동'
        if adr == '무봉립마을':
            adr = '무봉리'
        if adr == '구신북대교':
            adr = '구신북대교앞'
        if adr == '별내대원칸타빌아파트 서측':
            adr = '별내대원칸타빌아파트'
        if adr == '태평관광휴게소 ':
            adr = '가남공룡휴게소'
        if adr == '영릉IC교 ':
            adr = '영릉입구'
        if adr == '일산구청사거리':
            adr = '일산구청'
        if adr == '명학육교 ':
            adr = '명학역'
        if adr =='삼막삼거리':
            adr = '안양시 석수동 삼막삼거리'
        if adr =='우림교차로':
            adr = '경기도 안성시 우림교차로'
        if adr == '가현교차로':
            adr = '경기도 안성시 가현동'
        if adr == '현수교차로':
            adr = '경기도 안성시 현수동'
        if adr == '안성대교사거리':
            adr = '안성대교'
        if adr == '외곽순환도로27.4km':
            adr = '경기도 외곽순환도로'
        if adr == '김포오룡동한화':
            adr = '한화아파트'
        if adr == '나진지하차도 ':
            adr = '나래지하차도'
        if adr == '통진읍사무소 동남':
            adr = '통진읍사무소'
        if adr == '중흥S클래스 2층 지하주차장':
            adr = '중흥S클래스'
        if adr == '덕보교교차로':
            adr = '덕보교'
        if adr == '하남대로 956 ':
            adr = '천현크레인'
        if adr == '나루6단지한화꿈에그린 ':
            adr = '동탄나루마을2차한화꿈에그린아파트'
        if adr == '시범한빛2단지삼부 ':
            adr = '삼부르네상스'
        if adr == '시범한빛2단지금호어울림 ':
            adr = '동탄금호어울림아파트'
        if adr == '형남고 ':
            adr = '향남고'
        if adr == '선우싱크':
            adr = '선우설비'
        if adr == '남광조명전시장 ':
            adr = '남광조명'
        if adr == '비봉IC 진입로':
            adr = '비봉IC'
        if adr == '숲속8단지경남아너스빌 ':
            adr = '숲속마을자연앤경남아너스빌아파트'
        if adr == '삼가교차로 6번국도':
            adr = '삼가교차로'
        if adr == '남한강프라자휴게실 ':
            adr = '남한강프라자휴게소'
        if adr == '양평군청사거리':
            adr = '양평군청'
        if adr == '수원I.C삼거리':
            adr = '수원I.C'
        if adr == '수지구청사거리':
            adr = '수지구청'
        if adr == '신지사거리':
            adr = '신지초등학교'
        if adr == '은빛마을휴먼시아8단지 ':
            adr = '고읍휴먼시아8단지'
        if adr == '서울외곽순환고속도로 시계방향':
            adr = '서울외곽순환고속도로'
        if adr == '과천의왕간고속화도로':
            adr = '의왕과천유료도로관리사무소'
        if adr =='북수원ic진입로':
            adr = '북수원IC'
        if adr == '의왕톨게이트 하이패스 2차로 의왕톨게이트 하이패스 2차로':
            adr = '의왕톨게이트'
        if adr == '하천리 유답촌마을':
            adr = '유답촌'
        if adr == '대곡리 685 오목교':
            adr = '경기도 가평군 가평읍 대곡리 685'
        if adr == '읍내리 가평보건소 후문':
            adr = '가평보건소'
        if adr == '포회촌마을':
            adr = '상색리.포회촌'
        if adr == '32-24 하나로마트 주차장':
            adr = '하면하나로마트'
        if adr == '청평아랫삼거리':
            adr = '하나로마트 청평점'
        if adr =='가평군청 북측':
            adr ='가평군청'
        if adr == '사그막커브길 가평9호 09-10':
            adr = '사기막'
        if adr == 'KT가평플라자 ':
            adr ='KT 가평지사'
        if adr == '완동사거리':
            adr ='완동'
        if adr =='신양아파트 남서':
            adr = '신양아파트'
        if adr == '남촌동 다리':
            adr = '남촌동'
        if adr == '대소인하사비 ':
            adr = '하나비원'
        if adr == '오산대 서북':
            adr = '오산대'
        if adr == '경부고속도로 하행선 378.4km지점':
            adr = '경부고속도로'
        if adr == '은대고가':
            adr ='온골고가차도'
        if adr =='초성리 초성삼거리 초성삼거리':
            adr ='초성삼거리'
        if adr =='3번국도상':
            adr ='3번국도'
        if adr =='파발교 하단':
            adr ='파발교'
        if adr =='통복1교 ':
            adr ='통복교'
        if adr == '소정리사거리':
            adr = '소정리'
        if adr =='신진리삼거리':
            adr = '신진리'
        if adr =='증포교차로':
            adr ='증포사거리'
        if adr =='복화2교사거리':
            adr = '복하2교사거리'
        if adr =='중원구청사거리':
            adr ='중원구청'
        if adr == '신곡고가교차로':
            adr ='신곡고가차도'
        if adr == '신촌건널목교차로':
            adr = 'GS셀프법원주유소'
        if adr =='한빛마을5단지롯데캐슬 ':
            adr ='캐슬앤칸타빌아파트'
        if adr =='선유로타리 원형로타리':
            adr ='파주 선유'
        print(adr)
        lat, lng = geocode(adr)
        lat1 = str(lat)[:6]
        lng1 = str(lng)[:7]
        sheet['L'+str(j)].value=lat1
        sheet['M' + str(j)].value = lng1
    excel.save('사고누적지점_사고지점정보('+str(i)+').xlsx')
    excel.close()
