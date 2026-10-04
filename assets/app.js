/* ==========================================================================
   MindTrace — application (vanilla JS, no build step)
   Hash router + views: Home, Learn (structured path), Library, Reader, Bookmarks
   ========================================================================== */
(function () {
  "use strict";

  var DATA = window.MINDTRACE_DATA || { categories: [], topics: [] };
  var CATS = DATA.categories;
  var TOPICS = DATA.topics;

  /* ---------------- icons ---------------- */
  var P = {
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    next: '<path d="M9 5l7 7-7 7"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>',
    bookmark: '<path d="M6.5 3h11a1 1 0 011 1v17l-6.5-4.2L5.5 21V4a1 1 0 011-1z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
    play: '<path d="M7 4.5l12 7.5-12 7.5z"/>',
    shield: '<path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z"/><path d="M12 8.5v3.5"/><path d="M12 15h.01"/>',
    heart: '<path d="M12 20s-7-4.3-9.2-8.5A5 5 0 0112 6a5 5 0 019.2 5.5C19 15.7 12 20 12 20z"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
    message: '<path d="M4 5h16v11H8l-4 4z"/>',
    handshake: '<path d="M8 12l3-3 4 4"/><path d="M3 10l4-3 5 5-2 2"/><path d="M21 10l-4-3-3 3"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0112 0"/><path d="M16 5.5a3 3 0 010 5.5"/><path d="M21 20a6 6 0 00-4-5.6"/>',
    brain: '<path d="M9.5 4a3 3 0 00-3 3 3 3 0 00-1 5.8V16a3 3 0 003 3h1.5V4z"/><path d="M14.5 4a3 3 0 013 3 3 3 0 011 5.8V16a3 3 0 01-3 3h-1.5V4z"/>',
    branch: '<circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="12" cy="18" r="2.4"/><path d="M6 8.4v2a3 3 0 003 3h6a3 3 0 003-3v-2"/><path d="M12 13.4v2.2"/>',
    group: '<circle cx="7" cy="9" r="3"/><circle cx="17" cy="9" r="3"/><path d="M2 20a5 5 0 0110 0"/><path d="M12 20a5 5 0 0110 0"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
    "eye-off": '<path d="M3 3l18 18"/><path d="M10.6 10.6a3 3 0 004.2 4.2"/><path d="M6.5 6.9C4 8.4 2 12 2 12s3.5 7 10 7a11 11 0 004.4-.9"/><path d="M9.9 5.2A10 10 0 0112 5c6.5 0 10 7 10 7a17 17 0 01-3.2 4"/>',
    crown: '<path d="M4 18h16"/><path d="M4 18l-1.2-9L8 13l4-6 4 6 5.2-4L20 18"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18"/><circle cx="16.5" cy="14.5" r="1"/>',
    ghost: '<path d="M12 3a7 7 0 017 7v9l-2.3-2-2.3 2-2.4-2-2.4 2L7 17l-2 2v-9a7 7 0 017-7z"/><path d="M9.5 10h.01"/><path d="M14.5 10h.01"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/>',
    book: '<path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 004 22z"/><path d="M4 17.5A2.5 2.5 0 016.5 15H20"/>'
  };
  function icon(name, cls) {
    var d = P[name] || P.book;
    return '<svg viewBox="0 0 24 24" class="ico ' + (cls || "") + '" aria-hidden="true">' + d + "</svg>";
  }

  /* ---------------- helpers ---------------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  var catById = {};
  CATS.forEach(function (c) { catById[c.id] = c; });
  var topicBySlug = {};
  TOPICS.forEach(function (t) { topicBySlug[t.slug] = t; });
  function topicsOf(catId) { return TOPICS.filter(function (t) { return t.category === catId; }); }
  function orderedCat(catId) { return topicsOf(catId); } // already sorted by readTime then title
  function catName(id) { return catById[id] ? catById[id].title : id; }
  function catAccent(id) { return catById[id] ? catById[id].accent : "#6d7cff"; }
  function catIcon(id) { return catById[id] ? catById[id].icon : "book"; }
  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  var CALLOUT_RE = /^(reality check|key takeaway|quick understanding|the bottom line|summary|verdict)\b/i;

  /* ---------------- state ---------------- */
  var LS_PROGRESS = "mindtrace.progress";
  var LS_BOOKMARKS = "mindtrace.bookmarks";
  var LS_THEME = "mindtrace.theme";

  function loadSet(key) {
    try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); }
    catch (e) { return new Set(); }
  }
  function saveSet(key, set) {
    try { localStorage.setItem(key, JSON.stringify(Array.from(set))); } catch (e) {}
  }
  var state = {
    progress: loadSet(LS_PROGRESS),
    bookmarks: loadSet(LS_BOOKMARKS)
  };
  function isDone(id) { return state.progress.has(id); }
  function isBooked(id) { return state.bookmarks.has(id); }
  function toggleDone(id) {
    if (state.progress.has(id)) state.progress.delete(id); else state.progress.add(id);
    saveSet(LS_PROGRESS, state.progress);
  }
  function toggleBook(id) {
    if (state.bookmarks.has(id)) state.bookmarks.delete(id); else state.bookmarks.add(id);
    saveSet(LS_BOOKMARKS, state.bookmarks);
  }

  /* ---------------- routing ---------------- */
  function parseHash() {
    var raw = location.hash.replace(/^#\/?/, "");
    var qi = raw.indexOf("?");
    var query = {};
    if (qi >= 0) {
      raw.slice(qi + 1).split("&").forEach(function (kv) {
        if (!kv) return;
        var i = kv.indexOf("=");
        query[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1));
      });
      raw = raw.slice(0, qi);
    }
    var parts = raw.split("/").filter(Boolean);
    return { name: parts[0] || "home", param: parts[1] || null, query: query };
  }

  /* ---------------- views ---------------- */
  function topicCard(t) {
    var a = catAccent(t.category);
    return (
      '<a class="card topic-card" href="#/topic/' + esc(t.slug) + '" style="--cat:' + a + '">' +
        '<div class="t-top">' +
          '<span class="badge"><span class="dot"></span>' + esc(catName(t.category)) + "</span>" +
          (isDone(t.id) ? '<span class="badge done">' + icon("check") + " Done</span>" : "") +
        "</div>" +
        "<h3>" + esc(t.title) + "</h3>" +
        "<p>" + esc(t.description) + "</p>" +
        '<div class="t-foot">' +
          '<span class="meta">' + icon("clock") + t.readTime + " min read</span>" +
          (isBooked(t.id) ? '<span class="meta" style="color:var(--accent)">' + icon("bookmark") + "</span>" : "") +
        "</div>" +
      "</a>"
    );
  }

  function moduleCard(c) {
    var list = orderedCat(c.id);
    var done = list.filter(function (t) { return isDone(t.id); }).length;
    var pct = list.length ? Math.round((done / list.length) * 100) : 0;
    return (
      '<a class="card module-card" href="#/library/' + esc(c.id) + '" style="--cat:' + c.accent + '">' +
        '<div class="module-top">' +
          '<span class="module-ico">' + icon(c.icon) + "</span>" +
          "<div><h3>" + esc(c.title) + '</h3><span class="mcount">' + list.length + " topics</span></div>" +
        "</div>" +
        "<p>" + esc(c.description) + "</p>" +
        '<div class="progress-wrap">' +
          '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
          '<span class="progress-label">' + done + "/" + list.length + "</span>" +
        "</div>" +
      "</a>"
    );
  }

  function progressOverall() {
    var done = state.progress.size;
    var total = TOPICS.length || 1;
    return { done: done, total: TOPICS.length, pct: Math.round((done / total) * 100) };
  }

  function foundationPath() {
    // shortest topic from each category, ordered light -> heavy, take 10
    var picks = CATS.map(function (c) { return orderedCat(c.id)[0]; }).filter(Boolean);
    picks.sort(function (a, b) { return a.readTime - b.readTime || a.title.localeCompare(b.title); });
    return picks.slice(0, 10);
  }

  function renderHome() {
    var ov = progressOverall();
    var nextTopic = TOPICS.filter(function (t) { return !isDone(t.id); })[0];
    var fpath = foundationPath();

    var html =
      '<section class="hero fade-in">' +
        '<span class="eyebrow">Structured learning for human behaviour</span>' +
        "<h1>Understand people. Understand&nbsp;yourself.</h1>" +
        '<p class="lead">A guided library of psychology, relationships and social dynamics — ' +
          esc(TOPICS.length) + " topics across " + CATS.length + " disciplines, each broken into clear, " +
          "practical sections you can actually use.</p>" +
        '<div class="hero-actions">' +
          (nextTopic
            ? '<a class="btn btn-primary" href="#/topic/' + esc(nextTopic.slug) + '">' + icon("play") + (ov.done ? "Continue learning" : "Start learning") + "</a>"
            : '<a class="btn btn-primary" href="#/library">' + icon("book") + "Browse library</a>") +
          '<a class="btn btn-ghost" href="#/learn">' + icon("layers") + "See the learning path</a>" +
        "</div>" +
      "</section>";

    html +=
      '<div class="stats">' +
        stat(TOPICS.length, "Topics to explore") +
        stat(CATS.length, "Learning modules") +
        stat(ov.done, "Topics completed") +
        stat(ov.pct + '<span class="unit">%</span>', "Your progress") +
      "</div>";

    // continue strip
    if (nextTopic) {
      html +=
        '<div class="section-head"><h2>Pick up where you left off</h2>' +
        '<a class="link" href="#/learn">Full path →</a></div>' +
        '<div class="grid grid-3">' +
          topicCard(nextTopic) +
          fpath.filter(function (t) { return t.id !== nextTopic.id; }).slice(0, 2).map(topicCard).join("") +
        "</div>";
    }

    html +=
      '<div class="section-head"><h2>Explore the modules</h2>' +
      '<a class="link" href="#/library">All topics →</a></div>' +
      '<div class="grid grid-3">' + CATS.map(moduleCard).join("") + "</div>";

    return html;
  }

  function stat(num, label) {
    return '<div class="stat"><div class="num">' + num + '</div><div class="label">' + esc(label) + "</div></div>";
  }

  function renderLearn() {
    var ov = progressOverall();
    var fpath = foundationPath();
    var html =
      '<div class="section-head" style="margin-top:0">' +
        "<div><span class=\"eyebrow\">Structured learning</span><h2 style=\"margin-top:6px\">Your learning path</h2></div>" +
      "</div>" +
      '<p style="color:var(--muted);max-width:64ch;margin-bottom:26px">' +
        "Work through the modules in order, or jump to what matters now. Your progress is saved in this browser.</p>";

    html +=
      '<div class="card" style="margin-bottom:30px">' +
        '<div class="section-head" style="margin:0 0 14px"><h3 style="font-size:1.05rem">Overall progress</h3>' +
        '<span class="progress-label">' + ov.done + " / " + ov.total + " topics</span></div>" +
        '<div class="progress"><span style="width:' + ov.pct + '%"></span></div>' +
      "</div>";

    html += '<div class="section-head"><h2>Foundation path</h2><span class="meta">Start here · 10 quick reads</span></div>';
    html += '<div class="path">';
    fpath.forEach(function (t, i) {
      html += pathItem(t, i + 1, catName(t.category) + " · " + t.readTime + " min");
    });
    html += "</div>";

    html += '<div class="section-head"><h2>Modules</h2><span class="meta">' + CATS.length + " disciplines</span></div>";
    html += '<div class="grid grid-3">' + CATS.map(moduleCard).join("") + "</div>";
    return html;
  }

  function pathItem(t, index, sub) {
    var done = isDone(t.id);
    return (
      '<a class="path-item' + (done ? " done" : "") + '" href="#/topic/' + esc(t.slug) + '" style="--cat:' + catAccent(t.category) + '">' +
        '<span class="path-index">' + (done ? icon("check") : index) + "</span>" +
        '<div class="path-main"><h3>' + esc(t.title) + "</h3><p>" + esc(sub) + "</p></div>" +
        '<span class="path-side">' + (done ? "Completed" : "Start") + "</span>" +
      "</a>"
    );
  }

  function renderLibrary(route) {
    var activeCat = route.param || route.query.c || "all";
    var q = (route.query.q || "").trim().toLowerCase();

    var html =
      '<div class="section-head" style="margin-top:0">' +
        "<div><span class=\"eyebrow\">Knowledge base</span><h2 style=\"margin-top:6px\">Library</h2></div>" +
        '<span class="meta">' + TOPICS.length + " topics</span>" +
      "</div>";

    html += '<div class="chips">';
    html += '<a class="chip' + (activeCat === "all" ? " active" : "") + '" href="#/library' + (q ? "?q=" + encodeURIComponent(q) : "") + '">All</a>';
    CATS.forEach(function (c) {
      var href = "#/library/" + c.id + (q ? "?q=" + encodeURIComponent(q) : "");
      html += '<a class="chip' + (activeCat === c.id ? " active" : "") + '" href="' + href + '">' + esc(c.title) + "</a>";
    });
    html += "</div>";

    var list = activeCat === "all" ? TOPICS.slice() : topicsOf(activeCat);
    if (q) {
      list = list.filter(function (t) {
        return (t.title + " " + t.description + " " + catName(t.category)).toLowerCase().indexOf(q) >= 0;
      });
    }

    if (q) {
      html += '<p class="meta" style="margin-bottom:18px">' + list.length + ' result' + (list.length === 1 ? "" : "s") + ' for "' + esc(q) + '"</p>';
    }

    if (!list.length) {
      html += '<div class="empty">' + icon("search") + "<h3>No topics found</h3><p>Try a different word or category.</p></div>";
      return html;
    }

    html += '<div class="grid grid-3">' + list.map(topicCard).join("") + "</div>";
    return html;
  }

  function renderTopic(route) {
    var t = topicBySlug[route.param];
    if (!t) {
      return '<div class="empty">' + icon("book") + "<h3>Topic not found</h3><p>It may have been renamed. <a href=\"#/library\" style=\"color:var(--accent)\">Back to library</a></p></div>";
    }
    var list = orderedCat(t.category);
    var idx = list.findIndex(function (x) { return x.id === t.id; });
    var prev = idx > 0 ? list[idx - 1] : null;
    var next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
    var done = isDone(t.id);
    var booked = isBooked(t.id);

    var sections = t.sections.map(function (s) {
      var body;
      if (s.content.length > 1) {
        body = "<ul>" + s.content.map(function (line) { return "<li>" + esc(line) + "</li>"; }).join("") + "</ul>";
      } else {
        body = "<p>" + esc(s.content[0]) + "</p>";
      }
      var cls = "section" + (CALLOUT_RE.test(s.title) ? " callout" : "");
      return '<section class="' + cls + '" id="' + esc(slug(s.title)) + '"><h2>' + esc(s.title) + "</h2>" + body + "</section>";
    }).join("");

    var toc = t.sections.length >= 5
      ? '<nav class="toc" aria-label="On this topic"><h2>In this topic</h2><ol>' +
          t.sections.map(function (s) {
            var sid = slug(s.title);
            return '<li><a href="#' + esc(sid) + '" data-action="scroll" data-target="' + esc(sid) + '">' + esc(s.title) + "</a></li>";
          }).join("") +
        "</ol></nav>"
      : "";

    var related = (t.relatedTopics || [])
      .map(function (id) { return topicBySlug[id] || TOPICS.filter(function (x) { return x.id === id; })[0]; })
      .filter(Boolean)
      .slice(0, 6);

    var html =
      '<div class="reader fade-in" style="--cat:' + catAccent(t.category) + '">' +
        '<div class="reader-top">' +
          '<a class="back-btn" href="#/library/' + esc(t.category) + '">' + icon("back") + esc(catName(t.category)) + "</a>" +
        "</div>" +
        '<header class="reader-head">' +
          '<div class="badges">' +
            '<span class="badge"><span class="dot"></span>' + esc(catName(t.category)) + "</span>" +
            '<span class="badge">' + icon("clock") + t.readTime + " min read</span>" +
          "</div>" +
          "<h1>" + esc(t.title) + "</h1>" +
          '<p class="desc">' + esc(t.description) + "</p>" +
          '<div class="toolbar">' +
            '<button class="tool-btn' + (done ? " done-on" : "") + '" data-action="toggle-done" data-id="' + esc(t.id) + '">' +
              icon("check") + (done ? "Completed" : "Mark as complete") + "</button>" +
            '<button class="tool-btn' + (booked ? " on" : "") + '" data-action="toggle-book" data-id="' + esc(t.id) + '">' +
              icon("bookmark") + (booked ? "Bookmarked" : "Bookmark") + "</button>" +
          "</div>" +
        "</header>" +
        toc +
        '<div class="sections">' + sections + "</div>";

    if (related.length) {
      html += '<div class="related"><div class="section-head" style="margin:0 0 16px"><h2>Related topics</h2></div>' +
        '<div class="grid grid-3">' + related.map(topicCard).join("") + "</div></div>";
    }

    html += '<div class="pager">' +
      (prev
        ? '<a href="#/topic/' + esc(prev.slug) + '"><span class="k">Previous</span><span class="v">' + esc(prev.title) + "</span></a>"
        : '<a class="disabled"><span class="k">Previous</span><span class="v">—</span></a>') +
      (next
        ? '<a class="next" href="#/topic/' + esc(next.slug) + '"><span class="k">Next</span><span class="v">' + esc(next.title) + "</span></a>"
        : '<a class="disabled next"><span class="k">Next</span><span class="v">—</span></a>') +
      "</div>";

    html += "</div>";
    return html;
  }

  function renderBookmarks() {
    var booked = TOPICS.filter(function (t) { return isBooked(t.id); });
    var doneList = TOPICS.filter(function (t) { return isDone(t.id); });

    var html =
      '<div class="section-head" style="margin-top:0">' +
        "<div><span class=\"eyebrow\">Your space</span><h2 style=\"margin-top:6px\">Bookmarks &amp; progress</h2></div>" +
      "</div>";

    html += '<div class="section-head"><h2>Bookmarked</h2><span class="meta">' + booked.length + " saved</span></div>";
    html += booked.length
      ? '<div class="grid grid-3">' + booked.map(topicCard).join("") + "</div>"
      : '<div class="empty">' + icon("bookmark") + "<h3>No bookmarks yet</h3><p>Tap the bookmark button on any topic to save it here.</p></div>";

    html += '<div class="section-head"><h2>Completed</h2><span class="meta">' + doneList.length + " done</span></div>";
    html += doneList.length
      ? '<div class="grid grid-3">' + doneList.map(topicCard).join("") + "</div>"
      : '<div class="empty">' + icon("check") + "<h3>Nothing completed yet</h3><p>Mark topics as complete to track your progress.</p></div>";

    return html;
  }

  /* ---------------- render ---------------- */
  var app = document.getElementById("app");

  function render() {
    var route = parseHash();
    var html;
    switch (route.name) {
      case "learn": html = renderLearn(); break;
      case "library": html = renderLibrary(route); break;
      case "topic": html = renderTopic(route); break;
      case "bookmarks": html = renderBookmarks(); break;
      default: html = renderHome();
    }
    app.innerHTML = html;
    app.classList.remove("fade-in");
    void app.offsetWidth;
    app.classList.add("fade-in");

    // nav active state
    var navKey = route.name === "topic" ? "library" : route.name;
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-nav") === navKey);
    });

    // reading progress element on topic pages
    var rp = document.getElementById("reading-progress");
    if (route.name === "topic" && !rp) {
      rp = document.createElement("div");
      rp.id = "reading-progress";
      rp.className = "reading-progress";
      document.body.appendChild(rp);
    } else if (route.name !== "topic" && rp) {
      rp.remove();
    }
    updateReadingProgress();
    window.scrollTo(0, 0);
  }

  function updateReadingProgress() {
    var rp = document.getElementById("reading-progress");
    if (!rp) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var pct = h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0;
    rp.style.width = pct + "%";
  }

  /* ---------------- events ---------------- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-action]");
    if (!el) return;
    var action = el.getAttribute("data-action");
    if (action === "scroll") {
      e.preventDefault();
      var node = document.getElementById(el.getAttribute("data-target"));
      if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    var id = el.getAttribute("data-id");
    if (action === "toggle-done") { toggleDone(id); render(); }
    else if (action === "toggle-book") { toggleBook(id); render(); }
  });

  var searchInput = document.getElementById("search-input");
  var searchTimer;
  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimer);
    var val = searchInput.value.trim();
    searchTimer = setTimeout(function () {
      if (val) location.hash = "#/library?q=" + encodeURIComponent(val);
      else if (parseHash().name === "library") location.hash = "#/library";
    }, 220);
  });
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var val = searchInput.value.trim();
      location.hash = val ? "#/library?q=" + encodeURIComponent(val) : "#/library";
    }
  });

  var themeBtn = document.getElementById("theme-toggle");
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(LS_THEME, t); } catch (e) {}
  }
  themeBtn.addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(cur);
  });
  (function initTheme() {
    var saved;
    try { saved = localStorage.getItem(LS_THEME); } catch (e) {}
    if (saved) applyTheme(saved);
  })();

  window.addEventListener("scroll", updateReadingProgress, { passive: true });
  window.addEventListener("hashchange", render);

  render();
})();
