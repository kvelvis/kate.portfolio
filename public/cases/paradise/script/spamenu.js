$(document).ready(function () {
   

$("ul.box-slide li").hover(function(){
$(".touch").stop().fadeIn();
});
$("ul.box-slide li").mouseout(function(){
    $(".touch").stop().fadeOut();
    });

    var slideI=0;
    setInterval(function(){
        
    if (slideI<2){
        slideI++;
    }else
    {
        slideI=0;
    }
    $(".box-slide li").eq(slideI).siblings().fadeOut();
    $(".box-slide li").eq(slideI).fadeIn();

},3000);
});