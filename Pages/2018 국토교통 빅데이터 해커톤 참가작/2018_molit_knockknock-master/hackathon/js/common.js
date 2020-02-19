$(function(){

// radio, checkbox design
//$('input').checkBox();


// main search
var mainChk = function(){
	var winWidth = Math.max($(window).width(), window.innerWidth);
	if (winWidth < 768){
		if ( $("#mainConsbg").length > 0 ) {
			
		} else {
			$('.search').css('display','none');
		}
	} else {
			$('.search').css('display','block');
	}
	
}


$(window).resize(function () {
mainChk();
});

mainChk();




//banner full select design
$.fn.extend({
	pStyle : function(options) {
		this.each(function() {
			var currentSelected = $(this).find(':selected');
			$(this).after('<span class="tSelectBox"><span class="tSelectBoxInner">'+currentSelected.text()+'</span></span>').css({position:'absolute', left:'0', top:'0',opacity:0,fontSize:$(this).next().css('font-size')});
			var selectBoxSpan = $(this).next();
			var selectBoxWidth = parseInt($(this).width()) - parseInt(selectBoxSpan.css('padding-left'));   
			var selectBoxSpanInner = selectBoxSpan.find(':first-child');
			selectBoxSpan.css({display:'inline-block'});
			selectBoxSpanInner.css({width:selectBoxWidth, display:'inline'});
			var selectBoxHeight = parseInt(selectBoxSpan.height()) + parseInt(selectBoxSpan.css('padding-top')) + parseInt(selectBoxSpan.css('padding-bottom'));
			var selectWidth = $(this).siblings('.tSelectBox').width();

			var winWidth = Math.max( $(window).width(), window.innerWidth);
			$(this).css("width",selectWidth+32+"px");
			
			$(this).height(selectBoxHeight).change(function(){
				selectBoxSpanInner.text($(this).find(':selected').text()).parent().addClass('changed');
				});
			});
	}
});


$('select').each(function(){
	$(this).bind('focus',function(){
		$(this).siblings('span').css('border','1px red solid');
	});
});

$('select').each(function(){
	$(this).bind('focusout',function(){
		$(this).siblings('span').css('border','1px #ddd solid');
	});
});

$('#headerWrap select').each(function(){
	$(this).bind('focusout',function(){
		$(this).siblings('span').css('border','1px #fff solid');
	});
});

//<-- 수정171018     추가해주세요
$('#headerWrap #langBox select').each(function(){
	$(this).bind('focusout',function(){
		$(this).siblings('span').css('border','1px #ddd solid');
	});
});
//-->

$(window).load(function(){
	$('.topSelect').pStyle();
});

$(window).resize(function(){ 

	$(".topSelect").each(function () {		
		var winWidth = Math.max( $(window).width(), window.innerWidth);
		var selectWidth = $(this).siblings(".tSelectBox").width();
		var selectHeight = $(this).siblings(".tSelectBox").height();
		$(this).css({"width":selectWidth+32+"px","height":selectHeight+"px"});		
	});

});









var mnaviView = function (){//M
	$('ul[id^=topSubm]').css('display','none').css('height','auto');
	$('a[id^=topNavi]').removeClass('hover');
	$(this).siblings('ul').css({'display':'block'}); 
	$(this).addClass('hover');	
}


var menuClear = function (){

	$('#navibg').stop().animate({'height':'0'},300);
	//$('#navibg').css('border-bottom','0');
	$('ul[id^=topSubm]').stop().animate({'height':'0'},300);
	$('a[id^=topNavi]').removeClass('hover');

}


var menuBlock = function (){

	var depId = this.id;
	var depClass = depId.substr(0,7);
	var depNum = depId.substr(7,8);

	$('ul[id^=topSubm]').css('display','block');

	if (depClass == 'topNavi') {
		$('a[id^=topNavi]').removeClass('hover');
		$(this).addClass('hover');
	}

	if (depClass == 'topSubm') {
		targetDiv = $(this).siblings();
		targetDiv.addClass('hover');
	}

	$('#navibg').stop().animate({'height':'170px'},200);
	$('ul[id^=topSubm]').stop().animate({'height':'170px'},300);

}


var menuEvent = function () {
	
	$('a[id^=topNavi]').each(function() {
		if( $('#topMenu').is('.on') ){ //1200 이상
			$(this).mouseenter(menuBlock)
					   .focus(menuBlock)
					  .mouseleave(menuClear);
			$(this).unbind('click');

//			$(this).mouseenter(function(){//메뉴오버스타일
//				var spanWidth = $(this).children('span').width();
//				$(this).children('u').stop().animate({'width':spanWidth},200);
//			});
//			$(this).mouseleave(function(){
//				$(this).children('u').stop().animate({'width':'0'},200);
//			});

		} else { //1200이하
			$(this).click(mnaviView);
			$(this).unbind('mouseenter mouseleave focus')
		}
	});

	$('ul[id^=topSubm]').each(function() {
		if( $('#topMenu').is('.on') ){ //1200 이상
			$(this).mouseenter(menuBlock)
					  .mouseleave(menuClear);
			$(this).unbind('click');

//			$(this).mouseenter(function(){//메뉴오버스타일
//				var spanWidth = $(this).siblings('a').children('span').width();
//				$(this).siblings('a').children('u').stop().animate({'width':spanWidth},200);
//			});
//			$(this).mouseleave(function(){
//				$(this).siblings('a').children('u').stop().animate({'width':'0'},200);
//			});

		} else { //1200이하
			$(this).click(mnaviView);
			$(this).unbind('mouseenter mouseleave focus')
		}
	});

	$('#navibg').each(function() {
		if( $('#topMenu').is('.on') ){ //1200 이상
			$(this).mouseenter(menuBlock)
					  .focus(menuBlock)
					  .mouseleave(menuClear);
			$(this).unbind('click');
		} else { //1200이하
			$(this).click(mnaviView);
			$(this).unbind('mouseenter mouseleave focus')
		}
	});


	$('#contents, .curContents, .subContents #headerWrap').bind('focusin', function(){
		menuClear();
	});
	
	
}


var menuWchk = function(){
	var winWidth = Math.max($(window).width(), window.innerWidth);

	if(winWidth > 767){
		$('#topMenu').addClass('on'); 
	} else {
		$('#topMenu').removeClass('on');
	}

	menuEvent();
}


menuWchk();





// Resize, Orientation Control
$(window).resize(function () {
	menuWchk();

	var winWidth = Math.max($(window).width(), window.innerWidth);
	if (winWidth > 767){
		setTimeout( function(){
			$('#naviWrap').removeAttr('style');
			$('#allBg').css('display','none');
		},300);	
	}

});




// M Mode Control
$('#mNavi a').click(function(){
	var winHeight = $('#allwrap').height();
	$('#naviWrap').css({'display':'block','height':winHeight});
	$('#naviWrap').stop().animate({'right':'0'},300);
	$('#allBg').css('display','block');
	$('ul[id^=topSubm]').css('display','none');		
});


$('#mnaviHead a').click(function(){
	$('#naviWrap').stop().animate({'right':'-50%'},300);
	setTimeout( function(){
		$('#naviWrap').css('display','none'); 
		$('#allBg').css('display','none');
	},300);
});

$('#allBg').click(function(){
	$('#mnaviHead a').click();
});





});