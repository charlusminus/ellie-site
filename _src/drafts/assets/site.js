/* Ellie website: theme switch, menu on small screens, the section that runs in the other theme,
   the transport board (fictional data) and the contact form (not connected yet). */
(function () {
  "use strict";
  var root = document.documentElement;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  // ------------------------------------------------ theme: dark by default, light on request, remembered in this browser
  function theme() { return root.getAttribute("data-theme") === "light" ? "light" : "dark"; }
  function sync() {
    var t = theme();
    $$(".band.invert").forEach(function (b) { b.setAttribute("data-theme", t === "dark" ? "light" : "dark"); });
    $$(".themebtn").forEach(function (b) { b.textContent = t === "dark" ? "Light theme" : "Dark theme"; });
  }
  $$(".themebtn").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = theme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", t);
      try { localStorage.setItem("ellie-site-theme", t); } catch (e) {}
      sync();
    });
  });
  sync();

  // ------------------------------------------------ menu on small screens
  var mb = $(".menubtn"), nav = $("#nav");
  if (mb && nav) {
    mb.addEventListener("click", function () {
      var open = !nav.classList.contains("open");
      nav.classList.toggle("open", open);
      mb.setAttribute("aria-expanded", String(open));
      mb.textContent = open ? "Close" : "Menu";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { nav.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); mb.textContent = "Menu"; mb.focus(); }
    });
  }

  // ------------------------------------------------ the transport board
  var gantt = $("#gantt");
  if (gantt) {
    var H0 = 14, H1 = 23, SPAN = (H1 - H0) * 60;
    var toMin = function (t) { var p = t.split(":"); return (+p[0]) * 60 + (+p[1]) - H0 * 60; };
    var fmt = function (m) { m += H0 * 60; return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };
    var pct = function (m) { return (m / SPAN * 100).toFixed(3) + "%"; };
    var CARS = [
      { name: "S-Class 1", drv: "Somchai", t: [["14:50", "16:10", "JP-0005", "vip"], ["18:30", "19:20", "JP-0005", "vip"]] },
      { name: "S-Class 2", drv: "Anan", t: [["15:25", "16:45", "SG-0012", "vip"], ["19:10", "20:00", "SG-0012", "vip"]] },
      { name: "Alphard 1", drv: "Niran", t: [["14:00", "15:30", "TW-0007 +1"], ["16:30", "17:40", "AE-0002"], ["21:30", "22:50", "KR-0003", "vip"]] },
      { name: "Alphard 2", drv: "Krit", t: [["16:00", "17:30", "MY-0019"], ["18:50", "19:40", "AE-0002"]], off: [["20:30", "23:00"]] },
      { name: "Sprinter", drv: "Chai", t: [["19:05", "20:05", "Group, 9"]] }
    ];
    var NOCAR = [["19:10", "20:30", "HK-0031"]];
    var at = toMin("17:00");
    var busy = function (car, m) {
      var inT = car.t.some(function (x) { return m >= toMin(x[0]) && m < toMin(x[1]); });
      var inOff = (car.off || []).some(function (x) { return m >= toMin(x[0]) && m < toMin(x[1]); });
      return inT ? "busy" : inOff ? "off" : "free";
    };
    var blk = function (x, cls) {
      var a = toMin(x[0]), b = toMin(x[1]);
      return '<span class="g-blk ' + (cls || x[3] || "") + '" style="left:' + pct(a) + ";width:" + pct(b - a) + '" title="' + x[0] + " to " + x[1] + '">' + x[2] + "</span>";
    };
    var render = function () {
      var hours = "";
      for (var h = H0; h < H1; h++) hours += '<span style="left:' + ((h - H0) * 60 / SPAN * 100).toFixed(3) + '%">' + String(h).padStart(2, "0") + ":00</span>";
      var html = '<div class="g-row" aria-hidden="true"><span></span><div class="g-hours">' + hours + "</div></div>";
      var free = [];
      CARS.forEach(function (c) {
        var s = busy(c, at);
        if (s === "free") free.push(c.name);
        var lab = s === "free" ? "free" : s === "off" ? "off duty" : "on a transfer";
        html += '<div class="g-row"><span class="g-lab' + (s === "free" ? " is-free" : "") + '">' + c.name + "<small>" + c.drv + ", " + lab + "</small></span>" +
          '<div class="g-track">' + (c.off || []).map(function (o) { var a = toMin(o[0]), b = toMin(o[1]); return '<span class="g-off" style="left:' + pct(a) + ";width:" + pct(b - a) + '"><em>off duty from ' + o[0] + "</em></span>"; }).join("") +
          c.t.map(function (x) { return blk(x); }).join("") + '<span class="g-now" style="left:' + pct(at) + '"></span></div></div>';
      });
      html += '<div class="g-row nocar"><span class="g-lab">No car<small>1 transfer to assign</small></span><div class="g-track">' +
        NOCAR.map(function (x) { return blk(x, "none") + '<span class="g-note" style="left:calc(' + pct(toMin(x[1])) + ' + .6rem)">flagged on the day\'s board</span>'; }).join("") +
        '<span class="g-now" style="left:' + pct(at) + '"></span></div></div>';
      gantt.innerHTML = html;
      $("#tVal").textContent = fmt(at);
      var list = free.length === 0 ? "no car is free" : free.length === 1 ? "<b>" + free[0] + "</b> is free" :
        "<b>" + free.slice(0, -1).join("</b>, <b>") + "</b> and <b>" + free[free.length - 1] + "</b> are free";
      $("#tRes").innerHTML = list.charAt(0).toUpperCase() + list.slice(1) + ".";
      // On a narrow screen the board scrolls sideways: keep the chosen time in view.
      var sc = gantt.parentNode, line = gantt.querySelector(".g-track .g-now");
      if (sc.scrollWidth > sc.clientWidth && line) {
        var x = line.getBoundingClientRect().left - sc.getBoundingClientRect().left + sc.scrollLeft;
        sc.scrollLeft = Math.max(0, x - sc.clientWidth / 2);
      }
    };
    $("#tMinus").addEventListener("click", function () { at = Math.max(0, at - 30); render(); });
    $("#tPlus").addEventListener("click", function () { at = Math.min(SPAN - 30, at + 30); render(); });
    render();
  }

  // ------------------------------------------------ examples that do nothing, and the form
  $$("[data-noop]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); }); });
  var form = $("#form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = form.checkValidity();
      $$(".sent", form).forEach(function (n) { n.remove(); });
      var p = document.createElement("p");
      p.className = ok ? "sent" : "sent alert";
      p.setAttribute("role", "status");
      p.textContent = ok ? "Thank you. This form is not connected yet: nothing was sent." :
        "Please add your name, your maison or agency, and a work email.";
      form.appendChild(p);
    });
  }
})();
