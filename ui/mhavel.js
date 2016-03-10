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
        $document           = $(document),
        $topmenu            = $('#top-menu'),
        $topbtns            = $('#top-links'),
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

    if($(window).width() > mobileWidth) {
        $('body')
            .visibility({
                offset         : -10,
                observeChanges : false,
                once           : false,
                continuous     : false,
                onTopPassed: function() {
                    requestAnimationFrame(function() {
                        $topmenu
                            .addClass('light fixed')
                            .transition('scale in', 750)
                            //.find('.menu')
                            //.removeClass('inverted')
                        ;
                        //$('.following .additional.item')
                        //    .transition('scale in', 750)
                        //;
                    });
                },
                onTopPassedReverse: function() {
                    requestAnimationFrame(function() {
                        $topmenu
                            .removeClass('light fixed')
                            .transition('scale out', 150)
                            .transition('fade down', 400)
                            //.find('.menu')
                            //.addClass('inverted')
                            //.find('.additional.item')
                            //.transition('hide')
                        ;
                    });
                }
            })
        ;
        $topbtns.show();
        //$sidebtn.hide();
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
    });

};

$(document)
    .ready(mhavel.ready);
