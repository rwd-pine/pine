(function($, Modernizr){

  // NAVBAR: Menu handler
  // Adds hover funcionality for desktops and removes it for touch devices
  // -------------------------------
  var hoverable = function() {
    if(!Modernizr.touch && Modernizr.mq('(min-width: 992px)')) {
      var elements = $('[data-hover="dropdown"]');
      elements.parent().addClass('hoverable');
      elements.off('click.enable').on('click.disable', function(e){ return false; })
      elements.trigger('click.disable');
    }
    else {
      var elements = $('[data-hover="dropdown"]');
      elements.parent().removeClass('hoverable');
      elements.off('click.disable').on('click.enable', function(e){ return true; })
      elements.trigger('click.enable');
    }
  }

  // Init
  $(window).resize(hoverable);
  hoverable();


  // NAVBAR: Search form
  // -------------------------------
  var navbarFormInput = $('.navbar-form input'),
      navbarTrigger = navbarFormInput.siblings('.form-indicator');

  navbarTrigger.on('click', function(){
    navbarFormInput.show();
  });

	navbarFormInput.on('keyup', function () {
    var value = $(this).val();

    if(value.length == 0) {
      // Yes, this ugly method is necessary to keep entity unescaped
      navbarTrigger.attr('data-icon', $('<div/>').html('&#xe009;').text());
    }
    else {
      navbarTrigger.attr('data-icon', $('<div/>').html('&#xe00a;').text());
    }
  });

  navbarFormInput.on('focus', function () {
    $(this).siblings('.form-indicator').css('color', '#666');
  });

  navbarFormInput.on('blur', function () {
    $(this).siblings('.form-indicator').removeAttr('style');
  });

  $('.form-indicator').on('click', function(){
    var formInput = $(this).siblings('input');
    formInput.val('');
    formInput.focus();
    $(this).attr('data-icon', $('<div/>').html('&#xe009;').text());
  });

  // CAROUSEL: extension
  // Adds slides counter and next slide button (with title)
  // -------------------------------
  $('.carousel').each(function(){
    var _this = $(this),
        slides = _this.find('.item');
        secondSlideHeading = _this.find('.item').eq(1).find('h3').text();

    // Init next button
    _this.find('.carousel-next span').text(secondSlideHeading);

    // Init counter
    _this.find('.slides-count').text(slides.length);
    _this.find('.current-slide').text(_this.find('.active').index() + 1);

    // Handle sliding
    _this.on('slide.bs.carousel', function (e) {
      var nextItem = $(e.relatedTarget),
          nextItemHeading = '';

      _this.find('.current-slide').text(nextItem.index() + 1);

      // Handle next slide button
      if((nextItem.index() + 1) < slides.length) {
        nextItemHeading = _this.find('.item:eq('+(nextItem.index() + 1)+') h3').text();
      }
      else {
        nextItemHeading = _this.find('.item:eq(0) h3').text();
      }

      _this.find('.carousel-next span').text(nextItemHeading);

    })

  });

  // Main Search select
  // -------------------------------
  $('.search-field-btn .dropdown-menu a').on('click', function(){
    // set title
    $('.search-field-btn .title').text($(this).text());

    // set active item
    $(this).closest('ul').find('li').removeClass('active');
    $(this).parent().addClass('active');

    // set hidden value
    $('#search-main-category').val($(this).data('target'));
  });


  // Fitvids
  // Make all videos in the page responsive
  // -------------------------------

  // Target your .container, .wrapper, .post, etc.
  $(".l-body").fitVids();


  // FullCalendar Demo
  // TODO: remove for production
  // -------------------------------
  $(function(){

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,basicWeek,basicDay'
      },
      editable: true,

      eventClick: function(calEvent, jsEvent, view) {
          // change the border color just for fun
          $(this).css('border-color', 'red');
      },

      events: [
        {
          title: 'All Day Event',
          start: new Date(y, m, 1),
          backgroundColor: '#01a3b8'
        },
        {
          title: 'Long Event',
          start: new Date(y, m, d-5),
          end: new Date(y, m, d-2),
          backgroundColor: '#adcd3b'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: new Date(y, m, d-3, 16, 0),
          allDay: false,
          backgroundColor: '#30b562'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: new Date(y, m, d+4, 16, 0),
          allDay: false,
          backgroundColor: '#01a3b8'
        },
        {
          title: 'Meeting',
          start: new Date(y, m, d, 10, 30),
          allDay: false,
          backgroundColor: '#30b562'
        },
        {
          title: 'Lunch',
          start: new Date(y, m, d, 12, 0),
          end: new Date(y, m, d, 14, 0),
          allDay: false,
          backgroundColor: '#f36c2c'
        },
        {
          title: 'Birthday Party',
          start: new Date(y, m, d+1, 19, 0),
          end: new Date(y, m, d+1, 22, 30),
          allDay: false,
          backgroundColor: '#e1b41b'
        },
        {
          title: 'Click for Google',
          start: new Date(y, m, 28),
          end: new Date(y, m, 29),
          url: 'http://google.com/',
          backgroundColor: '#e1b41b'
        }
      ]
    });

  });

  // FILTERABLE tables
  // ----------------------------

  // New expression to handle case-insensitive search
  $.expr[":"].Contains = jQuery.expr.createPseudo(function(arg) {
      return function( elem ) {
          return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
      };
  });

  $('.input-filter').on('keyup', function(){
    var targetColumnIndex = $(this).parent().index() +1,
        table = $(this).closest('table');

    // Apply expression
    table.find('tbody td:nth-child(' + targetColumnIndex + '):Contains("' + $(this).val() + '")').parent().show();
    table.find('tbody td:nth-child(' + targetColumnIndex + '):not(:Contains("' + $(this).val() + '"))').parent().hide();

  });

  // FACET filtering
  // ----------------------------
  $('.js-facet').facetFilter();


})(jQuery, Modernizr);