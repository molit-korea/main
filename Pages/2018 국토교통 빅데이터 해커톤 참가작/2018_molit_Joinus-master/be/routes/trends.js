var express = require('express');
var router = express.Router();
var trends = require('google-trends-api');
var url = require('url');
var qs = require('querystring');

router.get('/', function(req, res, next) {
    console.log("--------------trend-------------- ");
    // var parsedUrl = JSON.stringify(req.query);
    // console.log("Served req : "+ parsedUrl);
    //  trends.interestOverTime(
    //      {
    //     keyword: parsedUrl['keyword'].toString(),
    //     startTime: new Date(parsedUrl.startTime),
    //     endTime: new Date(parsedUrl.endTime),
    //     geo: parsedUrl.geo,
    //     //property: parsedUrl.property.toString()
    // }
    //     ).then((result) => {
    //     console.log('---------------------called trend--------------------');
    //     console.log(result);
    //     res.send(result);
    // }).catch((err) => {
    //     console.log("--------------ERROR-------------- ");
    //     console.log(err);
    // });
    console.log(req.query);
    trends.interestOverTime({
        keyword: req.query.keyword,
        startTime: new Date(req.query.startTime),
        endTime: new Date(req.query.endTime),
        geo: req.query.geo,
        property: req.query.property
    }).then((result) => {
        console.log("***********************------------- " + typeof(result));

        var ob = JSON.parse(result);
        ob.about = req.query.property;
        //console.log(ob);
        console.log('---------------------called trend--------------------');
        res.send(ob);

    }).catch((err) => {
        console.log(err);
    });
});

router.get('/rank', function(req, res, next) {
    console.log("--------------RANK-------------- ");
    console.log(req.query);
    var _geo = '';
    if(req.query.geo == 'UK') {
        _geo = 'GB';
    }
    trends.interestOverTime({
        keyword: req.query.keyword,
        startTime: new Date(req.query.preStartTime),
        endTime: new Date(req.query.endTime),
        geo: _geo
    }).then((result) => {
        var _obj ={};
        _obj  = JSON.parse(result);
        console.log("type1 : " + typeof(result) + "type2 : " + typeof(_obj));
        console.log("[RESULT][RANK] : " + _obj.default.timelineData.length);
        var _preMonth = 0;
        var _cntDate = 0;
        var _addValue = 0;
        var _cntMonth = 0;
        var _avgValue = [];
        var retRank = {};
        for(var i=1; i<_obj.default.timelineData.length; i++){
            var _nowDate = new Date(_obj.default.timelineData[i].formattedTime);

            console.log("nowdate : "+ _nowDate.getMonth());
            if( _preMonth != _nowDate.getMonth()+1 || i == _obj.default.timelineData.length-1 ){
                _preMonth = _nowDate.getMonth()+1;
                console.log("month is changed, " + _preMonth );
                if( _cntDate != 0 ) {
                    _avgValue[_cntMonth-1] = Math.round(_addValue / _cntDate);
                    console.log("AVG : " + _avgValue);
                }
                _cntMonth++;
                _cntDate = _addValue = 0;
            }
            _cntDate++;
            _addValue += _obj.default.timelineData[i].value[0];
        };
        console.log("AVG LANGTH : " + _avgValue.length + "    " + _avgValue[0], _avgValue[1]);
        retRank = {"company":req.query.keyword, "avg":_avgValue[_avgValue.length-1], "deviation":_avgValue[_avgValue.length-1] - _avgValue[_avgValue.length-2]}
        console.log("retRank : " + retRank.company + retRank.avg +"    "+ retRank.deviation );
        res.send(retRank);
    }).catch((err) => {
        console.log("[ERR][TrendRank] : " + err);
    });
});


module.exports = router;