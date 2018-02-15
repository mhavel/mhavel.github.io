// Some javascript for the Bibliography
// > included only if the page has the attribute "biblio-js" set to true

// The Scholar plugin does create the DOM / CSS we need for Semantic UI,
// so its re-arranged below...

var biblioInteractive = function(){

  // Bibliography: classes
  $('ol.bibliography')
    .addClass('ui list');
  $('ol.bibliography>li')
    .addClass('item');
  $('h2.bibliography')
    .addClass('header')
    .each(function(index, obj){
      $(this).attr({id: 'h2-'+index.toString()});
    });
  $('h3.bibliography')
    .addClass('header')
    .each(function(index, obj){
      var h2id = $(this).prevAll('h2.bibliography').attr('id');
      $(this).attr({'data-target': h2id});
    });

  // DOM manupilations
  // move each h2 (header) into its new container: item > content >
  $('h2.bibliography')
    .before('<div class="item"><div class="content"></div></div>');
  $('h2.bibliography').each(function(index, obj){
    var c = $(this).prev('.item').children('.content');
    $(this).detach().appendTo(c);
    c.append('<div class="ui items"></div>');
  });

  // move each h3 (header) and ol into its h2 container
  $('h3.bibliography').each(function(index, obj){
    var ol = $(this).next('ol').detach();
    var target = $("#"+$(this).data('target')).next(".ui.items");
    target.append('<div class="item"><div class="content"></div></div>');
    var c = target.children('.item').last().children('.content');
    $(this).detach().appendTo(c);
    ol.appendTo(c);
  });

  // highlighted code moves in a div (instead of a figure)
  $('figure.highlight').each(function(index, obj){
    $(this).before('<div class="highlight"></div>');
    var t = $(this).prev();
    $(this).children('pre').detach().appendTo(t);
    $(this).remove();
  });

  // per entry details button state
  var $entryButtons = $('.absbib-btn'),
      $abs = $('.abstract'),
      $bib = $('.bibtex'),
      $details = $('.absbib-details'),
      btnStates = {abs: 0, bib:0},
      entries = {
        activate: function($btn){
          $btn.children('i.icon').removeClass('unhide').addClass('hide');
          $btn.addClass('active');
        },
        deactivate: function($btn){
          $btn.children('i.icon').removeClass('hide').addClass('unhide');
          $btn.removeClass('active');
        },
        activateAll: function(){
          $entryButtons.children('i.icon').removeClass('unhide').addClass('hide');
          $entryButtons.addClass('active');
        },
        deactivateAll: function(){
          $entryButtons.children('i.icon').removeClass('hide').addClass('unhide');
          $entryButtons.removeClass('active');
        }
      };

  $abs.hide();
  $bib.hide();

  // Abstract + BibTex toggle, for the whole page
  $('#tog-abs').click(function(){
    if ( btnStates.abs == 0 ) {
      // show all abstracts ; make sure the details containers are shown
      $details.show();
      $abs.show();
      btnStates.abs = 1;
      $(this).removeClass('blue').addClass('basic red');

      // change the button state of each entry
      entries.activateAll();
    }
    else {
      // hide all abstracts ; hide the details containers if necessary
      $abs.hide();
      btnStates.abs = 0;
      $(this).removeClass('basic red').addClass('blue');

      // get the details containers for which nothing is shown
      var $p = $abs.siblings('.bibtex:hidden').parent();
      if ( $p.length > 0 ){
        // hide them
        $p.hide();
        // change their entry's button state
        var $eb = $p.prev().children('.absbib-btn');
        entries.deactivate($eb);
      }
    }
  });

  $('#tog-bib').click(function(){
    if ( btnStates.bib == 0 ) {
      // show all BibTeX ; make sure the details containers are shown
      $details.show();
      $bib.show();
      btnStates.bib = 1;
      $(this).removeClass('green').addClass('basic yellow');

      // change the button state of each entry
      entries.activateAll();
    }
    else {
      // hide all BibTeX ; hide the details containers if necessary
      $bib.hide();
      btnStates.bib = 0;
      $(this).removeClass('basic yellow').addClass('green');

      // get the details containers for which nothing is shown
      var $p = $bib.siblings('.abstract:hidden').parent();
      if ( $p.length ){
        // hide them
        $p.hide();
        // change their entry's button state
        var $eb = $p.prev().children('.absbib-btn');
        entries.deactivate($eb);
      }
    }
  });

  // Abstract + BibTex toggle, per entry
  $entryButtons.click(function(){
    var $this = $(this);
    var t = $("#"+$this.data('target'));
    if ( $this.hasClass('active') ) {
      entries.deactivate($this);
      t.hide().children().hide();
    }
    else {
      entries.activate($this);
      t.show().children().show();
    }
  });
};
$(document).ready(biblioInteractive);
