### DESCRIBE YOUR STORAGE STEP


## 아파트 매매가
```
curl -XPUT http://localhost:9200/apart_trades/ -d '
{
  "mappings" : {
    "apart_trade" : {
      "properties" : {
        "address" : { "type" : "keyword" },
        "detailed_address" : { "type" : "keyword" },
        "year" : { "type" : "long" },
        "month" : { "type" : "long" },
        "build_year" : { "type" : "long" },
        "trade_price" : { "type" : "long" },
        "city" : { "type" : "keyword" },
        "sub_city" : { "type" : "keyword" },
        "dong" : { "type" : "keyword" },
        "code" : { "type" : "keyword" },
        "name" : { "type" : "keyword" },
        "floor" : { "type" : "long" },
        "exclusive_private_area" : { "type" : "float" },
        "date": { "type" : "date" , "format" : "dateOptionalTime"},
        "location" : { "type" : "geo_point" }
      }
    }
  }
}'
```
#Bulk API 
```
curl -XPOST localhost:9200/_bulk --data-binary @apart_rent1.json
...
curl -XPOST localhost:9200/_bulk --data-binary @apart_rent30.json
```

## 아파트 전월세
```
curl -XPUT http://localhost:9200/apart_rents/ -d '
{
  "mappings" : {
    "apart_rent" : {
      "properties" : {
        "address" : { "type" : "keyword" },
        "detailed_address" : { "type" : "keyword" },
        "year" : { "type" : "long" },
        "month" : { "type" : "long" },
        "build_year" : { "type" : "long" },
        "deposit" : { "type" : "long" },
        "rental_fee" : { "type" : "long" },
        "city" : { "type" : "keyword" },
        "sub_city" : { "type" : "keyword" },
        "dong" : { "type" : "keyword" },
        "code" : { "type" : "keyword" },
        "name" : { "type" : "keyword" },
        "floor" : { "type" : "long" },
        "exclusive_private_area" : { "type" : "float" },
        "date": { "type" : "date" , "format" : "dateOptionalTime"},
        "location" : { "type" : "geo_point" }
      }
    }
  }
}'
```
#Bulk API 
```
curl -XPOST localhost:9200/_bulk --data-binary @apart_trade1.json
...
curl -XPOST localhost:9200/_bulk --data-binary @apart_trade24.json
```

## 오피스텔 매매가
```
curl -XPUT http://localhost:9200/office_trades/ -d '
{
  "mappings" : {
    "office_trade" : {
      "properties" : {
        "address" : { "type" : "keyword" },
        "detailed_address" : { "type" : "keyword" },
        "year" : { "type" : "long" },
        "month" : { "type" : "long" },
        "build_year" : { "type" : "long" },
        "trade_price" : { "type" : "long" },
        "city" : { "type" : "keyword" },
        "sub_city" : { "type" : "keyword" },
        "dong" : { "type" : "keyword" },
        "code" : { "type" : "keyword" },
        "name" : { "type" : "keyword" },
        "floor" : { "type" : "long" },
        "exclusive_private_area" : { "type" : "float" },
        "date": { "type" : "date" , "format" : "dateOptionalTime"},
        "location" : { "type" : "geo_point" }
      }
    }
  }
}'
```
#Bulk API 
```
curl -XPOST localhost:9200/_bulk --data-binary @office_trade1.json
...
curl -XPOST localhost:9200/_bulk --data-binary @office_trade2.json
```
## 오피스텔 전월세
```
curl -XPUT http://localhost:9200/office_rents/ -d '
{
  "mappings" : {
    "office_rent" : {
      "properties" : {
        "address" : { "type" : "keyword" },
        "detailed_address" : { "type" : "keyword" },
        "year" : { "type" : "long" },
        "month" : { "type" : "long" },
        "build_year" : { "type" : "long" },
        "deposit" : { "type" : "long" },
        "rental_fee" : { "type" : "long" },
        "city" : { "type" : "keyword" },
        "sub_city" : { "type" : "keyword" },
        "dong" : { "type" : "keyword" },
        "code" : { "type" : "keyword" },
        "name" : { "type" : "keyword" },
        "floor" : { "type" : "long" },
        "exclusive_private_area" : { "type" : "float" },
        "date": { "type" : "date" , "format" : "dateOptionalTime"},
        "location" : { "type" : "geo_point" }
      }
    }
  }
}'
```
#Bulk API 
```
curl -XPOST localhost:9200/_bulk --data-binary @office_rent1.json 
...
curl -XPOST localhost:9200/_bulk --data-binary @office_rent2.json 
```

