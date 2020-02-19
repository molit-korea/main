$(function(){
   //var $chart=$(".page_chart");
   //var $cover=$(".page_cover");
    var $box=$('.row .col-lg-4');
    var $pred_box=$('.row .col-lg-3');
    var $drop_date=$('.drop_date');
    var $product=$('#product');
   
    $box.on('mouseover', function(){
      
      $(this).addClass('box_active');
    })
    .on('mouseleave', function(){
        $(this).removeClass('box_active');
    });
    
    $pred_box.on('mouseover', function(){
      
      $(this).addClass('box_active');
    })
    .on('mouseleave', function(){
        $(this).removeClass('box_active');
    })
    .on('click', function(){
       //console.log();
       //$(this).text
       
       //console.log($(this).text().trim()); // trim을 해주어야 공백 없이 값을 가져온다.
       $product.text($(this).text().trim());
       console.log($product.text());
       //console.log($product.text());
       //txtchoice=String($(this).text()).trim();
       //if (txtchoice=="무") {console.log("걸린다");}
       
       
    });

    /*
    //$drop_date
    var today=new Date(); // new를 사용해야 함 여기서는 시간까지 다 가져옴
    //var next_year=today.getYear();
    //var next_month=today.getMonth();
    //var next_day=today.getDay();
    var next_date=today;
    var innerhtml="";
    
    for(i=0; i<3;i++){
        next_date.setDate(next_date.getDate()+i); //getDate()는 일자를 가져온다.
        console.log(next_date);
        console.log(today);
        innerhtml+='<li>'+next_date.getFullYear()+'-'+next_date.getMonth()+'-'+next_date.getDate()+'</li>';
        
    }
    $drop_date.html($(innerhtml));
*/

});