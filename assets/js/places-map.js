/* Notes page: map of places I have studied and worked (from the CV).
   Drawn as a vector map (Natural Earth outlines via world-atlas, projected with d3-geo),
   so it needs no tile server or API key.

   To add a place, append to PLACES (oldest first; the dashed route follows that order).
   label: which side of the marker the name goes on ("left", "right", "above", "below"). */
(function () {
  var el = document.getElementById("places-map");
  if (!el || typeof d3 === "undefined" || typeof topojson === "undefined") return;

  var PLACES = [
    { name: "Hangzhou",   years: "1995–2013",    what: "Home", at: [120.166664, 30.250000], label: "above" },
    { name: "Toronto",    years: "2013–2017",    what: "B.Sc., University of Toronto Scarborough", at: [-79.1871, 43.7845], label: "above" },
    { name: "Ithaca",     years: "2017–2023",    what: "Ph.D., Cornell University", at: [-76.4735, 42.4534], label: "below" },
    { name: "Los Alamos", years: "2020–2022",    what: "CSES Graduate Fellow, Los Alamos National Laboratory", at: [-106.3031, 35.8800], label: "below" },
    { name: "Evanston",   years: "2023–2026",    what: "CIERA Postdoctoral Fellow, Northwestern University", at: [-87.6753, 42.0565], label: "left" },
    { name: "Cambridge",  years: "2026–present", what: "Postdoctoral Research Associate, DAMTP, University of Cambridge", at: [0.1019, 52.2097], label: "above" }
  ];

  var WORLD = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json";
  var WORLD_SRI = "sha384-yOCJ+8ShBm8UDqtAVtAvxTDDf4gXo5edxl/YG0FmVC5OTmqVLl7utuVGBDEeZWHf";

  var W = 1000, H = 520, PAD = 8;
  var NS = "http://www.w3.org/2000/svg";
  function node(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  fetch(WORLD, { integrity: WORLD_SRI })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(draw)
    .catch(function () { el.hidden = true; });   // the list below the map still says it all

  function draw(world) {
    var land = topojson.feature(world, world.objects.countries);
    var borders = topojson.mesh(world, world.objects.countries, function (a, b) { return a !== b; });

    // Whole world, centred on Greenwich; height trimmed to the projected globe.
    var sphere = { type: "Sphere" };
    var projection = d3.geoNaturalEarth1().fitWidth(W - 2 * PAD, sphere);
    var b = d3.geoPath(projection).bounds(sphere);
    H = Math.ceil(b[1][1] - b[0][1]) + 2 * PAD;
    projection.translate([projection.translate()[0] + PAD, projection.translate()[1] - b[0][1] + PAD]);
    var path = d3.geoPath(projection);

    var svg = node("svg", { viewBox: "0 0 " + W + " " + H, role: "img",
                            "aria-label": "Map of places I have studied and worked" });
    node("path", { "class": "pm-sea", d: path(sphere) }, svg);
    node("path", { "class": "pm-grid", d: path(d3.geoGraticule10()) }, svg);
    node("path", { "class": "pm-land", d: path(land) }, svg);
    node("path", { "class": "pm-border", d: path(borders) }, svg);
    node("path", { "class": "pm-route", d: path({ type: "LineString",
      coordinates: PLACES.map(function (p) { return p.at; }) }) }, svg);

    var OFF = { left: [-9, 5, "end"], right: [9, 5, "start"], above: [0, -10, "middle"], below: [0, 19, "middle"] };
    PLACES.forEach(function (p, i) {
      var xy = projection(p.at), o = OFF[p.label] || OFF.right;
      var g = node("g", { "class": "pm-place", tabindex: 0 }, svg);
      node("title", {}, g).textContent = p.name + " · " + p.years + " · " + p.what;
      node("circle", { cx: xy[0], cy: xy[1], r: 5 }, g);
      var t = node("text", { x: xy[0] + o[0], y: xy[1] + o[1], "text-anchor": o[2] }, g);
      t.textContent = (i + 1) + ". " + p.name;
    });

    el.appendChild(svg);
  }
})();
