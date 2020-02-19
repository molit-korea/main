$(function(){
    
    function fnMove(eng_name){
        var offset = $(".pred_inner_container."+eng_name).offset();
        console.log(offset);
        $('html, body').animate({scrollTop : offset.top}, 200);
    }
    
    function pred_request_jquery(){
        var eng_product_name_dict={'감자':'potato', '무':'radish', '파인애플':'pineapple', '토마토':'tomato'};
        var product=$('#product').text();
        //console.log("ININ");
        
        var eng_product_name=eng_product_name_dict[product];
        
        console.log("product : "+product);
        //fnMove(eng_product_name);
        
        $.ajax({
            url:'http://1.214.89.7:8000/integral/',
            type:'get',
            //data:{'page':'block'},
            //dataType:'jsonp',
            //jsonp:'callback',
            success:function(ret){
                console.log("block.js ajax success"); // 이렇게하면 데이터 받아 온 후에 실행됨
                //ret=JSON.parse(ret);
                console.log(ret);
                $('.pred_inner_container').each(function(){
                   $(this).removeClass('disable');
                   $(this).addClass('disable');
                });
                
                var pred_active_class_name="."+eng_product_name;
                $(pred_active_class_name).removeClass('disable');
                
                $.each(ret, function(key, value){
                   
                   var key_str=key.toString();
                   //console.log(key_str);
                   //console.log("value : "+value.substring(2,value.length-2).trim()); // 정상적으로 가져오는 것을 확인
                   var ref_value=value.substring(2,value.length-2).trim();
                   //console.log(numberCounter);
                   
                   if(key_str.indexOf(eng_product_name)!=-1){ // 왜 하나만 애니메이션이 들어가지?
                       //console.log("key_str :"+key_str);
                        new numberCounter(key_str, parseFloat(ref_value)); // new를 통하여 객체를 새로 생성해주어야 함!
                   }
                   fnMove(eng_product_name);
                });
            },
            error:function(request, status, error){
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });
    }
   pred_request_in=pred_request_jquery; // 정상실행됨, js에서 jquery 함수 호출하는 방법
});


function pred_request(){
    console.log("Hello");
    pred_request_in();
        
}
    
$(function(){
    var $pred_box=$('.row .col-lg-3');
    var $pre_body=$('.pre_body');
    
    var innerhtml="";
    //console.log($pred_box);\
    
    
    
    
    $.each($pred_box, function(idx, data){
        console.log($(this).text());
        var name=$(this).text().trim();
        innerhtml+=
            '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modal_'+name+'_label" id="modal_'+name+'">'+
        					'<div class="modal-dialog" role="document">'+
        						'<div class="modal-content">'+
        							'<div class="modal-header">'+
        								'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
        								//'<h3 class="modal-title" id="modal_'+data+'_label">'+names[i]+'</h3>'+
        								'<h4>Select Product</h4>'+
        							'</div>'+
        							'<div class="modal-body">'+
        								'<h4>'+name+'이/가 선택되었습니다.</h4>'+
        							'</div>'+
        							'<div class="modal-footer">'+
        							    '<form class="pred_modal" method="get">'+
        	                    		    '<button type="button" class="btn btn-primary" onclick="pred_request();" data-dismiss="modal">Submit</button>'+
        	                    		
        	                    		'<button type="button" class="btn btn-default lab_sanger_modal_close" data-dismiss="modal">Close</button>'+
        	                    		'</form>'+
        	                    	'</div>'+
        	                    '</div>'+
        	                 '</div>'+
        	             '</div>'; 
    });
    
    $pre_body.append($(innerhtml));
 
});
