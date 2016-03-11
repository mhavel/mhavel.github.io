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
        tabletWidth         = 991,      // px
        $document           = $(document),
        $topmenu            = $('#top-menu'),
        $topbtns            = $('#top-links'),
        $homeCards          = $('.cards'),
        $sidebtn            = $('#sidebar-button'),
        $sidemenu           = $('#sidebar-menu'),

        requestAnimationFrame = window.requestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.msRequestAnimationFrame
            || function(callback) { setTimeout(callback, 0); },

        // alias
        handler
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

    var curW = $(window).width();
    if(curW > mobileWidth) {
        $('body')
            .visibility({
                offset         : -30,
                observeChanges : false,
                once           : false,
                continuous     : false,
                onTopPassed: function() {
                    requestAnimationFrame(function() {
                        $topmenu
                            .addClass('light fixed')
                            .transition('scale in', 750)
                        ;
                    });
                },
                onTopPassedReverse: function() {
                    requestAnimationFrame(function() {
                        $topmenu
                            .removeClass('light fixed')
                            .transition('scale out', 150)
                            .transition('fade down', 400)
                        ;
                    });
                }
            })
        ;
        $topbtns.show();
        //$sidebtn.hide();
        if ( curW <= tabletWidth ) {
            $homeCards.removeClass('three').addClass('two');
        }
    }
    else {
        //$topbtns.hide();
        $sidebtn.show();
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
