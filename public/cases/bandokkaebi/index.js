const headerBg = [
    "#1e2c5a",
    "#1e2c5a",
    "#ff7800",
    "#ffe100",
    "#7057a3",
    "#eb6ea5",
    "#c4d700",
    "#00341f",
  ];
  
  const h1Img = ["logo_y.png", "logo_n.png", "logo_w.png"];
  
  const menu_y = [
    "intro_y.png",
    "yyd_y.png",
    "banpo_y.png",
    "ddp_y.png",
    "cheong_y.png",
    "market_y.png",
    "christ_y.png",
  ];
  const menu_n = [
    "intro_n.png",
    "yyd_n.png",
    "banpo_n.png",
    "ddp_n.png",
    "cheong_n.png",
    "market_n.png",
    "christ_n.png",
  ];
  const menu_w = [
    "intro_w.png",
    "yyd_w.png",
    "banpo_w.png",
    "ddp_w.png",
    "cheong_w.png",
    "market_w.png",
    "christ_w.png",
  ];
  
  const sns_y = [
    "twitter_y.png",
    "facebook_y.png",
    "insta_y.png",
    "youtube_y.png",
  ];
  const sns_n = [
    "twitter_n.png",
    "facebook_n.png",
    "insta_n.png",
    "youtube_n.png",
  ];
  const sns_w = [
    "twitter_w.png",
    "facebook_w.png",
    "insta_w.png",
    "youtube_w.png",
  ];
  
  let headerElem = document.querySelector("header");
  headerElem.style.backgroundColor = headerBg[0];
  
  let menuElems = headerElem.querySelectorAll(".menu li");
  let snsElems = headerElem.querySelectorAll(".sns li");
  let sectionElems = document.querySelectorAll("section");
  
  let home=document.querySelector('a.top')
  
  window.addEventListener("scroll", function () {
    let scrTop = window.scrollY;

    // snachala berem nimer section 
    sectionElems.forEach((section, i) => {
     
      let secTop = section.offsetTop;
      
     //sravnivaem position section i scrolloffset
      if (scrTop >= secTop) {
        headerElem.style.backgroundColor = headerBg[i];
      //sravnenie po nomeru section esli section 0 1 ili 4 color budet yellow
        if (i == 0 || i == 1 || i == 4) {

          //header h1 img
          headerElem.querySelector("h1 img").setAttribute("src", "./img/" + h1Img[0]);

          //nav menu img
          menuElems.forEach((li, j) => {
            li.querySelector("img").setAttribute("src", "./img/" + menu_y[j]);
          });
          //sns menu img
          snsElems.forEach((li, k) => {
            li.querySelector("img").setAttribute("src", "./img/" + sns_y[k]);
          });

          // esli section drugie po mimo
        } else if (i == 2 || i == 3 || i == 5 || i == 6) {
          headerElem.querySelector("h1 img").setAttribute("src", "./img/" + h1Img[1]);
          menuElems.forEach((li, j) => {
            li.querySelector("img").setAttribute("src", "./img/" + menu_n[j]);
          });
          snsElems.forEach((li, k) => {
            li.querySelector("img").setAttribute("src", "./img/" + sns_n[k]);
          });

          //header background
        } else {
          headerElem.querySelector("h1 img").setAttribute("src", "./img/" + h1Img[2]);
          menuElems.forEach((li, j) => {
            li.querySelector("img").setAttribute("src", "./img/" + menu_w[j]);
          });
          snsElems.forEach((li, k) => {
            li.querySelector("img").setAttribute("src", "./img/" + sns_w[k]);
          });
        }
      }
    });
  
  
  if(scrTop>=1000){
      home.style.opacity=1
  }else{
      home.style.opacity=0
  }
  
  home.addEventListener('click',function(e){
      e.preventDefault()
      window.scrollTo({top:0,left:0,behavior:"smooth"})
  })
  
  });
  menuElems.forEach(li => {
  li.addEventListener('click',function(e){
    e.preventDefault()
    let href=li.querySelector('a').getAttribute('href')
    
    let secTop=document.querySelector(href).offsetTop
    window.scrollTo({top:secTop,left:0,behavior:"smooth"})
  })
  });

  
  $('a.next').click(function(){

    $('.slide-wrap').animate({'left':'-100%'}), function(){
        $('.slide').first().appendTo('.slide-wrap')
        $('.slide-wrap').css({'left':'0%'})
    
    } 
 
})


$('a.prev').click(function(){

$('.slide-wrap').animate({'left':'0%'}), function(){
    $('.slide').last().prependTo('.slide-wrap')
    $('.slide-wrap').css({'left':'100%'})
}

})