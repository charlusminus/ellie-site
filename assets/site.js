/* Ellie website: each moment of the page appears once, slowly, as it comes into view.
   The class "js" is set in the head only when the visitor has not asked for reduced motion;
   without it (or without this script) everything is simply visible. */
(function () {
  "use strict";
  var nodes = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var show = function (n) { n.classList.add("in"); };
  if (!document.documentElement.classList.contains("js") || !("IntersectionObserver" in window)) { nodes.forEach(show); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  nodes.forEach(function (n) { io.observe(n); });
})();
