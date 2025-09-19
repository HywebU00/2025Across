$(function(){

  const _html = $('html');
  const _body = $('body');
  const _window = $(window);

  let ww = _window.width();
  let wwNew = ww;

  // 設定RWD斷點
  const wwMedium = 700;   //此值以下是手機，700 ~ 1000 是平板
  const wwNormal = 1000;  //此值以上是電腦
  const wwMaximum = 1380; // 最大寬度

  // 取得主要區塊的 jQuery 物件
  const _siteHeader = $('.siteHeader');         // 網站標頭區塊
  const _siteFooter = $('.siteFooter');         // 網站頁尾區塊
   
  _body.append('<div class="sidebarMask"></div>');        // 製作行動版側欄遮罩
  const _sidebar = $('.sidebar');                         // 行動版側欄
  const _sidebarMask = $('.sidebarMask');                 // 行動版側欄遮罩

  // 取得各控制按鈕的 jQuery 物件
  const _sidebarCtrl = $('.sidebarCtrl'); // 行動版側欄控制按鈕
  const _goCenter = $('.goCenter');       // 「跳到主內容」按鈕
  const _goTop = $('.goTop');             // 「回到頁面頂端」按鈕


  
  // 行動版側欄
  // --------------------------------------------------------------- //
  
  // 複製 headNav 到側欄給行動版用
  $('.headNav').clone().prependTo(_sidebar);

  let _sidebarA = _sidebar.find('a, button');
  const _sidebarA_first = _sidebarA.eq(0);
  const _sidebarA_last = _sidebarA.eq(_sidebarA.length - 1);

  // 點擊漢堡圖示
  _sidebarCtrl.on('click' ,function(){
    const mhh = _siteHeader.find('h1').innerHeight();
    _sidebarMask.css('top', mhh );

    if (_sidebar.is(':visible')) {
      _sidebar.removeClass('reveal');
      _sidebarCtrl.removeClass('closeIt');
      _sidebarMask.fadeOut(500, function(){
        _sidebar.removeAttr('style');
        _body.removeClass('noScroll');
      });
    } else {
      _sidebar.css('top', mhh).show(10, 
        function(){ 
          _sidebar.addClass('reveal');
        } 
      );
      _sidebarCtrl.addClass('closeIt');
      _sidebarMask.fadeIn(500);
      _body.addClass('noScroll');
    }
  })

  // 點擊遮罩，隱藏側欄
  _sidebarMask.on( 'click', function(){
    _sidebar.removeClass('reveal');
    _sidebarCtrl.removeClass('closeIt');
    $(this).fadeOut(500, function(){
      _sidebar.hide();
      _body.removeClass('noScroll');
    });
  })

  // 鍵盤 Tab
  _sidebarCtrl.on('keydown', function(e){
    if ( e.code == 'Tab' && _sidebar.is(':visible') ) {      
      if(!e.shiftKey) {
        e.preventDefault();
        _sidebarA_first.trigger('focus');
      } else {
        e.preventDefault();
      }
    }
  })
  _sidebarA_last.on('keydown', function(e){
    if ( e.code == 'Tab' && !e.shiftKey ) {
      e.preventDefault();
      _sidebarCtrl.trigger('focus');
    }
  })

  _sidebarA_first.on('keydown', function(e){
    if ( e.code == 'Tab' && e.shiftKey ) {
      e.preventDefault();
      _sidebarCtrl.trigger('focus');
    }
  })
  // --------------------------------------------------------------- //



  // font size 和 cookie 
  // --------------------------------------------------------------- //
  // font size：顯示所選項目
  const _fontSize = $('.fontSize');
  var _fsOption = _fontSize.find('ul>li>button');

  _fsOption.on( 'click', function(){
    let fontClass = $(this).attr('class');
    $(this).parent('li').addClass('now').siblings().removeClass('now');
    _body.removeClass('largeFont mediumFont smallFont').addClass(fontClass);
    createCookie('FontSize', fontClass , 365);
  })

  function createCookie(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      var expires = '; expires=' + date.toGMTString();
    } else {
      expires = '';
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  function readCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  window.onload = function () {
    var cookie = readCookie('FontSize');

    _body.removeClass('largeFont mediumFont smallFont').addClass(cookie);
    _body.attr('class').split(' ').forEach(function(cls){
      _fsOption.filter('.' + cls).parent('li').addClass('now');
    });
  }
  // font size 和 cookie end -------------------------------------- //  



  // 回到頁面頂端 Go Top
  // --------------------------------------------------------------- //
  _goTop.on( 'click', function(){
    _html.stop(true,false).animate({scrollTop: 0}, 800, function(){
      _goCenter.trigger('focus');
    });
  });
  // --------------------------------------------------------------- //















  // 可收合區
  // --------------------------------------------------------------- //
  let _drawer = $('.drawer');
  _drawer.each(function () {
    let _this = $(this);
    let _handle = _this.find('button.handle');
    let _tray = _this.find('.tray');
    const speed = 500;

    if ( _tray.is(':hidden')) {
      _handle.removeClass('closeIt').attr('aria-expanded', false);
    } else {
      _handle.addClass('closeIt').attr('aria-expanded', true);
    }

    _handle.on('click', function () {
      if (_tray.is(':hidden')) {
        _tray.stop(true, false).slideDown(speed, function(){
          _handle.addClass('closeIt').attr('aria-expanded', true);
        });
      } else {
        _tray.stop(true, false).slideUp(speed, function(){
          _handle.removeClass('closeIt').attr('aria-expanded', false);
        })
      }
    })
  })
  // --------------------------------------------------------------- //



  // 燈箱 
  // --------------------------------------------------------------- //
  const _lightbox = $('.lightbox');
  const _hideLightbox = _lightbox.find('.closeThis');
  const _showLightbox = $('.show-lightbox');
  _lightbox.before('<div class="coverAll"></div>'); // 燈箱遮罩
  const _coverAll = _lightbox.prev('.coverAll');
  const speedLbx = 300;
  let _lbxKeptEl;
  let _lbx_fa_last;


  // 開燈箱
  _showLightbox.on('click', function(){
    _lbxKeptEl = $(this);
    _lightbox.stop(true, false).fadeIn(speedLbx, function(){
      _lbx_fa_last = _lightbox.find('a, button, input').last();
      console.log(_lbx_fa_last.text());
      _lbx_fa_last.on('keydown', function(e){
        if ( e.code == 'Tab' && !e.shiftKey ) {
          e.preventDefault();
          _hideLightbox.trigger('focus');
        }
      })
    });
    _hideLightbox.focus();
    _coverAll.stop(true, false).fadeIn(speedLbx);
    _body.addClass('noScroll');
    

  })  

  // 點擊 closeThis 關燈箱
  _hideLightbox.on('click', function(){
    _lightbox.stop(true, false).fadeOut( speedLbx );
    _lbxKeptEl.trigger('focus');
    _coverAll.fadeOut(speedLbx);
    _body.removeClass('noScroll');
  })

  // 點擊遮罩關燈箱
  _coverAll.on('click', function(){
    _hideLightbox.trigger('click');
  })

  // 按 [esc 鍵] 關燈箱
  _lightbox.on('keydown', function(e){
    if ( e.keyCode == 27) {
      _hideLightbox.trigger('click');
    }
  })



  // 改變瀏覽器寬度 window resize 
  // --------------------------------------------------------------- //
  var winResizeTimer;
  _window.resize(function () {
    clearTimeout(winResizeTimer);
    winResizeTimer = setTimeout( function () {
  
      wwNew = _window.width();

      // 由小螢幕到寬螢幕
      if( ww < wwNormal && wwNew >= wwNormal ) {
        if (_sidebar.hasClass('reveal')) {
          _sidebar.removeClass('reveal').removeAttr('style');
          _sidebarMask.hide().removeAttr('style');
          _sidebarCtrl.removeClass('closeIt');
          
          _body.removeClass('noScroll');
        }
        
        _body.removeAttr('style');

        hh = _siteHeader.outerHeight();
        // fixHeadThreshold =  hh - _menu.innerHeight();
        _window.trigger('scroll');
      }
  
      // 由寬螢幕到小螢幕
      if( ww >= wwNormal && wwNew < wwNormal ){
        hh = _siteHeader.outerHeight();
        // fixHeadThreshold = 0;
        _body.removeAttr('style');
      }

      ww = wwNew;
    }, 200);
  });
  // window resize  end -------------------------------------------- //

  
})