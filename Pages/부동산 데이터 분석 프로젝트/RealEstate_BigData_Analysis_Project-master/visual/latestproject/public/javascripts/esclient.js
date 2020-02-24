var fs = require("fs");
var path = require("path");

var app = require('../../app.js');

var trade_esclient = app.trade_esclient;

var dFilePath = path.join(__dirname, "../../district_latlng.csv");


var cFilePath = path.join(__dirname, "../../city_latlng.csv");

var data = fs.readFileSync(dFilePath, {encoding: "utf8"});
var rows = data.split("\n");
var districts = [];


var dcolumns = ['district','lat','lng'];
for (var rowIndex in rows) {
    var row = rows[rowIndex].split(",");

    var data = {}; // 빈 객체를 생성하고 여기에 데이터를 추가한다.
    for (var columnIndex in dcolumns) { // 칼럼 갯수만큼 돌면서 적절한 데이터 추가하기.
        var column = dcolumns[columnIndex];
        data[column] = row[columnIndex];
    }
    districts.push(data);
}

var cities = [];

var ccolumns = ['city','lat','lng'];
data = fs.readFileSync(cFilePath, {encoding: "utf8"});
rows = data.split("\n");
for (var rowIndex in rows) {
    var row = rows[rowIndex].split(",");

    var data = {}; // 빈 객체를 생성하고 여기에 데이터를 추가한다.
    for (var columnIndex in ccolumns) { // 칼럼 갯수만큼 돌면서 적절한 데이터 추가하기.
        var column = ccolumns[columnIndex];
        data[column] = row[columnIndex];
    }
    cities.push(data);
}
cities = cities.slice(0, -1);
districts = districts.slice(0, -1);

trade_esclient.searchTarget = function(sw,ne, type) {
    console.log("target");
    return new Promise(function(resolve,reject){
        trade_esclient.search({
            index: type,
            body: {
                size : 0,
                query : {
                    bool : {
                        filter : {
                            geo_bounding_box : {
                                location : {
                                    top_left : {
                                        lat : ne._lat,
                                        lon : sw._lng
                                    },
                                    bottom_right : {
                                        lat : sw._lat,
                                        lon : ne._lng
                                    }
                                }
                            }
                        }
                    }
                },
                aggs : {
                    name_aggs : {
                        terms : {
                            field : "name",
                            size : 100
                        },
                        aggs : {
                            avg_trade_price : {
                                avg : {
                                    field : "trade_price"

                                }
                            },
                            location : {
                                top_hits : {
                                    size: 1,
                                    _source :
                                        {include : ['location']}
                                }
                            }

                        }
                    }
                }
            }
        }).then(function (resp) {
            resolve(resp.aggregations.name_aggs.buckets);
        }, function (err) {
            reject(err.message);
        });

    })
};
trade_esclient.searchDong = function(sw,ne, type) {

    return new Promise(function(resolve,reject){
        trade_esclient.search({
            index: type,
            body: {
                size : 0,
                query : {
                    bool : {
                        filter : {
                            geo_bounding_box : {
                                location : {
                                    top_left : {
                                        lat : ne._lat,
                                        lon : sw._lng
                                    },
                                    bottom_right : {
                                        lat : sw._lat,
                                        lon : ne._lng
                                    }
                                }
                            }
                        }
                    }
                },
                aggs : {
                    name_aggs : {
                        terms : {
                            field : "dong",
                            size : 100
                        },
                        aggs : {
                            avg_trade_price : {
                                avg : {
                                    field : "trade_price"
                                }
                            },
                            location : {
                                top_hits : {
                                    size: 1,
                                    _source :
                                        {include : ['location']}
                                }
                            }

                        }
                    }
                }
            }
        }).then(function (resp) {
            resolve(resp.aggregations.name_aggs.buckets);
        }, function (err) {
            reject(err.message);
        });

    })
};

trade_esclient.searchDistrict = function(sw,ne, type) {
    var selectedDistrict = [];

    for (var index in districts) { // 칼럼 갯수만큼 돌면서 적절한 데이터 추가하기.
        if (districts[index].lat <= ne._lat && districts[index].lat >= sw._lat && districts[index].lng <= ne._lng && districts[index].lng >= sw._lng){
            selectedDistrict.push(districts[index].district)
        }
    }
    console.log(selectedDistrict);
    return new Promise(function(resolve,reject){
        trade_esclient.search({
            index: type,
            body: {
                size : 0,
                query : {
                    bool : {
                        filter : {
                            terms : {
                                sub_city : selectedDistrict}
                        }
                    }
                },
                aggs : {
                    name_aggs : {
                        terms : {
                            field : "sub_city",
                            size : 100
                        },
                        aggs : {
                            avg_trade_price : {
                                avg : {
                                    field : "trade_price"
                                }
                            },
                            location : {
                                top_hits : {
                                    size: 1,
                                    _source :
                                        {include : ['location']}
                                }
                            }

                        }
                    }
                }
            }
        }).then(function (resp) {
            resolve(resp.aggregations.name_aggs.buckets);
        }, function (err) {
            reject(err.message);
        });

    })
};

trade_esclient.searchCity = function(sw,ne,type) {
    var selectedDistrict = [];

    for (var index in districts) { // 칼럼 갯수만큼 돌면서 적절한 데이터 추가하기.
        if (districts[index].lat <= ne._lat && districts[index].lat >= sw._lat && districts[index].lng <= ne._lng && districts[index].lng >= sw._lng){
            selectedDistrict.push(districts[index])
        }
    }
    return new Promise(function(resolve,reject){
        trade_esclient.search({
            index: type,
            body: {
                size : 0,
                aggs : {
                    name_aggs : {
                        terms : {
                            field : "city",
                            size : 100
                        },
                        aggs : {
                            avg_trade_price : {
                                avg : {
                                    field : "trade_price"
                                }
                            },
                            location : {
                                top_hits : {
                                    size: 1,
                                    _source :
                                        {include : ['location']}
                                }
                            }

                        }
                    }
                }
            }
        }).then(function (resp) {
            resolve(resp.aggregations.name_aggs.buckets);
        }, function (err) {
            reject(err.message);
        });

    })
};

exports.trade_esclient = trade_esclient;
