var d = add_layer();

function loading(s, func){
    $("#loading").fadeIn();
    playAlert = setInterval(function() {
        $("#loading").fadeOut();
        clearInterval(playAlert);
        func();
     }, s);
}

function readJSON(file) {
    var request = new XMLHttpRequest();
    request.open('GET', file, false);
    request.send(null);
    if (request.status == 200)
        return request.responseText;
};


function load_coco(){
    remove_point(d);
    var temp = readJSON('./sample/coco/01.json');
    temp = JSON.parse(temp);
    //time_list , location_list
    var time_list = temp['time_list'];
    var location_list = temp['location_list'];
    
    move_center(location_list[0][1],location_list[0][0])
    for(var i =0;i<location_list.length;i++)
        add_point(d,'coco',location_list[i][1],location_list[i][0],"./sample/coco/"+time_list[i][1]+".0.jpg");
}

function load_road1(){
    remove_point(d);
    var temp = readJSON('./sample/road01/01.json');
    temp = JSON.parse(temp);
    //time_list , location_list
    var time_list = temp['time_list'];
    var location_list = temp['location_list'];
    move_center(location_list[0][1],location_list[0][0])
    for(var i =0;i<location_list.length;i++)
        add_point(d,'coco',location_list[i][1],location_list[i][0],"./sample/road01/"+time_list[i][1]+".0.jpg");
}
function load_road2(){
    remove_point(d);
    var temp = readJSON('./sample/road02/01.json');
    temp = JSON.parse(temp);
    //time_list , location_list
    var time_list = temp['time_list'];
    var location_list = temp['location_list'];
    move_center(location_list[0][1],location_list[0][0])
    for(var i =0;i<location_list.length;i++)
        add_point(d,'coco',location_list[i][1],location_list[i][0],"./sample/road02/"+time_list[i][1]+".0.jpg");
}

function load_data1(){
    var temp = readJSON('./sample/data01/01.json');
    temp = JSON.parse(temp);
    var main = $("#main")[0]
    main.innerHTML = "<p>./sample/data01/2018.07_2019.04</p>";
    main.innerHTML += "<img class='data' src='./sample/data01/"+temp['01']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data01/"+temp['02']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data01/"+temp['03']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data01/"+temp['04']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data01/"+temp['05']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data01/"+temp['06']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data01/"+temp['07']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data01/"+temp['08']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data01/"+temp['09']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data01/"+temp['10']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data01/"+temp['11']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data01/"+temp['12']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data01/"+temp['13']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data01/"+temp['14']+"'>";

}
function load_data2(){
    var temp = readJSON('./sample/data02/01.json');
    temp = JSON.parse(temp);
    var main = $("#main")[0]
    main.innerHTML = "<p>./sample/data02/2018.04</p>";
    main.innerHTML += "<img class='data' src='./sample/data02/"+temp['01']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data02/"+temp['02']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data02/"+temp['03']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data02/"+temp['04']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data02/"+temp['05']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data02/"+temp['06']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data02/"+temp['07']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data02/"+temp['08']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data02/"+temp['09']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data02/"+temp['10']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data02/"+temp['11']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data02/"+temp['12']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data02/"+temp['13']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data02/"+temp['14']+"'>";

}

function load_data3(){
    var temp = readJSON('./sample/data03/01.json');
    temp = JSON.parse(temp);
    var main = $("#main")[0]
    main.innerHTML = "<p>./sample/data03/2019.07</p>";
    main.innerHTML += "<img class='data' src='./sample/data03/"+temp['01']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data03/"+temp['02']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data03/"+temp['03']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data03/"+temp['04']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data03/"+temp['05']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data03/"+temp['06']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data03/"+temp['07']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data03/"+temp['08']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data03/"+temp['09']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data03/"+temp['10']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data03/"+temp['11']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data03/"+temp['12']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data03/"+temp['13']+"'>";
    main.innerHTML += "<img class='data' src='./sample/data03/"+temp['14']+"'>";

}
