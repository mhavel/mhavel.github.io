// this file is extremely inspired by:
// http://semantic-ui.com/javascript/docs.js




// namespace
window.mhavel = {
  handler: {}
};

// ready event
mhavel.ready = function() {

    // selector cache
    var
        mobileWidth         = 700,      // px
        mobileHeight        = 700,      // px
        tabletWidth         = 991,      // px
        $document           = $(document),
        $window             = $(window),
        $follwingBar        = $('.following.bar'),
        $topblank           = $('.topblank'),
        $topmenu            = $('#top-menu'),
        $topbtns            = $('#top-links'),
        $homeCards          = $('.cards'),
        $sidebtn            = $('#sidebar-button'),
        $sidemenu           = $('#sidebar-menu'),

        requestAnimationFrame = window.requestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.msRequestAnimationFrame
            || function(callback) { setTimeout(callback, 0); }
    ;

    // main sidebar
    $sidemenu
        .sidebar({
            dimPage          : true,
            transition       : 'overlay',
            mobileTransition : 'uncover'
        });
    $sidemenu
        .sidebar('attach events', '#sidebar-button>.item');

    var curH = $window.height(),
        curW = $window.width();
    if(curH > mobileHeight) {
        $('body')
            .visibility({
                offset         : -10,
                observeChanges : false,
                once           : false,
                continuous     : false,
                onTopPassed: function() {
                    requestAnimationFrame(function() {
                        $follwingBar
                            .addClass('fixed')
                        ;
                    });
                },
                onTopPassedReverse: function() {
                    requestAnimationFrame(function() {
                        $follwingBar
                            .removeClass('fixed')
                        ;
                    });
                }
            })
        ;
        $follwingBar.removeClass('light fixed');
        $topblank.removeClass('light');
    }
    else {
        $follwingBar.addClass('light fixed');
        $topblank.addClass('light');
    }
    if (curW > mobileWidth) {
        $topbtns.show();
        if ( curW <= tabletWidth ) {
            $homeCards.removeClass('three').addClass('two');
        }
    }
    else {
        $sidebtn.show()
    }

    // on resize of the page
    $(window).resize(function() {
        var vpw = $(window).width();
        if ( vpw <= mobileWidth){
            $topbtns.hide();
            $sidebtn.show();
        }
        else {
            $topbtns.show();
            $sidebtn.hide();
        }
        if ( vpw <= tabletWidth ){
            $homeCards.removeClass('three').addClass('two');
        }
        else {
            $homeCards.removeClass('two').addClass('three');
        }
    });

};

$(document)
    .ready(mhavel.ready);
