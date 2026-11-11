(function() {
  var  burger2;



  burger2 = document.querySelector(".burger2");




  burger2.addEventListener("click", function() {
    return burger2.classList.toggle("on");
  });
 $(".welcome").click(function(){
   $(".welcome").fadeOut(700);
 });


$(".burger2").click(function(){
  $(".shadow").stop().fadeIn(1500);
});
$(".logosmall").click(function(){
  $(".shadow").fadeOut();
});



$("ul.nav li").eq(0).hover(function(){
  $(".wrap").css({"background-image":"url(./w.jpeg)"});
  
});

$("ul.nav li").eq(0).mouseout(function(){
  $(".wrap").css({"background-image":"url('b4e774ee7296d12f180103_MEN_168_01.jpeg')"});
  
});

$("ul.nav li").eq(1).hover(function(){
  $(".wrap").css({"background-image":"url(./park.jpeg)"});
  
});

$("ul.nav li").eq(1).mouseout(function(){
  $(".wrap").css({"background-image":"url('b4e774ee7296d12f180103_MEN_168_01.jpeg')"});
  
});

$("ul.nav li").eq(2).hover(function(){
  $(".wrap").css({"background-image":"url(./club.jpeg)"});
  
});

$("ul.nav li").eq(2).mouseout(function(){
  $(".wrap").css({"background-image":"url('b4e774ee7296d12f180103_MEN_168_01.jpeg')"});
  
});
$("ul.nav li").eq(3).hover(function(){
  $(".wrap").css({"background-image":"url(./plaza.jpeg)"});
  
});

$("ul.nav li").eq(3).mouseout(function(){
  $(".wrap").css({"background-image":"url('b4e774ee7296d12f180103_MEN_168_01.jpeg')"});
  
});
$("ul.nav li").eq(4).hover(function(){
  $(".wrap").css({"background-image":"url(./art.jpeg)"});
  
});

$("ul.nav li").eq(4).mouseout(function(){
  $(".wrap").css({"background-image":"url('b4e774ee7296d12f180103_MEN_168_01.jpeg')"});
  
});


}).call(this);