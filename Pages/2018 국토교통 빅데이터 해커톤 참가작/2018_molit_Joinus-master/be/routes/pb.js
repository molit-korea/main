var express = require('express');
var router = express.Router();
var trends = require('google-trends-api');
var url = require('url');
var qs = require('querystring');
var apiai = require('apiai');
var app = apiai("a31af13aa824484c81bdbaacfda763e5");
var axios = require('axios');

// Function which returns speech from api.ai
var getRes = function(query) {
    var request = app.textRequest(query, {
        sessionId: '18'
    });
    const responseFromAPI = new Promise(
        function (resolve, reject) {
            request.on('error', function(error) {
                reject(error);
            });
            request.on('response', function(response) {
                console.dir(response);
                console.log("table : " + response.result.parameters.Table_Name);
                console.log("intent : " + response.result.metadata.intentName);
                // for(var i=0; response.result.fulfillment[message].length ; i++) {
                //     console.log(response.result.fulfillment[message][i]);
                // }
                response.result.fulfillment.messages.forEach(function(v, i) {
                    console.log("Message : ");
                    console.dir(v);
                })

                //resolve(response.result.fulfillment.speech);
                resolve(response.result);
            });
        });
    request.end();
    return responseFromAPI;
};
// test the command :

var convertForColName = function(ColName){
    var ret = '';
    if( ColName == 'houseprice') {
        ret = 'house_price';
    } else if( ColName == 'occurorarrest') {
        ret = 'occur_or_arrest';
    } else {
        ret = ColName;
    }
    return ret;
}

var convTblName = function(TblName){
    var ret = '';
    if( TblName == 'raw_crime') {
        ret = 'test1';
    } else if( TblName == 'raw_price' ) {
        ret = 'test2';
    } else {
        ret = TblName;
    }
    return ret;
}

var getParams = function(data) {
    const intent = data.metadata.intentName;
    const tbl = convTblName(data.parameters.Table_Name);
    var prms = {};
    if( intent == 'Database_Query_Join' && data.parameters.Column_Name1 != '') {
        console.log("test pam : " + data.parameters.Column_Name);
        //http://localhost/api/?function=join&table_name1=test1&col_name1=area&table_name2=test2&col_name2=address
        prms = {params:{function: 'join', table_name1: tbl, col_name1: convertForColName(data.parameters.Column_Name), table_name2: convTblName(data.parameters.Table_Name1), col_name2: convertForColName(data.parameters.Column_Name1)}};
    } else if( intent == 'Database_Query_Join') {
        console.log("test pam : " + data.parameters.Table_Name);
        prms = {params:{function: 'join', table_name1: tbl, col_name1: convertForColName(data.parameters.Column_Name)}};
    } else if( intent == 'Database_Query_Row_Delete') {
        //http://localhost/api/?function=row_filtering&table_name=row_crime&what_value=발생&which_col=occurorarrest
        //prms = {params:{function: 'data_load', table_name: data.parameters.Table_Name}};
        prms = {params:{function: 'row_filtering', table_name: tbl, what_value: data.parameters.Column_Value, which_col: convertForColName(data.parameters.Column_Name)}};
    } else if( intent == 'Database_Query_Column_Delete') {
        //http://localhost/api/?function=col_filtering&table_name=test1&ex_or_include=exclude&col_name_list=crime,occur_or_arrest
        var arrCol = '';
        var keys = Object.keys(data.parameters);
        for( var i=0; i < keys.length ; i++) {
            if( data.parameters[keys[i]] != data.parameters.Table_Name ) {
                console.log(data.parameters[keys[i]]);
                if( data.parameters[keys[i]] != ''){
                    arrCol += convertForColName(data.parameters[keys[i]]);
                    if( i != keys.length-1 ) {
                        arrCol += ',';
                    }
                }
            }
        }
        prms = {params:{function: 'col_filtering', table_name: tbl, ex_or_include: 'exclude', col_name_list: arrCol}};
    } else if( intent == 'Database_Query_Group_By_Add') {
        //http://localhost/api/?function=group_by&table_name=test1&col_name=area&sum_or_mean=sum
        prms = {params:{function: 'group_by', table_name: tbl, col_name: convertForColName(data.parameters.Column_Name), sum_or_mean: 'sum'}};
    } else if( intent == 'Database_Query_Load') {
        //http://localhost/api/?function=data_load&table_name=raw_crime
        prms = {params:{function: 'data_load', table_name: data.parameters.Table_Name}};
    } else if( intent == 'Database_Query_Load_Column') {
        //http://localhost/api/?function=col_filtering&table_name=test2&ex_or_include=include&col_name_list=address,house_price
        var arrCol = '';
        var keys = Object.keys(data.parameters);
        for( var i=0; i < keys.length ; i++) {
            if( data.parameters[keys[i]] != data.parameters.Table_Name ) {
                console.log(data.parameters[keys[i]]);
                if( data.parameters[keys[i]] != ''){
                    arrCol += convertForColName(data.parameters[keys[i]]);
                    if( i != keys.length-1 ) {
                        arrCol += ',';      // 마지막 키가 공백일 때, 마지막 콤마를 없애야 한다.
                    }
                }
            }
        }
        prms = {params:{function: 'col_filtering', table_name: tbl, ex_or_include: 'include', col_name_list: arrCol}};
    } else if( intent == 'Database_Query_Edit_Value') {
        //http://localhost/api/?function=unification_address&table_name=test2&col_name=address&unit=구단위
        prms = {params:{function: 'unification_address', table_name: tbl, col_name: convertForColName(data.parameters.Column_Name), unit: data.parameters.Column_Value}};
    } else if( intent == 'Database_Query_Group_By_Avg') {
        //http://localhost/api/?function=group_by&table_name=test2&col_name=address&sum_or_mean=mean
        prms = {params:{function: 'group_by', table_name: tbl, col_name: convertForColName(data.parameters.Column_Name), sum_or_mean: 'mean'}};
    }
    return prms;
}

router.get('/', function(req, resp, next) {
    var self = this;
    var retText='';
    getRes(req.query.txt)
    .then(function(res) {
            self.retText = res.fulfillment.speech;
            console.log("res : " + res);
            console.log("send text : " + self.retText);
            if( res.actionIncomplete == true ) {
                console.log("not enough");
                resp.send(self.retText);
            } else {
                var retParam = getParams(res);

                //API 동작 통신
                //결과 확인 후 챗봇응답.
                resp.send(self.retText);
                axios.get("http://35.231.16.137/api/", retParam).then(response => {
                    console.dir(response.data);
                    //resp.send(self.retText);
                })
            }
        }
    );
    //console.log("send text : " + retText);
    //res.send(retText);
});


module.exports = router;