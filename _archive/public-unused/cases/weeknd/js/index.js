

let s1 = 0
$('.bar').click(function () {
    s1 = !s1
    if (s1) {
        $(this).find('span').addClass('on')
        $('body').css({ overflow: 'hidden' })
        $('nav').animate({ 'right': '0' })
    } else {
        $(this).find('span').removeClass('on')
        $('body').css({ overflow: 'visible' })
        $('nav').animate({ 'right': '-100%' })
    }

})



        //모바일
        function mobile(){
            $('body').css({overflow:'auto'})
            $('.slide').css({width:'100%'})
            $('.container').css({width:'100%', marginTop:'50px'})
            $('.wrap').css({width:'100%', flexWrap:'wrap', marginLeft:'0'})
            $('.btn').fadeOut()
            $('.wrap').off('mousewheel')
        }
        //태블릿
        function tablet(){
            $('body').css({})
            $('.slide').css({width:'100%'})
            $('.container').css({width:'50%', marginTop:'0'})
            $('.wrap').css({width:'1000%', flexWrap:'noWrap', marginLeft:'-100%'})
            $('.btn').fadeIn()
        }
        //데스크탑
        function desk(){
            $('body').css({overflow:'hidden'})
            $('.slide').css({width:'100%'})
            $('.container').css({width:'25%', marginTop:'0'})
            $('.wrap').css({width:'1000%', flexWrap:'noWrap', marginLeft:'-100%'})
            $('.btn').fadeIn()
        }
