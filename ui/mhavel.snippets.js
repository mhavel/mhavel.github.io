// this file is extremely inspired by:
// http://semantic-ui.com/javascript/docs.js


// namespace
window.mhavel = {
  handler: {}
};

// highlight code using highlight.js
// include this in the main html:
// <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.2.0/highlight.min.js"></script>
addEventListener('load', function() {
  var code = document.querySelector('code');
  var worker = new Worker("{{ "/ui/hljs_worker.js" | prepend: site.baseurl }}");
  worker.onmessage = function(event) { code.innerHTML = event.data; }
  worker.postMessage(code.textContent);
});


// ready event
mhavel.ready = function() {

  // selector cache
  var
    $document            = $(document),
    $sortableTables      = $('.sortable.table'),
    $sticky              = $('.ui.sticky'),
    $tocSticky           = $('.toc .ui.sticky'),

    $ui                  = $('.ui').not('.hover, .down'),
    $menu                = $('#toc'),
    $hideMenu            = $('#toc .hide.item'),
    $search              = $('#search'),

    $fullHeightContainer = $('.pusher > .full.height'),
    $container           = $('.main.container'),
    $allHeaders          = $('.main.container > h2, .main.container > .tab > h2'),
    $sectionHeaders      = $container.children('h2'),
    $followMenu          = $container.find('.following.menu'),
    $footer              = $('.page > .footer'),

    $sidebarButton       = $('.fixed.launch.button'),
    $code                = $('div.code').not('.existing'),
    $existingCode        = $('.existing.code'),

    metadata,

    requestAnimationFrame = window.requestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame
      || function(callback) { setTimeout(callback, 0); },

    // alias
    handler
  ;


  // event handlers
  handler = {

    activate: {
      previous: function() {
        var
          $menuItems  = $followMenu.children('.item'),
          $section    = $menuItems.filter('.active'),
          index       = $menuItems.index($section)
        ;
        if($section.prev().size() > 0) {
          $section
            .removeClass('active')
            .prev('.item')
            .addClass('active')
          ;
          $followMenu
            .accordion('open', index - 1)
          ;
        }
      },
      accordion: function() {
        var
          $section       = $(this),
          index          = $sectionHeaders.index($section),
          $followSection = $followMenu.children('.item'),
          $activeSection = $followSection.eq(index)
        ;
      },
      section: function() {
        var
          $section       = $(this),
          index          = $sectionHeaders.index($section),
          $followSection = $followMenu.children('.item'),
          $activeSection = $followSection.eq(index),
          isActive       = $activeSection.hasClass('active')
        ;
        if(!isActive) {
          $followSection.filter('.active')
            .removeClass('active')
          ;
          $activeSection
            .addClass('active')
          ;
          $followMenu
            .accordion('open', index)
          ;
        }
      },
    },

    getSafeName: function(text) {
      return text.replace(/\s+/g, '-').replace(/[^-,'A-Za-z0-9]+/g, '').toLowerCase();
    },

    getText: function($element) {
      $element = ($element.find('a').not('.label, .anchor').length > 0)
        ? $element.find('a')
        : $element
      ;
      var
        $text = $element.contents().filter(function(){
          return this.nodeType == 3;
        })
      ;
      return ($text.length > 0)
        ? $text[0].nodeValue.trim()
        : $element.find('a').text().trim()
      ;
    },

    refreshSticky: function() {
      $sectionHeaders.visibility('refresh');
      $sectionExample.visibility('refresh');
      $('.ui.sticky').sticky('refresh');
      $footer.visibility('refresh');
      $visibilityExample.visibility('refresh');
    },
  };

  mhavel.handler = handler;

  // main sidebar
  $menu
    .sidebar({
      dimPage          : true,
      transition       : 'overlay',
      mobileTransition : 'uncover'
    })
  ;

};
