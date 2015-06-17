(function ($) {
  $.shoot = function(element, options) {
    var defaults = {
      vertex_top: 20, // 默认顶点高度
      speed: 1.2,
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

      var settings = this.settings,
        speed = settings.speed,
        vertex_top = settings.vertex_top,
        start = settings.start,
        end = settings.end;

      $element.appendTo('body').css({
        'transition': 'all',
        'position': 'absolute'  
      });

      var distance = Math.sqrt(Math.pow(start.top - end.top, 2) + Math.pow(start.left - end.left, 2)),
        steps = Math.ceil(Math.min(Math.max(Math.log(distance) / 0.05 - 75, 30), 100) / settings.speed),
        ratio = start.top == vertex_top ? 0 : -Math.sqrt((end.top - vertex_top) / (start.top - vertex_top)),
        vertex_left = (ratio * start.left - end.left) / (ratio - 1),
        curvature = end.left == vertex_left ? 0 : (end.top - vertex_top) / Math.pow(end.left - vertex_left, 2);

        $.extend(true, settings, {
          count: -1,
          steps: steps,
          vertex_left: vertex_left,
          vertex_top: vertex_top,
          curvature: curvature
        });
    };

    self.move = function() {
      var settings = this.settings,
        start = settings.start,
        count = settings.count,
        steps = settings.steps,
        end = settings.end;

      var left = start.left + (end.left - start.left) * count / steps,
        top = settings.curvature == 0 ? start.top + (end.top - start.top) * count / steps : settings.curvature * Math.pow(left - settings.vertex_left, 2) + settings.vertex_top,
        deg = 720 * count / steps;

      settings.count++;

      $element.css({
        'transform': 'translate(' + left + 'px, ' + top + 'px) rotate(' + deg + 'deg)'
      });

      var time = window.requestAnimationFrame($.proxy(this.move, this));
      if (count == steps) {
        window.cancelAnimationFrame(time);
        settings.onEnd.apply(this);
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