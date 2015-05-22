/*;
	jQuery tinyDraggable v1.0.4
    Copyright (c) 2015 Daniel Eissing / chunknsbits
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/chunksnbits/jQuery-tinyDraggable/tree/feature/contain
    Forked from: https://github.com/pixabay/jQuery-tinyDraggable
	License: http://www.opensource.org/licenses/mit-license.php
*/

(function($){
  $.fn.tinyDraggable = function(options){
    var settings = $.extend({ handle: 0, exclude: 0, contain: 0 }, options);
    return this.each(function(){
      var x, y, dx, dy, el = $(this), doc = $(document), win = $(window), handle = settings.handle ? $(settings.handle, el) : el;

      handle.on({
        mousedown: function(e){
          if (settings.exclude && ~$.inArray(e.target, $(settings.exclude, el))) return;
          if (settings.callback && settings.callback('start', e.pageX, e.pageY) === false) return;

          e.preventDefault();
          var os = el.offset(), dx = e.pageX-os.left, dy = e.pageY-os.top;

          var bounds = (function () {
            if (settings.contain) {
              el.css({ position: 'fixed' });

              return {
                x: win.width() - el.width(),
                y: win.height() - el.height()
              };
            }

            return null;
          })();

          function onDrag(e){
            x = settings.contain ? Math.max(0, Math.min(bounds.x, e.clientX-dx)) : e.pageX-dx;
            y = settings.contain ? Math.max(0, Math.min(bounds.y, e.clientY-dy)) : e.pageY-dy;

            if (!settings.callback || settings.callback('drag', x, y) !== false) {
              if (settings.contain) {
                return el.css({top: y, left: x});
              }
              return el.offset({ top: y, left: x });
            }
          }
          function onStop(){
            if (settings.callback && settings.callback('stop', x, y) === false) return;
            doc.off('mousemove.drag', onDrag).off('mouseup', onStop);
          }

          doc.on('mousemove.drag', onDrag).on('mouseup', onStop);
        }
      });
    });
  };
}(jQuery));
