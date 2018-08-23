$.fn.isOnScreen = function(shift) {
    if (!shift) {
        shift = 0;
    }
    var viewport = {};
    viewport.top = $(window).scrollTop();
    viewport.bottom = viewport.top + $(window).height();
    var bounds = {};
    bounds.top = this.offset().top + shift;
    bounds.bottom = bounds.top + this.outerHeight() - shift;
    return ((bounds.top <= viewport.bottom) && (bounds.bottom >= viewport.top));
};

var _bxInnit = function(elem, opt) {

    if (!$(elem).length) return false;

    var defaultOptions = {
        view: 'all'
    }
    var currentOpt = $.extend(defaultOptions, opt);
    var init = {
        breakPoint: 992,
        sliderActive: false,
        initBreakpoint: null,
        resizeBreakpointMore: null,
        resizeBreakpointLess: null,
        windowWidht: window.innerWidth
    }


    var flag = false;

    var slider;


    var sliderClone = $(elem).clone();


    // Объект с параметрами для слайдера
    var options = opt;

    // Создаем слайдер
    function createSlider() {
        slider = $(elem).bxSlider(options);
        return true;
    }

    if (flag) {
        createSlider();
        init.sliderActive = true;
    }


    function createBreakpoints() {
        switch (currentOpt.view) {
            case 'mobile':
                init.initBreakpoint = init.windowWidht < init.breakPoint;
                init.resizeBreakpointMore = init.windowWidht >= init.breakPoint;
                init.resizeBreakpointLess = init.windowWidht < init.breakPoint;
                break;

            case 'desktop':
                init.initBreakpoint = init.windowWidht >= init.breakPoint;
                init.resizeBreakpointMore = init.windowWidht < init.breakPoint;
                init.resizeBreakpointLess = init.windowWidht >= init.breakPoint;
                init.resizeBreakpointLess;
                break;

            case 'all':
                init.initBreakpoint = true;
                init.resizeBreakpointMore = false;
                init.resizeBreakpointLess = false;
                break;
        }
    }

    createBreakpoints();


    // Загрузка страницы
    if (init.initBreakpoint) {
        createSlider();
        init.sliderActive = true;
    }
    // Отслеживаем события при ресайзе

    $(window).resize(function() {
        // Если окно больше или равено breakPoint
        // Вырубаем слайдер и ставим ФЛАГ в false
        // Вставляем начальный вариант html разметки (без лишнего кода от слайдера)
        init.windowWidht = window.innerWidth;

        createBreakpoints();

        if (init.resizeBreakpointMore) {
            if (init.sliderActive) {
                slider.destroySlider();
                init.sliderActive = false;
                slider.replaceWith(sliderClone.clone());
            }
        }

        // Если окно меньше breakPoint
        // Вырубаем слайдер и ставим ФЛАГ в true
        if (init.resizeBreakpointLess) {
            if (!init.sliderActive) {
                createSlider();
                init.sliderActive = true;
            }
        }
    });

    var a, b;
    a = 1;
    b = 0;

    $(window).on('scroll', function() {
        if (init.sliderActive == true) {
            if (slider.isOnScreen()) {
                b = 1;
            } else {
                b = 0;
            }

            if (a == b) {
                slider.startAuto();
            } else {
                slider.stopAuto();
            }
        }

    });

    return slider;
}

var slider = function(slider, pager, speed) {

    var _slider = _bxInnit(slider, {
        controls: false,
        pager: true,
        auto: true,
        pause: 6000,
        speed: speed,
        infiniteLoop: true,
        slideMargin: 3,
        infiniteLoop: false,
        pagerCustom: pager,
        touchEnabled: false,
        onSliderLoad: function(currentIndex) {
            setTimeout(function() {
                changeSlidePart(currentIndex, 500)
            }, 3000)
        },
        onSlideAfter: function(slideElement, oldIndex, newIndex) {
            setTimeout(function() {
                changeSlidePart(newIndex, 500)
                setTimeout(function() {
                    var slideCount = _slider.getSlideCount();
                    if (newIndex == +slideCount - 1) {
                        $(pager).addClass('ended')
                    }
                }, 3000)
            }, +3000 - speed)
        }
    });

    var changeSlidePart = function(index, duration) {
        $('.b-slider__slide').eq(index).find('.b-slider__part--1').fadeOut(duration)
        $('.b-slider__slide').eq(index).find('.b-slider__part--2').fadeIn(duration)
        setTimeout(function(){
        	$('.b-pager__item').eq(index).find('.b-pager__handler').addClass('showed')
        }, 3000)
    }

}

var scrollDetection = function() {

    $('.js-scroll-detection').each(function() {
        var that = this;
        var shift = $(that).data('scroll-shift') || 20;

        if ($(that).isOnScreen(shift)) {
            $(that).addClass('js-isonscreen');
        }
    });

}

$(function() {

    slider('.b-slider__inner', '.b-pager', 300);

    var parallax = new Rellax('.js-parralax', {
        center: true
    });

    scrollDetection();

    $(window).on('scroll', function() {
        scrollDetection();
    });

     _bxInnit('.b-composition__list', {
        view: 'mobile',
        adaptiveHeight: true,
        swipeThreshold: 40,
        controls: false,
        pager: true,
        auto: true,
        pause: 10000,
        autoHover: true,
        infiniteLoop: true,
        slideMargin: 7
    });

})