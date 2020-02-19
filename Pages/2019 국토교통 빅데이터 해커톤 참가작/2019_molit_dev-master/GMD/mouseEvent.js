var width = 480;
var height = width*9/16;
var id = 0;
function mouse_position(uri)
{
    var e = window.event;
    var posX = e.clientX;
    var posY = e.clientY;
    add_div(uri, posY-height+5, posX-width+5);
    //return [posX,posY];
}

function add_div(uri, top, left){
    $("#view")[0].innerHTML = "<img src='"+uri+"'>";
}


function del_img(me){
    $("#img_"+me).fadeOut().remove();
}