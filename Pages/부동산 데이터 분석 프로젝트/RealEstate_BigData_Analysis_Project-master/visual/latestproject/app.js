var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');
var http = require('http');
var path = require("path");

var fs = require("fs");

var dFilePath = path.join(__dirname, "district_latlng.csv");
var cFilePath = path.join(__dirname, "city_latlng.csv");

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

var index = require('./routes/index');
var users = require('./routes/users');


var app = express();

var httpServer = http.createServer(app).listen(3002, function(req,res){
    console.log('Socket IO server has been started');
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var trade_esclient = new elasticsearch.Client({
    host: '163.180.117.252:9200'
});
var deposit_esclient = new elasticsearch.Client({
    host: '163.180.117.252:9200'
});
var rent_esclient = new elasticsearch.Client({
    host: '163.180.117.252:9200'
});

var io = require('socket.io')(httpServer);

io.on('connection',function(socket){
    console.log('user connection');

    socket.on('bound',function(data) {
        console.log(data.type);
        if(data.type == "apart_trades"||data.type == "office_trades") {
            trade_esclient.searchTarget(data.sw, data.ne, data.type).then(function (result) {
                    io.to(socket.id).emit('marker', result);
                }
            );
        }

        if(data.type == "apart_deposits") {
            deposit_esclient.searchTarget(data.sw, data.ne, "apart_rents").then(function (result) {
                    io.to(socket.id).emit('marker', result);
                }
            );
        }

        if(data.type == "office_deposits") {

            deposit_esclient.searchTarget(data.sw, data.ne, "office_rents").then(function (result) {
                    io.to(socket.id).emit('marker', result);
                }
            );
        }
        if(data.type == "apart_rents"||data.type == "office_rents") {
            rent_esclient.searchTarget(data.sw, data.ne, data.type).then(function (result) {
                    io.to(socket.id).emit('marker', result);
                }
            );
        }

    });
    socket.on('dong',function(data) {
        if(data.type == "apart_trades"||data.type == "office_trades") {
            trade_esclient.searchDong(data.sw, data.ne, data.type).then(function (result) {
                    io.to(socket.id).emit('marker', result);
                }
            );
        }

        if(data.type == "apart_deposits") {
            deposit_esclient.searchDong(data.sw, data.ne, "apart_rents").then(function (result) {
                    io.to(socket.id).emit('marker', result);
                }
            );
        }

        if(data.type == "office_deposits") {

            deposit_esclient.searchDong(data.sw, data.ne, "office_rents").then(function (result) {
                    io.to(socket.id).emit('marker', result);
                }
            );
        }
        if(data.type == "apart_rents"||data.type == "office_rents") {
            rent_esclient.searchDong(data.sw, data.ne, data.type).then(function (result) {
                    io.to(socket.id).emit('marker', result);
                }
            );
        }
    });
    socket.on('district',function(data) {
        if(data.type == "apart_trades"||data.type == "office_trades") {
            trade_esclient.searchDistrict(data.sw, data.ne, data.type).then(function (result) {
                    io.to(socket.id).emit('marker', result);
                }
            );
        }

        if(data.type == "apart_deposits") {
            deposit_esclient.searchDistrict(data.sw, data.ne, "apart_rents").then(function (result) {
                    io.to(socket.id).emit('marker', result);
                }
            );
        }

        if(data.type == "office_deposits") {

            deposit_esclient.searchDistrict(data.sw, data.ne, "office_rents").then(function (result) {
                    io.to(socket.id).emit('marker', result);
                }
            );
        }
        if(data.type == "apart_rents"||data.type == "office_rents") {
            rent_esclient.searchDistrict(data.sw, data.ne, data.type).then(function (result) {
                    io.to(socket.id).emit('marker', result);
                }
            );
        }
    });
    socket.on('city',function(data) {
        if(data.type == "apart_trades"||data.type == "office_trades") {
            trade_esclient.searchCity(data.sw, data.ne, data.type).then(function (result) {
                    io.to(socket.id).emit('marker', result);
                }
            );
        }

        if(data.type == "apart_deposits") {
            deposit_esclient.searchCity(data.sw, data.ne, "apart_rents").then(function (result) {
                    io.to(socket.id).emit('marker', result);
                }
            );
        }

        if(data.type == "office_deposits") {

            deposit_esclient.searchCity(data.sw, data.ne, "office_rents").then(function (result) {
                    io.to(socket.id).emit('marker', result);
                }
            );
        }
        if(data.type == "apart_rents"||data.type == "office_rents") {
            rent_esclient.searchCity(data.sw, data.ne, data.type).then(function (result) {
                    io.to(socket.id).emit('marker', result);
                }
            );
        }
    });
});

trade_esclient.searchTarget = function(sw,ne, type) {
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

deposit_esclient.searchTarget = function(sw,ne, type) {
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
                        },
                        must_not:{
                            range :{
                                rental_fee :{"gt":0}
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
                                    field : "deposit"
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
deposit_esclient.searchDong = function(sw,ne, type) {

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
                        },
                        must_not:{
                            range :{
                                rental_fee :{"gt":0}
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
                                    field : "deposit"
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

deposit_esclient.searchDistrict = function(sw,ne, type) {
    var selectedDistrict = [];

    for (var index in districts) { // 칼럼 갯수만큼 돌면서 적절한 데이터 추가하기.
        if (districts[index].lat <= ne._lat && districts[index].lat >= sw._lat && districts[index].lng <= ne._lng && districts[index].lng >= sw._lng){
            selectedDistrict.push(districts[index].district)
        }
    }
    return new Promise(function(resolve,reject){
        trade_esclient.search({
            index: type,
            body: {
                size : 0,
                query : {
                    bool : {
                        filter : {
                            terms : {
                                sub_city : selectedDistrict
                            }
                        },
                        must_not:{
                            range :{
                                rental_fee :{"gt":0}
                            }
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
                                    field : "deposit"
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

deposit_esclient.searchCity = function(sw,ne,type) {
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
                query : {
                    bool : {
                        must_not:{
                            range :{
                                rental_fee :{"gt":0}
                            }
                        }
                    }
                },
                aggs : {
                    name_aggs : {
                        terms : {
                            field : "city",
                            size : 100
                        },
                        aggs : {
                            avg_trade_price : {
                                avg : {
                                    field : "deposit"
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
rent_esclient.searchTarget = function(sw,ne, type) {
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
                        },
                        must:{
                            range :{
                                rental_fee :{"gt":0}
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
                                    field : "rental_fee"
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
rent_esclient.searchDong = function(sw,ne, type) {

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
                        },
                        must:{
                            range :{
                                rental_fee :{"gt":0}
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
                                    field : "rental_fee"
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

rent_esclient.searchDistrict = function(sw,ne, type) {
    var selectedDistrict = [];

    for (var index in districts) { // 칼럼 갯수만큼 돌면서 적절한 데이터 추가하기.
        if (districts[index].lat <= ne._lat && districts[index].lat >= sw._lat && districts[index].lng <= ne._lng && districts[index].lng >= sw._lng){
            selectedDistrict.push(districts[index].district)
        }
    }
    return new Promise(function(resolve,reject){
        trade_esclient.search({
            index: type,
            body: {
                size : 0,
                query : {
                    bool : {
                        filter : {
                            terms : {
                                sub_city : selectedDistrict
                            }
                        },
                        must:{
                            range :{
                                rental_fee :{"gt":0}
                            }
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
                                    field : "rental_fee"
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

rent_esclient.searchCity = function(sw,ne,type) {
    var selectedDistrict = [];

    console.log(type);
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
                query : {
                    bool : {
                        must:{
                            range :{
                                rental_fee :{"gt":0}
                            }
                        }
                    }
                },
                aggs : {
                    name_aggs : {
                        terms : {
                            field : "city",
                            size : 100
                        },
                        aggs : {
                            avg_trade_price : {
                                avg : {
                                    field : "rental_fee"
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
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


exports.trade_esclient = trade_esclient;
exports.deposit_esclient = deposit_esclient;

module.exports = app;


