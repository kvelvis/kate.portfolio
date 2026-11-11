const headerBg = ['#f1e4cb', '#e84028', '#f1e4cb', 'green', 'pink']

$('nav ul li a').click(function () {

    let href = $(this).attr('href')
    // console.log(href);
    let sectTop = $(href).offset().top
    // console.log(sectTop);
    $('html').animate({ 'scrollTop': sectTop })
})

$(window).scroll(function () {
    let scrollTop = $(window).scrollTop()
    let h = $(window).height()
    let cnt = $('section').length


    $('section').each(function (i) {
        let setionTop = $(this).offset().top
        let video = $(this).find('video')[0];
        if (scrollTop >= setionTop - 100) {
            if (video) video.play();
            $('nav ul li').removeClass('on')
            $('nav ul li').eq(i).addClass('on')
            $('section').removeClass('on')
            console.log(headerBg[i]);
            $('header').css({ 'backgroundColor': headerBg[i] })
            $('section').eq(i).addClass('on')


        } else {
            if (video) video.pause()
        }
    })
})


let sections = document.querySelectorAll('section')

sections.forEach(function (section,i) {
    section.addEventListener('wheel', function (e) {
        e.preventDefault()
        let delta = e.deltaY
        
        if(delta<0 && i===0){
            return
        }else if(delta>0 && i===sections.length-1){
            return
        }
        let targetSection = delta < 0 ? section.previousElementSibling : section.nextElementSibling
        if (targetSection) {
            let targetOffsetTop = targetSection.offsetTop
            window.scrollTo({ top: targetOffsetTop, behavior: 'smooth' })
        }
    })
})

//click event
let s1 = 0;
$('.bar').click(function () {
    s1 = !s1
    if (s1) {
        $('nav, .block').addClass('mobile')
    } else {
        $('nav, .block').removeClass('mobile')
    }

})