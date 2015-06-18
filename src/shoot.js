(function ($) {
  $.shoot = function(element, options) {
    var defaults = {
      vertex_height: 120, // 默认抛物线高度
      duration: 0.5,
      start: {}, // top, left
      end: {},
      onEnd: $.noop
    };

    var self = this,
      $element = $(element);

    self.init = function(options) {
      this.setOptions(options);
      this.move();
    };

    self.setOptions = function(options) {
      this.settings = $.extend(true, {}, defaults, options);
    };

    self.move = function() {
      var settings = this.settings,
        duration = settings.duration,
        vertex_height = settings.vertex_height,
        start = settings.start,
        end = settings.end;

      $element.appendTo('body').css({
        'position': 'absolute',
        'top': start.top,
        'left': start.left   
      });
      window.requestAnimationFrame(moveUp);
      function moveUp() {  
        $element.css({
          'transition': duration / 2 + 's left linear, ' + duration / 2 + 's top ease-out, ' + duration / 2 + 's transform ease',
          'top': start.top - vertex_height,
          'left': Math.abs(end.left - start.left) / 2,
          'transform': 'rotate(360deg)'
        }).on('transitionend', moveDown);
      }

      function moveDown() {
        if(animateNotComplete()){
          return;
        }
        $element.css({
          'transition': duration / 2 + 's left linear, ' + duration / 2 + 's top ease-in, ' + duration / 2 + 's transform ease',
          'top': end.top,
          'left': end.left,
          'transform': 'rotate(720deg)'
        }).on('transitionend', moveEnd);
      }
      function moveEnd() {
        if(animateNotComplete()){
          return;
        }
        settings.onEnd.apply(self);
      }
      var _count = 0;
      function animateNotComplete() {
        //每个属性的变动都会触发transitionend
        _count++;
        if(_count < 3) {
          return true;
        }
        _count = 0;
        return false;
      }
    };

    self.destroy = function() {
      $element.remove();
    };

    self.init(options);
  };

  $.fn.shoot = function(options) {
    return this.each(function() {
      if (undefined == $(this).data('shoot')) {
        $(this).data('shoot', new $.shoot(this, options));
      }
    });
  };
})(jQuery);