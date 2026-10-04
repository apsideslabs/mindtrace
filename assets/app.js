/* ==========================================================================
   MindTrace — application
   Hash router + views: Home, Learn, Library, Reader, Quiz, Progress.
   Gamification: XP, levels, streaks, daily quest, achievements.
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
    book: '<path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 004 22z"/><path d="M4 17.5A2.5 2.5 0 016.5 15H20"/>',
    flame: '<path d="M12 3c1 3 4 4.4 4 8a4 4 0 11-8 0c0-2 1-3.4 2-4.4 0 1.5.6 2.4 1.5 2.4C12.6 7 12 5 12 3z"/>',
    trophy: '<path d="M8 4h8v4.5a4 4 0 11-8 0z"/><path d="M8 6H5.5A2.5 2.5 0 008 8.5M16 6h2.5A2.5 2.5 0 0116 8.5"/><path d="M12 12.5V16M9 20h6M10.5 16h3"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.6"/>',
    bolt: '<path d="M13 3L5.5 13H11l-1 8 7.5-10H12z"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2.4"/><path d="M8 11V8a4 4 0 018 0v3"/>',
    refresh: '<path d="M20.5 12a8.5 8.5 0 11-2.5-6"/><path d="M20.5 4v4.5H16"/>',
    star: '<path d="M12 3.5l2.5 5.3 5.8.8-4.2 4.1 1 5.8-5.1-2.7-5.1 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>'
  };
  function icon(name, cls) {
    return '<svg viewBox="0 0 24 24" class="ico ' + (cls || "") + '" aria-hidden="true">' + (P[name] || P.book) + "</svg>";
  }

  /* ---------------- helpers ---------------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  var catById = {};
  CATS.forEach(function (c) { catById[c.id] = c; });
  var topicBySlug = {};
  TOPICS.forEach(function (t) { topicBySlug[t.slug] = t; });
  function topicsOf(catId) { return TOPICS.filter(function (t) { return t.category === catId; }); }
  function catName(id) { return catById[id] ? catById[id].title : id; }
  function catAccent(id) { return catById[id] ? catById[id].accent : "#2563eb"; }
  function catIcon(id) { return catById[id] ? catById[id].icon : "book"; }
  function slugify(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
  var CALLOUT_RE = /^(reality check|key takeaway|quick understanding|the bottom line|summary|verdict)/i;

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function dateStr(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function todayStr() { return dateStr(new Date()); }
  function yesterdayStr() { var d = new Date(); d.setDate(d.getDate() - 1); return dateStr(d); }

  /* ---------------- state ---------------- */
  var KEY = "mindtrace.state.v1";
  var DEFAULT_STATE = {
    progress: [], bookmarks: [], badges: [],
    xp: 0,
    streak: { count: 0, last: null },
    daily: { date: null, count: 0, goal: 3 },
    quiz: { played: 0, correct: 0, answered: 0, perfect: 0 },
    theme: "paper"
  };
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return clone(DEFAULT_STATE);
      var s = JSON.parse(raw);
      var base = clone(DEFAULT_STATE);
      Object.keys(base).forEach(function (k) { if (s[k] !== undefined) base[k] = s[k]; });
      return base;
    } catch (e) { return clone(DEFAULT_STATE); }
  }
  var state = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  function isDone(id) { return state.progress.indexOf(id) >= 0; }
  function isBooked(id) { return state.bookmarks.indexOf(id) >= 0; }
  function doneCount() { return state.progress.length; }

  /* ---------------- levels ---------------- */
  var LEVELS = [
    { lv: 1, title: "Novice", xp: 0 },
    { lv: 2, title: "Apprentice", xp: 120 },
    { lv: 3, title: "Analyst", xp: 300 },
    { lv: 4, title: "Strategist", xp: 560 },
    { lv: 5, title: "Tactician", xp: 920 },
    { lv: 6, title: "Expert", xp: 1400 },
    { lv: 7, title: "Master", xp: 2000 },
    { lv: 8, title: "Grandmaster", xp: 2800 }
  ];
  function levelInfo(xp) {
    var idx = 0;
    for (var i = 0; i < LEVELS.length; i++) { if (xp >= LEVELS[i].xp) idx = i; }
    var cur = LEVELS[idx];
    var next = LEVELS[idx + 1] || null;
    var span = next ? next.xp - cur.xp : 1;
    var pct = next ? Math.max(0, Math.min(1, (xp - cur.xp) / span)) : 1;
    return { level: cur.lv, title: cur.title, next: next, pct: pct, toNext: next ? next.xp - xp : 0 };
  }

  /* ---------------- achievements ---------------- */
  function anyModuleComplete() {
    for (var i = 0; i < CATS.length; i++) {
      var list = topicsOf(CATS[i].id);
      if (list.length && list.every(function (t) { return isDone(t.id); })) return true;
    }
    return false;
  }
  var BADGES = [
    { id: "first-step", name: "First Step", desc: "Complete your first topic", icon: "check", check: function () { return doneCount() >= 1; } },
    { id: "explorer", name: "Explorer", desc: "Complete 10 topics", icon: "compass", check: function () { return doneCount() >= 10; } },
    { id: "scholar", name: "Scholar", desc: "Complete 50 topics", icon: "book", check: function () { return doneCount() >= 50; } },
    { id: "polymath", name: "Polymath", desc: "Complete 100 topics", icon: "brain", check: function () { return doneCount() >= 100; } },
    { id: "halfway", name: "Halfway There", desc: "Complete 127 topics", icon: "layers", check: function () { return doneCount() >= 127; } },
    { id: "module-master", name: "Module Master", desc: "Finish every topic in a module", icon: "trophy", check: anyModuleComplete },
    { id: "collector", name: "Collector", desc: "Bookmark 5 topics", icon: "bookmark", check: function () { return state.bookmarks.length >= 5; } },
    { id: "quiz-rookie", name: "Quiz Rookie", desc: "Finish your first quiz", icon: "target", check: function () { return state.quiz.played >= 1; } },
    { id: "sharp", name: "Sharp Eye", desc: "Score 5/5 in a quiz", icon: "star", check: function () { return state.quiz.perfect >= 1; } },
    { id: "streak-3", name: "On a Roll", desc: "Reach a 3-day streak", icon: "flame", check: function () { return state.streak.count >= 3; } },
    { id: "streak-7", name: "Unstoppable", desc: "Reach a 7-day streak", icon: "flame", check: function () { return state.streak.count >= 7; } },
    { id: "xp-500", name: "500 Club", desc: "Earn 500 XP", icon: "bolt", check: function () { return state.xp >= 500; } }
  ];

  /* ---------------- toasts ---------------- */
  function toast(msg, icoName, cls) {
    var box = document.getElementById("toasts");
    if (!box) return;
    var el = document.createElement("div");
    el.className = "toast " + (cls || "");
    el.innerHTML = icon(icoName || "bolt") + "<span>" + esc(msg) + "</span>";
    box.appendChild(el);
    setTimeout(function () {
      el.classList.add("out");
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 320);
    }, 2800);
  }

  /* ---------------- xp / progression ---------------- */
  function awardXp(n, label) {
    var before = levelInfo(state.xp).level;
    state.xp += n;
    var after = levelInfo(state.xp);
    save();
    if (label) toast("+" + n + " XP - " + label, "bolt", "");
    if (after.level > before) toast("Level " + after.level + " - " + after.title + "!", "trophy", "level-toast");
  }
  function touchStreak() {
    var t = todayStr();
    if (state.streak.last === t) return;
    state.streak.count = state.streak.last === yesterdayStr() ? state.streak.count + 1 : 1;
    state.streak.last = t;
    save();
  }
  function touchDaily() {
    var t = todayStr();
    if (state.daily.date !== t) { state.daily.date = t; state.daily.count = 0; }
    state.daily.count++;
    save();
  }
  function syncBadges() {
    var changed = false;
    BADGES.forEach(function (b) {
      if (state.badges.indexOf(b.id) < 0 && b.check()) {
        state.badges.push(b.id);
        state.xp += 30;
        changed = true;
        toast("Achievement unlocked: " + b.name + " (+30 XP)", b.icon, "badge-toast");
      }
    });
    if (changed) save();
  }
  function toggleDone(id) {
    var i = state.progress.indexOf(id);
    if (i >= 0) { state.progress.splice(i, 1); }
    else { state.progress.push(id); touchStreak(); touchDaily(); awardXp(12, "Topic completed"); }
    save();
    syncBadges();
  }
  function toggleBook(id) {
    var i = state.bookmarks.indexOf(id);
    if (i >= 0) state.bookmarks.splice(i, 1); else state.bookmarks.push(id);
    save();
    syncBadges();
  }

  /* ---------------- theme ---------------- */
  function setTheme(t) {
    if (t !== "paper" && t !== "slate") t = "paper";
    state.theme = t;
    document.documentElement.setAttribute("data-theme", t);
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", t === "slate" ? "#131519" : "#f7f4ee");
    save();
    renderHeader();
  }

  /* ---------------- routing ---------------- */
  function parseHash() {
    var raw = location.hash.replace(/^#/, "");
    if (raw.charAt(0) === "/") raw = raw.slice(1);
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

  /* ---------------- shared bits ---------------- */
  function ringSvg(pct, size, stroke) {
    var r = (size - stroke) / 2;
    var c = 2 * Math.PI * r;
    var off = c * (1 - Math.max(0, Math.min(1, pct)));
    return '<svg viewBox="0 0 ' + size + " " + size + '" width="' + size + '" height="' + size + '">' +
      '<circle class="track" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '"/>' +
      '<circle class="fill" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/></svg>';
  }
  function badgeDone() { return '<span class="badge done">' + icon("check") + " Done</span>"; }
  function badgeXp(n) { return '<span class="badge xp">' + icon("bolt") + "+" + n + " XP</span>"; }

  function topicCard(t) {
    return '<a class="card topic-card" href="#/topic/' + esc(t.slug) + '" style="--cat:' + catAccent(t.category) + '">' +
      '<div class="t-top"><span class="badge"><span class="dot"></span>' + esc(catName(t.category)) + "</span>" +
        (isDone(t.id) ? badgeDone() : "") + "</div>" +
      "<h3>" + esc(t.title) + "</h3><p>" + esc(t.description) + "</p>" +
      '<div class="t-foot"><span class="meta">' + icon("clock") + t.readTime + " min</span>" +
        (isBooked(t.id) ? '<span class="meta" style="color:var(--accent)">' + icon("bookmark") + "</span>" : "") +
      "</div></a>";
  }
  function moduleCard(c) {
    var list = topicsOf(c.id);
    var done = list.filter(function (t) { return isDone(t.id); }).length;
    var pct = list.length ? Math.round((done / list.length) * 100) : 0;
    return '<a class="card module-card" href="#/library/' + esc(c.id) + '" style="--cat:' + c.accent + '">' +
      '<div class="module-top"><span class="module-ico">' + icon(c.icon) + "</span>" +
        "<div><h3>" + esc(c.title) + '</h3><span class="mcount">' + list.length + " topics</span></div></div>" +
      "<p>" + esc(c.description) + "</p>" +
      '<div class="progress-wrap"><div class="progress"><span style="width:' + pct + '%"></span></div>' +
        '<span class="progress-label">' + done + "/" + list.length + "</span></div></a>";
  }
  function stat(num, label) {
    return '<div class="stat"><div class="num">' + num + '</div><div class="label">' + esc(label) + "</div></div>";
  }
  function foundationPath() {
    var picks = CATS.map(function (c) { return topicsOf(c.id)[0]; }).filter(Boolean);
    picks.sort(function (a, b) { return a.readTime - b.readTime || a.title.localeCompare(b.title); });
    return picks.slice(0, 10);
  }
  function gameStrip() {
    var li = levelInfo(state.xp);
    var dailyDone = state.daily.date === todayStr() ? state.daily.count : 0;
    var dailyPct = Math.min(100, Math.round((dailyDone / state.daily.goal) * 100));
    return '<div class="game-strip">' +
      '<div class="panel level-panel"><div class="ring-lg">' + ringSvg(li.pct, 92, 7) +
        '<div class="mid"><div><b>' + li.level + "</b><br><small>LEVEL</small></div></div></div>" +
        '<div class="level-info"><b>' + esc(li.title) + "</b><span>" + state.xp + " XP total</span>" +
          (li.next ? '<div class="to-next">' + li.toNext + " XP to " + esc(li.next.title) + "</div>" : '<div class="to-next">Max level reached</div>') +
        "</div></div>" +
      '<div class="panel streak-panel"><h3>Streak</h3><div class="streak-num">' + icon("flame") + state.streak.count + "</div>" +
        '<div class="sub">' + (state.streak.count > 0 ? "day" + (state.streak.count === 1 ? "" : "s") + " in a row" : "Read today to start one") + "</div></div>" +
      '<div class="panel quest-panel"><h3>Daily quest</h3>' +
        '<div class="quest-row"><b>Complete ' + state.daily.goal + " topics</b>" +
          (dailyDone >= state.daily.goal ? '<span class="tick">' + icon("check") + " Done</span>" : '<span class="progress-label">' + dailyDone + "/" + state.daily.goal + "</span>") +
        "</div>" +
        '<div class="progress"><span style="width:' + dailyPct + '%"></span></div></div></div>';
  }

  /* ---------------- views ---------------- */
  function renderHome() {
    var nextTopic = TOPICS.filter(function (t) { return !isDone(t.id); })[0];
    var html = '<section class="hero fade-in">' +
      '<span class="eyebrow">Structured, gamified learning</span>' +
      "<h1>Understand people. Understand&nbsp;yourself.</h1>" +
      '<p class="lead">A guided library of psychology, relationships and social dynamics - ' +
        esc(TOPICS.length) + " topics across " + CATS.length + " modules. Read, earn XP, level up, and test yourself.</p>" +
      '<div class="hero-actions">' +
        (nextTopic
          ? '<a class="btn btn-primary" href="#/topic/' + esc(nextTopic.slug) + '">' + icon("play") + (doneCount() ? "Continue learning" : "Start learning") + "</a>"
          : '<a class="btn btn-primary" href="#/library">' + icon("book") + "Browse library</a>") +
        '<a class="btn btn-ghost" href="#/quiz">' + icon("target") + "Take a quiz</a>" +
      "</div></section>";

    html += gameStrip();

    html += '<div class="stats" style="margin-top:16px">' +
      stat(doneCount(), "Topics completed") + stat(state.xp, "XP earned") +
      stat(state.badges.length, "Achievements") + stat(state.quiz.correct, "Quiz answers right") + "</div>";

    if (nextTopic) {
      var fp = foundationPath().filter(function (t) { return t.id !== nextTopic.id; }).slice(0, 2);
      html += '<div class="section-head"><h2>Pick up where you left off</h2><a class="link" href="#/learn">Full path</a></div>' +
        '<div class="grid grid-3">' + topicCard(nextTopic) + fp.map(topicCard).join("") + "</div>";
    }

    html += '<div class="section-head"><h2>Explore the modules</h2><a class="link" href="#/library">All topics</a></div>' +
      '<div class="grid grid-3">' + CATS.map(moduleCard).join("") + "</div>";
    return html;
  }

  function renderLearn() {
    var done = doneCount(), total = TOPICS.length;
    var pct = total ? Math.round((done / total) * 100) : 0;
    var fp = foundationPath();
    var html = '<div class="section-head" style="margin-top:0"><div><span class="eyebrow">Structured learning</span>' +
      '<h2 style="margin-top:6px">Your learning path</h2></div><span class="meta">' + done + " / " + total + " complete</span></div>" +
      '<p style="color:var(--muted);max-width:64ch;margin-bottom:26px">Work through the modules in order, or jump to what matters now. Every topic you finish earns XP and builds your streak.</p>';
    html += '<div class="panel" style="margin-bottom:30px"><div class="progress-wrap"><div class="progress"><span style="width:' + pct + '%"></span></div>' +
      '<span class="progress-label">' + pct + "%</span></div></div>";
    html += '<div class="section-head"><h2>Foundation path</h2><span class="meta">Start here - 10 quick reads</span></div><div class="path">';
    fp.forEach(function (t, i) {
      var isD = isDone(t.id);
      html += '<a class="path-item' + (isD ? " done" : "") + '" href="#/topic/' + esc(t.slug) + '" style="--cat:' + catAccent(t.category) + '">' +
        '<span class="path-index">' + (isD ? icon("check") : i + 1) + "</span>" +
        '<div class="path-main"><h3>' + esc(t.title) + "</h3><p>" + esc(catName(t.category)) + " - " + t.readTime + " min</p></div>" +
        '<span class="path-side">' + (isD ? "Completed" : "Start") + "</span></a>";
    });
    html += "</div>";
    html += '<div class="section-head"><h2>Modules</h2><span class="meta">' + CATS.length + " disciplines</span></div>" +
      '<div class="grid grid-3">' + CATS.map(moduleCard).join("") + "</div>";
    return html;
  }

  function renderLibrary(route) {
    var activeCat = route.param || route.query.c || "all";
    var q = (route.query.q || "").trim().toLowerCase();
    var html = '<div class="section-head" style="margin-top:0"><div><span class="eyebrow">Knowledge base</span>' +
      '<h2 style="margin-top:6px">Library</h2></div><span class="meta">' + TOPICS.length + " topics</span></div>";
    html += '<div class="chips"><a class="chip' + (activeCat === "all" ? " active" : "") + '" href="#/library' + (q ? "?q=" + encodeURIComponent(q) : "") + '">All</a>';
    CATS.forEach(function (c) {
      html += '<a class="chip' + (activeCat === c.id ? " active" : "") + '" href="#/library/' + c.id + (q ? "?q=" + encodeURIComponent(q) : "") + '">' + esc(c.title) + "</a>";
    });
    html += "</div>";
    var list = activeCat === "all" ? TOPICS.slice() : topicsOf(activeCat);
    if (q) list = list.filter(function (t) { return (t.title + " " + t.description + " " + catName(t.category)).toLowerCase().indexOf(q) >= 0; });
    if (q) html += '<p class="meta" style="margin-bottom:18px">' + list.length + " result" + (list.length === 1 ? "" : "s") + " for " + esc(q) + "</p>";
    if (!list.length) return html + '<div class="empty">' + icon("search") + "<h3>No topics found</h3><p>Try a different word or category.</p></div>";
    return html + '<div class="grid grid-3">' + list.map(topicCard).join("") + "</div>";
  }

  function renderTopic(route) {
    var t = topicBySlug[route.param];
    if (!t) return '<div class="empty">' + icon("book") + '<h3>Topic not found</h3><p>It may have been renamed. <a href="#/library" style="color:var(--accent)">Back to library</a></p></div>';
    var list = topicsOf(t.category);
    var idx = list.findIndex(function (x) { return x.id === t.id; });
    var prev = idx > 0 ? list[idx - 1] : null;
    var next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
    var done = isDone(t.id), booked = isBooked(t.id);

    var sections = t.sections.map(function (s) {
      var body = s.content.length > 1
        ? "<ul>" + s.content.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>"
        : "<p>" + esc(s.content[0]) + "</p>";
      var cls = "section" + (CALLOUT_RE.test(s.title) ? " callout" : "");
      return '<section class="' + cls + '" id="' + esc(slugify(s.title)) + '"><h2>' + esc(s.title) + "</h2>" + body + "</section>";
    }).join("");

    var toc = t.sections.length >= 5
      ? '<nav class="toc" aria-label="On this topic"><h2>In this topic</h2><ol>' +
          t.sections.map(function (s) {
            var sid = slugify(s.title);
            return '<li><a href="#' + esc(sid) + '" data-action="scroll" data-target="' + esc(sid) + '">' + esc(s.title) + "</a></li>";
          }).join("") + "</ol></nav>"
      : "";

    var related = (t.relatedTopics || []).map(function (id) {
      return topicBySlug[id] || TOPICS.filter(function (x) { return x.id === id; })[0];
    }).filter(Boolean).slice(0, 6);

    var html = '<div class="reader fade-in" style="--cat:' + catAccent(t.category) + '">' +
      '<div class="reader-top"><a class="back-btn" href="#/library/' + esc(t.category) + '">' + icon("back") + esc(catName(t.category)) + "</a>" +
        (done ? badgeDone() : "") + "</div>" +
      '<header class="reader-head"><div class="badges"><span class="badge"><span class="dot"></span>' + esc(catName(t.category)) + "</span>" +
        '<span class="badge">' + icon("clock") + t.readTime + " min</span>" + badgeXp(12) + "</div>" +
      "<h1>" + esc(t.title) + '</h1><p class="desc">' + esc(t.description) + "</p>" +
      '<div class="toolbar"><button class="tool-btn' + (done ? " done-on" : "") + '" data-action="toggle-done" data-id="' + esc(t.id) + '">' +
        icon("check") + (done ? "Completed" : "Mark as complete") + "</button>" +
      '<button class="tool-btn' + (booked ? " on" : "") + '" data-action="toggle-book" data-id="' + esc(t.id) + '">' +
        icon("bookmark") + (booked ? "Bookmarked" : "Bookmark") + "</button></div></header>" +
      toc + '<div class="sections">' + sections + "</div>";

    if (related.length) {
      html += '<div class="related"><div class="section-head" style="margin:0 0 16px"><h2>Related topics</h2></div>' +
        '<div class="grid grid-3">' + related.map(topicCard).join("") + "</div></div>";
    }
    html += '<div class="pager">' +
      (prev ? '<a href="#/topic/' + esc(prev.slug) + '"><span class="k">Previous</span><span class="v">' + esc(prev.title) + "</span></a>"
            : '<a class="disabled"><span class="k">Previous</span><span class="v">-</span></a>') +
      (next ? '<a class="next" href="#/topic/' + esc(next.slug) + '"><span class="k">Next</span><span class="v">' + esc(next.title) + "</span></a>"
            : '<a class="disabled next"><span class="k">Next</span><span class="v">-</span></a>') +
      "</div></div>";
    return html;
  }

  /* ---------------- quiz ---------------- */
  var quiz = null;
  function buildQuiz(catId) {
    var pool = topicsOf(catId).slice();
    if (pool.length < 4) return null;
    shuffle(pool);
    var n = Math.min(5, pool.length), qs = [];
    for (var i = 0; i < n; i++) {
      var correct = pool[i];
      var others = pool.filter(function (t) { return t.id !== correct.id; });
      shuffle(others);
      var opts = [{ title: correct.title, correct: true }];
      for (var j = 0; j < 3 && j < others.length; j++) opts.push({ title: others[j].title, correct: false });
      shuffle(opts);
      qs.push({ desc: correct.description, options: opts });
    }
    return { cat: catId, qs: qs, idx: 0, answers: [], done: false, score: 0, gained: 0 };
  }

  function renderQuiz() {
    if (!quiz) {
      var html = '<div class="section-head" style="margin-top:0"><div><span class="eyebrow">Test yourself</span>' +
        '<h2 style="margin-top:6px">Quiz</h2></div><span class="meta">' + state.quiz.correct + " correct so far</span></div>" +
        '<p style="color:var(--muted);max-width:64ch;margin-bottom:26px">Pick a module. You get 5 questions - each shows a description and asks which topic it belongs to. Right answers earn XP, and a perfect score earns a bonus.</p>';
      html += '<div class="grid grid-3">' + CATS.map(function (c) {
        return '<div class="card module-card" style="--cat:' + c.accent + '">' +
          '<div class="module-top"><span class="module-ico">' + icon(c.icon) + "</span>" +
          "<div><h3>" + esc(c.title) + '</h3><span class="mcount">' + topicsOf(c.id).length + " topics</span></div></div>" +
          '<button class="btn btn-primary" data-action="quiz-start" data-cat="' + esc(c.id) + '">' + icon("play") + "Start quiz</button></div>";
      }).join("") + "</div>";
      return html;
    }

    if (quiz.done) {
      var pct = Math.round((quiz.score / quiz.qs.length) * 100);
      var msg = pct === 100 ? "Perfect - flawless recall." : (pct >= 60 ? "Solid work. Keep going." : "Worth another look at this module.");
      return '<div class="quiz fade-in"><div class="quiz-card"><div class="result">' +
        '<div class="score">' + quiz.score + "<small>/" + quiz.qs.length + "</small></div>" +
        '<p class="msg">' + msg + "</p>" +
        '<div class="xp-gain">' + icon("bolt") + "+" + quiz.gained + " XP</div>" +
        '<div class="quiz-foot" style="justify-content:center;margin-top:26px">' +
          '<button class="btn btn-primary" data-action="quiz-retry">' + icon("refresh") + "Try again</button>" +
          '<button class="btn btn-ghost" data-action="quiz-home">' + icon("grid") + "Other modules</button></div>" +
      "</div></div></div>";
    }

    var q = quiz.qs[quiz.idx];
    var chosen = quiz.answers[quiz.idx];
    var answered = typeof chosen === "number";
    var dots = quiz.qs.map(function (_, i) {
      var c = "";
      if (typeof quiz.answers[i] === "number") c = quiz.qs[i].options[quiz.answers[i]].correct ? "ok" : "no";
      else if (i === quiz.idx) c = "now";
      return '<i class="' + c + '"></i>';
    }).join("");
    var options = q.options.map(function (o, i) {
      var cls = "option";
      if (answered) {
        if (o.correct) cls += " correct";
        else if (i === chosen) cls += " wrong";
      }
      return '<button class="' + cls + '" data-action="quiz-answer" data-idx="' + i + '"' + (answered ? " disabled" : "") + ">" +
        '<span class="key">' + String.fromCharCode(65 + i) + "</span>" + esc(o.title) + "</button>";
    }).join("");

    return '<div class="quiz fade-in">' +
      '<div class="quiz-head"><span class="badge"><span class="dot"></span>' + esc(catName(quiz.cat)) + "</span>" +
        '<span class="meta">Question ' + (quiz.idx + 1) + " of " + quiz.qs.length + "</span></div>" +
      '<div class="quiz-progress" style="margin-bottom:18px">' + dots + "</div>" +
      '<div class="quiz-card"><div class="q-label">Which topic is this?</div>' +
        '<div class="q-text">' + esc(q.desc) + "</div>" +
        '<div class="options">' + options + "</div>" +
        '<div class="quiz-foot"><button class="btn btn-ghost" data-action="quiz-home">' + icon("back") + "Exit</button>" +
          (answered ? '<button class="btn btn-primary" data-action="quiz-next">' + (quiz.idx === quiz.qs.length - 1 ? "See result" : "Next question") + icon("next") + "</button>" : "") +
        "</div></div></div>";
  }

  function quizAnswer(idx) {
    if (!quiz || quiz.done) return;
    if (typeof quiz.answers[quiz.idx] === "number") return;
    quiz.answers[quiz.idx] = idx;
    render();
  }
  function quizNext() {
    if (!quiz) return;
    if (quiz.idx < quiz.qs.length - 1) { quiz.idx++; render(); return; }
    var score = 0, gained = 0;
    quiz.qs.forEach(function (q, i) {
      var a = quiz.answers[i];
      if (typeof a === "number" && q.options[a].correct) { score++; gained += 6; }
    });
    if (score === quiz.qs.length) gained += 18;
    quiz.score = score; quiz.gained = gained; quiz.done = true;
    state.quiz.played++;
    state.quiz.correct += score;
    state.quiz.answered += quiz.qs.length;
    if (score === quiz.qs.length) state.quiz.perfect++;
    touchStreak();
    awardXp(gained, "Quiz complete");
    save();
    syncBadges();
    render();
  }

  /* ---------------- progress ---------------- */
  function renderProgress() {
    var li = levelInfo(state.xp);
    var booked = TOPICS.filter(function (t) { return isBooked(t.id); });
    var done = TOPICS.filter(function (t) { return isDone(t.id); });

    var html = '<div class="section-head" style="margin-top:0"><div><span class="eyebrow">Your journey</span>' +
      '<h2 style="margin-top:6px">Progress</h2></div><span class="meta">Level ' + li.level + " - " + esc(li.title) + "</span></div>";

    html += gameStrip();

    html += '<div class="stats" style="margin-top:16px">' + stat(doneCount(), "Topics completed") + stat(state.xp, "XP earned") +
      stat(state.badges.length + "/" + BADGES.length, "Achievements") + stat(state.quiz.played, "Quizzes taken") + "</div>";

    html += '<div class="section-head"><h2>Achievements</h2><span class="meta">' + state.badges.length + " of " + BADGES.length + ' unlocked</span></div><div class="ach-grid">';
    BADGES.forEach(function (b) {
      var un = state.badges.indexOf(b.id) >= 0;
      html += '<div class="ach ' + (un ? "unlocked" : "locked") + '"><span class="medal">' + icon(un ? b.icon : "lock") + "</span>" +
        "<b>" + esc(b.name) + "</b><span>" + esc(b.desc) + "</span></div>";
    });
    html += "</div>";

    html += '<div class="section-head"><h2>Module progress</h2></div><div class="grid grid-3">' + CATS.map(moduleCard).join("") + "</div>";

    html += '<div class="section-head"><h2>Bookmarked</h2><span class="meta">' + booked.length + " saved</span></div>";
    html += booked.length ? '<div class="grid grid-3">' + booked.map(topicCard).join("") + "</div>"
      : '<div class="empty">' + icon("bookmark") + "<h3>No bookmarks yet</h3><p>Tap bookmark on any topic to save it here.</p></div>";

    html += '<div class="section-head"><h2>Completed</h2><span class="meta">' + done.length + " done</span></div>";
    html += done.length ? '<div class="grid grid-3">' + done.map(topicCard).join("") + "</div>"
      : '<div class="empty">' + icon("check") + "<h3>Nothing completed yet</h3><p>Mark topics as complete to track progress.</p></div>";
    return html;
  }

  /* ---------------- render ---------------- */
  var app = document.getElementById("app");

  function renderHeader() {
    var li = levelInfo(state.xp);
    var chip = document.getElementById("level-chip");
    if (chip) {
      chip.innerHTML = '<span class="ring">' + ringSvg(li.pct, 30, 3.4).replace("<svg", '<svg class="ring"') + "</span>" +
        '<span class="lv"><b>Lv ' + li.level + "</b><small>" + esc(li.title) + "</small></span>";
    }
    var route = parseHash();
    var navKey = route.name === "topic" ? "library" : route.name;
    var nodes = document.querySelectorAll("[data-theme-set]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].classList.toggle("active", nodes[i].getAttribute("data-theme-set") === state.theme);
    }
    var links = document.querySelectorAll("[data-nav]");
    for (var j = 0; j < links.length; j++) {
      links[j].classList.toggle("active", links[j].getAttribute("data-nav") === navKey);
    }
  }

  function render() {
    var route = parseHash();
    var html;
    switch (route.name) {
      case "learn": html = renderLearn(); break;
      case "library": html = renderLibrary(route); break;
      case "topic": html = renderTopic(route); break;
      case "quiz": html = renderQuiz(); break;
      case "progress": html = renderProgress(); break;
      case "bookmarks": html = renderProgress(); break;
      default: html = renderHome();
    }
    app.innerHTML = html;
    app.classList.remove("fade-in");
    void app.offsetWidth;
    app.classList.add("fade-in");
    renderHeader();

    var rp = document.getElementById("reading-progress");
    if (route.name === "topic" && !rp) {
      rp = document.createElement("div");
      rp.id = "reading-progress";
      rp.className = "reading-progress";
      document.body.appendChild(rp);
    } else if (route.name !== "topic" && rp) {
      rp.parentNode.removeChild(rp);
    }
    updateReadingProgress();

    var mn = document.getElementById("mobile-nav");
    if (mn) mn.hidden = true;
    var mb = document.getElementById("menu-btn");
    if (mb) mb.setAttribute("aria-expanded", "false");

    window.scrollTo(0, 0);
  }

  function updateReadingProgress() {
    var rp = document.getElementById("reading-progress");
    if (!rp) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    rp.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + "%";
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
    if (action === "toggle-done") { toggleDone(el.getAttribute("data-id")); render(); return; }
    if (action === "toggle-book") { toggleBook(el.getAttribute("data-id")); render(); return; }
    if (action === "quiz-start") { quiz = buildQuiz(el.getAttribute("data-cat")); render(); return; }
    if (action === "quiz-answer") { quizAnswer(parseInt(el.getAttribute("data-idx"), 10)); return; }
    if (action === "quiz-next") { quizNext(); return; }
    if (action === "quiz-retry") { quiz = buildQuiz(quiz.cat); render(); return; }
    if (action === "quiz-home") { quiz = null; render(); return; }
  });

  var themeBtns = document.querySelectorAll("[data-theme-set]");
  for (var i = 0; i < themeBtns.length; i++) {
    (function (b) {
      b.addEventListener("click", function () { setTheme(b.getAttribute("data-theme-set")); });
    })(themeBtns[i]);
  }

  var menuBtn = document.getElementById("menu-btn");
  var mobileNav = document.getElementById("mobile-nav");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var open = mobileNav.hidden;
      mobileNav.hidden = !open;
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var searchInput = document.getElementById("search-input");
  var searchTimer;
  if (searchInput) {
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
        var v = searchInput.value.trim();
        location.hash = v ? "#/library?q=" + encodeURIComponent(v) : "#/library";
      }
    });
  }

  window.addEventListener("scroll", updateReadingProgress, { passive: true });
  window.addEventListener("hashchange", render);

  /* ---------------- boot ---------------- */
  document.documentElement.setAttribute("data-theme", state.theme || "paper");
  syncBadges();
  render();
})();
