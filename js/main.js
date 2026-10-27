(function () {
  "use strict";

  /* Some mobile browsers restore the exact scroll position when a page is
     served from the back-forward cache (e.g. tapping the logo to "go home"
     can silently reuse a cached instance of index.html at its last scroll
     spot). The inline snippet in <head> handles the normal case; this
     covers the bfcache-restore case specifically. */
  window.addEventListener("pageshow", function (e) {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  });

  var root = document.documentElement;
  var nav = document.querySelector(".site-nav");

  /* Tapping the "H.AGUSHEFF" logo should always land at the very top of
     the homepage. If we're already on that exact page, most browsers treat
     a link to the same URL as a no-op (no reload happens at all), so the
     page-load fixes above never get a chance to run. Handle it directly. */
  var logoLinks = document.querySelectorAll(".nav-mark");
  Array.prototype.forEach.call(logoLinks, function (link) {
    link.addEventListener("click", function (e) {
      var linkUrl = link.href.split("#")[0].replace(/\/$/, "");
      var currentUrl = location.href.split("#")[0].replace(/\/$/, "");
      if (linkUrl === currentUrl) {
        e.preventDefault();
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
      /* Otherwise it's a real navigation to a different page — let it
         proceed normally; the <head> snippet handles landing at the top. */
    });
  });


  /* -------- mobile editorial menu -------- */
  var mobileMenu = document.getElementById("mobile-menu");
  var mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  var mobileMenuClose = document.querySelector(".mobile-menu-close");
  var mobileMenuBackdrop = document.querySelector(".mobile-menu-backdrop");
  var mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];

  function setMobileMenu(open){
    if (!mobileMenu || !mobileMenuToggle) return;
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
    mobileMenuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    mobileMenuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("mobile-menu-open", open);
  }
  if (mobileMenuToggle){
    mobileMenuToggle.addEventListener("click", function(){
      setMobileMenu(!mobileMenu.classList.contains("is-open"));
    });
  }
  if (mobileMenuClose) mobileMenuClose.addEventListener("click", function(){ setMobileMenu(false); });
  if (mobileMenuBackdrop) mobileMenuBackdrop.addEventListener("click", function(){ setMobileMenu(false); });
  Array.prototype.forEach.call(mobileMenuLinks, function(link){
    link.addEventListener("click", function(){ setMobileMenu(false); });
  });
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape") setMobileMenu(false);
  });

  /* -------- nav shrink on scroll -------- */
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* -------- hero copy lifts away on scroll -------- */
  var hero = document.querySelector(".hero");
  var heroCopy = Array.prototype.slice.call(document.querySelectorAll(".hero-copy-motion"));
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var heroTicking = false;

  function updateHeroScroll() {
    heroTicking = false;
    if (!hero || !heroCopy.length || reducedMotion) return;
    var progress = Math.max(0, Math.min(1, window.scrollY / Math.max(1, hero.offsetHeight * 0.72)));
    var eased = progress * progress * (3 - 2 * progress);
    var lift = -Math.round(eased * Math.min(150, hero.offsetHeight * 0.18));
    heroCopy.forEach(function(el){
      el.style.setProperty("--hero-scroll-y", lift + "px");
    });
  }

  function requestHeroScrollUpdate(){
    if (heroTicking) return;
    heroTicking = true;
    window.requestAnimationFrame(updateHeroScroll);
  }
  if (hero && heroCopy.length && !reducedMotion) {
    window.addEventListener("scroll", requestHeroScrollUpdate, {passive:true});
    window.addEventListener("resize", requestHeroScrollUpdate, {passive:true});
    updateHeroScroll();
  }

  /* -------- hero scroll cue hover --------
     A gentle desktop-only nudge: hovering the cue moves the page a little,
     giving the interaction a tactile invitation without affecting touch devices. */
  var heroScrollCue = document.querySelector(".hero-scroll");
  var workSection = document.getElementById("work");
  var hoverScrollLock = false;
  function scrollToWorkSection(){
    if (!workSection || hoverScrollLock) return;
    hoverScrollLock = true;
    var nav = document.querySelector(".site-nav");
    var navHeight = nav ? nav.getBoundingClientRect().height : 0;
    var target = Math.max(0, workSection.getBoundingClientRect().top + window.scrollY - navHeight - 12);
    window.scrollTo({ top: target, behavior: "smooth" });
    window.setTimeout(function(){ hoverScrollLock = false; }, 900);
  }
  if (heroScrollCue && workSection) {
    heroScrollCue.setAttribute("role", "button");
    heroScrollCue.setAttribute("tabindex", "0");
    heroScrollCue.addEventListener("click", scrollToWorkSection);
    heroScrollCue.addEventListener("keydown", function(e){
      if (e.key === "Enter" || e.key === " "){ e.preventDefault(); scrollToWorkSection(); }
    });
    if (window.matchMedia && window.matchMedia("(hover: hover)").matches) {
      heroScrollCue.addEventListener("mouseenter", scrollToWorkSection);
    }
  }

  /* -------- All Projects / project pages: back-to-top control -------- */
  if (document.querySelector(".all-projects-page") || document.querySelector(".proj-cover")) {
    var topBtn = document.createElement("button");
    topBtn.className = "back-to-top";
    topBtn.type = "button";
    topBtn.setAttribute("aria-label", "Back to top");
    topBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 19V5M6.5 10.5L12 5l5.5 5.5"/></svg>';
    document.body.appendChild(topBtn);
    function updateTopButton(){
      if (window.scrollY > 420) topBtn.classList.add("is-visible");
      else topBtn.classList.remove("is-visible");
    }
    window.addEventListener("scroll", updateTopButton, {passive:true});
    updateTopButton();
    topBtn.addEventListener("click", function(){
      window.scrollTo({top:0, behavior:"smooth"});
    });
  }

  /* -------- ambient color-bleed glow --------
     Any element with [data-color] becomes a candidate. As it crosses the
     center of the viewport, its dominant color becomes the glow color,
     mimicking colored stage light bleeding through a dark room. */
  var candidates = Array.prototype.slice.call(document.querySelectorAll("[data-color]"));

  if (candidates.length && "IntersectionObserver" in window) {
    var current = null;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
            var color = entry.target.getAttribute("data-color");
            if (color && color !== current) {
              current = color;
              root.style.setProperty("--glow-color", color);
            }
          }
        });
      },
      { threshold: [0, 0.35, 0.6, 1], rootMargin: "-30% 0px -30% 0px" }
    );

    candidates.forEach(function (el) {
      io.observe(el);
    });
  }

  /* -------- reveal on scroll -------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reveals.length && "IntersectionObserver" in window) {
    var revealIo = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) {
      revealIo.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }


  /* -------- justified project gallery -------- */
  function buildJustifiedGallery() {
    var gallery = document.querySelector(".proj-gallery");
    if (!gallery) return;

    Array.prototype.slice.call(gallery.querySelectorAll(":scope > .gallery-row, :scope > .row")).forEach(function(row){
      Array.prototype.slice.call(row.children).forEach(function(child){ gallery.appendChild(child); });
      row.remove();
    });
    var figures = Array.prototype.slice.call(gallery.querySelectorAll(":scope > figure"));
    if (!figures.length) return;

    var width = gallery.clientWidth;
    var viewportWidth = window.innerWidth;
    var gap = viewportWidth <= 900 ? 12 : Math.min(24, Math.max(12, width * 0.018));

    /* Phones use one image per row. This deliberately trades density for
       readability: portraits no longer become tiny columns and landscapes
       remain easy to scan. */
    if (viewportWidth <= 600) {
      figures.forEach(function(figure){
        var img = figure.querySelector('img');
        var ratio = parseFloat(figure.getAttribute('data-ratio'));
        if (!ratio && img && img.naturalWidth && img.naturalHeight) ratio = img.naturalWidth / img.naturalHeight;
        ratio = ratio || 1.5;
        var naturalHeight = width / ratio;
        var height = Math.round(Math.min(naturalHeight, window.innerHeight * 0.72));
        height = Math.max(180, height);
        var row = document.createElement('div');
        row.className = 'gallery-row';
        row.style.height = height + 'px';
        figure.style.flex = '0 0 100%';
        figure.style.width = '100%';
        row.appendChild(figure);
        gallery.appendChild(row);
      });
      return;
    }

    var target = viewportWidth <= 700 ? 250 : (viewportWidth <= 1100 ? 350 : 430);
    var maxItems = 4;
    var rows = [], current = [], ratioSum = 0;

    figures.forEach(function(figure){
      var img = figure.querySelector("img");
      var ratio = parseFloat(figure.getAttribute("data-ratio"));
      if (!ratio && img && img.naturalWidth && img.naturalHeight) ratio = img.naturalWidth / img.naturalHeight;
      ratio = ratio || 1.5;
      current.push({figure: figure, ratio: ratio});
      ratioSum += ratio;
      var proposedHeight = (width - (current.length - 1) * gap) / ratioSum;
      if ((proposedHeight <= target && current.length >= 2) || current.length >= maxItems){
        rows.push(current); current = []; ratioSum = 0;
      }
    });
    if (current.length){
      if (current.length === 1 && rows.length && rows[rows.length - 1].length < maxItems) rows[rows.length - 1].push(current[0]);
      else rows.push(current);
    }
    // Avoid an isolated final portrait/landscape whenever possible: rebalance the last two rows.
    if (rows.length > 1 && rows[rows.length - 1].length === 1 && rows[rows.length - 2].length > 2){
      rows[rows.length - 1].unshift(rows[rows.length - 2].pop());
    }

    rows.forEach(function(items){
      var row = document.createElement("div");
      row.className = "gallery-row";
      var sum = items.reduce(function(acc,item){ return acc + item.ratio; }, 0);
      var height = Math.min(620, Math.max(250, (width - (items.length - 1) * gap) / sum));
      row.style.height = Math.round(height) + "px";
      items.forEach(function(item){
        item.figure.style.flex = item.ratio + " 1 0";
        row.appendChild(item.figure);
      });
      gallery.appendChild(row);
    });
  }

  if (document.querySelector(".proj-gallery")){
    var galleryRefresh;
    var scheduleGallery = function(){
      clearTimeout(galleryRefresh);
      galleryRefresh = setTimeout(function(){ window.requestAnimationFrame(buildJustifiedGallery); }, 40);
    };
    if (document.readyState === "complete") scheduleGallery();
    else window.addEventListener("load", scheduleGallery, {once:true});
    window.addEventListener("resize", scheduleGallery, {passive:true});
  }

  /* -------- photo-derived glow behind project images -------- */
  document.querySelectorAll(".proj-gallery figure img").forEach(function (img) {
    var src = img.getAttribute("src");
    if (src) {
      img.parentElement.style.setProperty("--photo-bg", 'url("' + src.replace(/"/g, '\\"') + '")');
    }
  });

  /* -------- lightbox for project galleries -------- */
  var galleryImgs = Array.prototype.slice.call(document.querySelectorAll(".proj-gallery img, .all-projects-grid img"));
  if (galleryImgs.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML =
      '<button class="lightbox-close" aria-label="Close image">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 4l16 16M20 4L4 20"/></svg>' +
      "</button>" +
      '<img alt="">';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector("img");
    var lbClose = lb.querySelector(".lightbox-close");

    function openLb(src, alt) {
      lbImg.src = src;
      lbImg.alt = alt || "";
      lb.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function closeLb() {
      lb.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    galleryImgs.forEach(function (img) {
      img.addEventListener("click", function () {
        openLb(img.getAttribute("data-full") || img.src, img.alt);
      });
    });
    lbClose.addEventListener("click", closeLb);
    lb.addEventListener("click", function (e) {
      if (e.target === lb) closeLb();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLb();
    });
  }

  /* -------- project-only cross-page swipe --------
     Only cover cards opt into the directional project transition. Header,
     menu and other links keep normal browser navigation. */
  var projectLinks = document.querySelectorAll('a.work-feature[href]');
  Array.prototype.forEach.call(projectLinks, function(link){
    link.addEventListener('click', function(e){
      if (e.defaultPrevented || (e.button !== undefined && e.button !== 0) || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var href = link.href;
      if (!href || href.indexOf(location.origin) !== 0) return;
      e.preventDefault();
      try { sessionStorage.setItem('hagusheff-project-swipe','1'); } catch(err) {}
      document.documentElement.classList.add('project-swipe-leaving');
      // Keep the cover fully opaque while it moves left.
      link.style.transform = 'translateX(-100%)';
      link.style.transition = 'transform 520ms cubic-bezier(.65,0,.35,1)';
      window.setTimeout(function(){ location.href = href; }, 500);
    });
  });

  var projectSwipeEnter = false;
  try {
    projectSwipeEnter = sessionStorage.getItem('hagusheff-project-swipe') === '1';
    if (projectSwipeEnter) sessionStorage.removeItem('hagusheff-project-swipe');
  } catch(err) {}
  if (projectSwipeEnter) document.documentElement.classList.add('project-swipe-enter');


  /* v32: directional mobile section swipe — one gesture = one scene */
  if (window.matchMedia && window.matchMedia("(max-width: 780px)").matches && !(window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    var snapScenes = Array.prototype.slice.call(document.querySelectorAll("main > .hero, main > #work > .work-feature-list > .work-feature, main > #work > .work-feature-list > .work-feature-row > .work-feature, main > #about, footer#contact"));
    var touchStartY = null, touchStartX = null, touchHandled = false;
    function currentSceneIndex(){
      if (!snapScenes.length) return 0;
      var y = window.scrollY + 2;
      var idx = 0;
      for (var i = 0; i < snapScenes.length; i++) {
        var top = snapScenes[i].getBoundingClientRect().top + window.scrollY;
        if (top <= y) idx = i; else break;
      }
      return idx;
    }
    function goToScene(i){
      i=Math.max(0,Math.min(snapScenes.length-1,i));
      snapScenes[i].scrollIntoView({behavior:"smooth",block:"start"});
    }
    window.addEventListener("touchstart",function(e){
      if(e.touches.length!==1)return; touchStartY=e.touches[0].clientY; touchStartX=e.touches[0].clientX; touchHandled=false;
    },{passive:true});
    window.addEventListener("touchend",function(e){
      if(touchStartY===null || !e.changedTouches.length)return;
      var dy=e.changedTouches[0].clientY-touchStartY, dx=e.changedTouches[0].clientX-touchStartX; touchStartY=null;
      if(Math.abs(dy)<48 || Math.abs(dy)<=Math.abs(dx)*1.15)return;
      var idx=currentSceneIndex();
      if(dy<0) goToScene(idx+1); else goToScene(idx-1);
      touchHandled=true;
    },{passive:true});
  }

  /* -------- project page: cover + header slide in from the right on load -------- */
  var enterEls = Array.prototype.slice.call(document.querySelectorAll('.proj-enter-slide'));
  if (enterEls.length) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      enterEls.forEach(function(el){ el.classList.add('is-in'); });
    } else {
      window.requestAnimationFrame(function(){
        window.requestAnimationFrame(function(){
          enterEls.forEach(function(el){ el.classList.add('is-in'); });
        });
      });
    }
  }

})();