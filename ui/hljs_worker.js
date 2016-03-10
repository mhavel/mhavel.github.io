onmessage = function(event) {
  importScripts('//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.2.0/highlight.min.js');
  var result = self.hljs.highlightAuto(event.data);
  postMessage(result.value);
}
