//cursor hover
(function () {

    const link = document.querySelectorAll('.hover-this');
    const move_cursor = document.querySelector('.move-cursor');
    
    const animateit = function (e) {
          const span = this.querySelector('span');
          const { offsetX: x, offsetY: y } = e,
          { offsetWidth: width, offsetHeight: height } = this,
    
          move = 25,
          xMove = x / width * (move * 2) - move,
          yMove = y / height * (move * 2) - move;
    
          span.style.transform = `translate(${xMove}px, ${yMove}px)`;
    
          if (e.type === 'mouseleave') span.style.transform = '';
    };
    
    const editCursor = e => {
          const { clientX: x, clientY: y } = e;
          move_cursor.style.left = x + 'px';
          move_cursor.style.top = y + 'px';
    };
    
    link.forEach(b => b.addEventListener('mousemove', animateit));
    link.forEach(b => b.addEventListener('mouseleave', animateit));
    window.addEventListener('mousemove', editCursor);
    
    })();
    
    
    
    
    
    
    //////// new cursor scale start
        var cursor = document.querySelector('.cursor'),
        cursorScale = document.querySelectorAll('.cursor-scale'),
        mouseX = 0,
        mouseY = 0
    
    gsap.to({}, 0.016, {
        repeat: -1,
    
        onRepeat: function () {
            gsap.set(cursor, {
                css: {
                    left: mouseX,
                    top: mouseY
                }
            })
        }
    });
    
    window.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY
    });
    
    cursorScale.forEach(link => {
        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('grow');
            cursor.classList.remove('grow-small');
        });
        link.addEventListener('mousemove', () => {
            cursor.classList.add('grow');
            if(link.classList.contains('small')){
                cursor.classList.remove('grow');
                cursor.classList.add('grow-small');
            }
        });
    });
//cursor finished
    
    var sections = $('section')
      , nav = $('nav')
      , nav_height = nav.outerHeight();
    
    $(window).on('scroll', function () {
      var cur_pos = $(this).scrollTop();
      
      sections.each(function() {
        var top = $(this).offset().top - nav_height,
            bottom = top + $(this).outerHeight();
        
        if (cur_pos >= top && cur_pos <= bottom) {
          nav.find('a').removeClass('tr');
          sections.removeClass('active');
          
          $(this).addClass('tr');
          nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('tr');
        }
      });
    });
    
    nav.find('a').on('click', function () {
      var $el = $(this)
        , id = $el.attr('href');
      
      $('html, body').animate({
        scrollTop: $(id).offset().top - nav_height
      }, 500);
      
      return false;
    });
     
    
    $(window).scroll(function(){
    
        let scrT = $(this).scrollTop();
       
       
        $('section').each(function(i){
          let secTop=$(this).offset().top;
          let secBot=$(this).offset().bottom;
          let secLoc=$(this).index()
       
         
          if(scrT>=secTop){
            //   $('header nav ul li a').eq(secLoc).addClass('tr')
              
            
            $('article').removeClass('on');
            $(this).find('article').addClass('on');
            
            $('nav li a').removeClass('on');
            $('nav li').eq(i).find('a').addClass('on');
            $('header').removeClass()
            $('header').addClass('bg' + i)
          } else{
            // $('header nav ul li a').eq(secLoc).removeClass('tr')
            // $('header nav ul li a').eq(secLoc).removeClass('tr')
          }
    
        })
    })
    
    // $('section').mousewheel(function(e,delta){
    //   if(delta>0){
    //     let prev=$(this).prev().offset().top;
    //     $('html,body').stop().animate({'scrollTop':prev});
       
        
    //   }else if(delta<0){
    //     //console.log('down')
    //     let next=$(this).next().offset().top;
    //     $('html,body').stop().animate({'scrollTop':next});
        
    //   }
    // })
    
    
    
    
    // $('nav li a').click(function(){
    //     let sechref = $(this).attr('href');
    //     let secTop= $(sechref).offset().top;
       
    //     $('html,body').animate({'scrollTop':secTop});
    //     $('nav li a').removeClass('on');
    //     $(this).addClass('on');
    
    // })
 

