import csv, json

li = []
count = 1

for i in range(1, 3):
    trade_csv_filename = './office_trade_split/office_trade' + str(i) + '.csv'
    li = []
    count = 1
    with open(trade_csv_filename, newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        for address, detailed_address, year, month, day, build_year, trade_price, city, \
            sub_city, dong, code, name, floor, exclusive_private_area, date, latitude, longitude in reader:


            count += 1

            json_result = "{ \"index\" : { \"_index\": \"office_trades\", \"_type\": \"office_trade\"} } \r\n"
            json_result += "{"
            json_result += "\"address\":" + "\"" + address + "\"" + ","
            json_result += "\"detailed_address\":" + "\"" + detailed_address + "\"" + ","
            json_result += "\"year\":" + year + ","
            json_result += "\"month\":" + month + ","
            json_result += "\"build_year\":" + build_year + ","
            json_result += "\"trade_price\":" + trade_price + ","
            json_result += "\"city\":" + "\"" + city + "\"" + ","
            json_result += "\"sub_city\":" + "\"" + sub_city + "\"" + ","
            json_result += "\"dong\":" + "\"" + dong + "\"" + ","
            json_result += "\"code\":" + "\"" + code + "\"" + ","
            json_result += "\"name\":" + "\"" + name + "\"" + ","
            json_result += "\"floor\":" + floor + ","
            json_result += "\"exclusive_private_area\":" + exclusive_private_area + ","
            json_result += "\"date\":" + "\"" + date + "\"" + ","
            json_result += "\"location\":" + "{"
            json_result += "\"lat\":" + latitude + ","
            json_result += "\"lon\":" + longitude
            json_result += "}"
            json_result += "}\r\n"
            li.append(json_result)

            print("count : " , count , ", address : ", address, "lat,lng " ,latitude, ", ",longitude)
    trade_csv_out_filename = './office_trade_split_out/office_trade' + str(i) + '.json'
    with open(trade_csv_out_filename, "w") as f:
        for e in li:
            # e.strip()
            f.write(e)
    print("#complte" , i)


