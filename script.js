/* ==========================================================================
   DBY 的手账 · 交互脚本
   ========================================================================== */
(function () {
  "use strict";

  const html = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 顶部日期与年份 ---------- */
  const now = new Date();
  const dateEl = document.getElementById("today-date");
  const weekdayEl = document.getElementById("today-weekday");
  const yearEl = document.getElementById("year");

  if (dateEl) {
    dateEl.textContent = `${String(now.getMonth() + 1).padStart(2, "0")} / ${String(now.getDate()).padStart(2, "0")}`;
  }
  if (weekdayEl) {
    weekdayEl.textContent = new Intl.DateTimeFormat("zh-CN", { weekday: "long" }).format(now);
  }
  if (yearEl) {
    yearEl.textContent = String(now.getFullYear());
  }

  /* ---------- 移动端菜单 ---------- */
  const nav = document.getElementById("main-nav");
  const navToggle = document.querySelector(".nav-toggle");

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "打开菜单");
  }

  function openNav() {
    if (!nav || !navToggle) return;
    nav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "关闭菜单");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || navToggle.contains(event.target)) return;
      closeNav();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
        navToggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeNav();
    });
  }

  /* ---------- 滚动高亮当前导航 ---------- */
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sectionIds = ["top", "about", "recommend", "contact"];
  const sections = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  let navTicking = false;

  function setActiveNav(id) {
    navLinks.forEach(function (link) {
      const isActive = link.getAttribute("href") === "#" + id;
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateActiveNav() {
    const marker = window.scrollY + Math.min(window.innerHeight * 0.32, 260);
    let currentId = "top";

    sections.forEach(function (section) {
      if (section.offsetTop <= marker) currentId = section.id;
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) {
      currentId = sections[sections.length - 1].id;
    }

    setActiveNav(currentId);
    navTicking = false;
  }

  function onScroll() {
    if (!navTicking) {
      navTicking = true;
      window.requestAnimationFrame(updateActiveNav);
    }
  }

  if (sections.length) {
    updateActiveNav();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  /* ---------- 滚动入场 ---------- */
  const revealEls = Array.from(document.querySelectorAll(".reveal"));

  if (revealEls.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      html.classList.add("reveal-ready");
      const revealObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.07, rootMargin: "0px 0px -7% 0px" }
      );

      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });
    }
  }

  /* ---------- 推荐内容数据 ---------- */
  const recommendations = {
    zhuangzi: {
      kicker: "BOOK 01 · 哲学随笔 · 推荐阅读",
      title: "《庄子》",
      meta: "庄子 · 战国 · 中华书局 / 陈鼓应 今注今译",
      page: "01",
      body: [
        "如果只带一本书去荒岛，我可能会带《庄子》。里面的故事大多不太“正经”：会说话的鱼、做梦的蝴蝶、长在路边却没人理的树。但读着读着会发现，很多困住我们的问题，只是因为我们站得太近。",
        "我没有按顺序从头读到尾，而是把它放在床头，随手翻一则。焦虑的时候读《秋水》，钻牛角尖的时候读《齐物论》。它不负责给答案，只负责把问题放宽一点。",
        "如果你第一次认真读，推荐陈鼓应的《庄子今注今译》——注释友好，不会一上来就被古文劝退。"
      ],
      scene: "想不通的时候 / 睡前读一则 / 地铁上发会儿呆",
      find: "各大书店与图书馆。搜索「庄子今注今译 陈鼓应」即可。",
      memo: "别急着分辨对错，先把问题放一放。"
    },
    mingchao: {
      kicker: "BOOK 02 · 通俗历史 · 推荐阅读",
      title: "《明朝那些事儿》",
      meta: "当年明月 · 中国 · 通俗历史",
      page: "02",
      body: [
        "当年明月把明朝从洪武开国到崇祯落幕的兴衰，写成了一套可以当故事读的历史。朱元璋、朱棣、于谦、张居正、王阳明……这些名字不再只是考点，而是带着脾气、缺点和选择的活人。",
        "我喜欢它的一点，是作者不假装历史只有一种解释。他会在正经叙事里突然插一句吐槽，也会在好笑的地方停一下，认真说一句“历史其实很残酷”。笑过之后，反而更容易记住那些代价。",
        "如果历史书总让你读不过前三页，可以试试这套。它不是最严谨的学术著作，但很适合作为走进明史的第一扇门。"
      ],
      scene: "通勤路上 / 睡前读一章 / 想换换脑子时",
      find: "各大书店、图书馆与电子书平台。",
      memo: "历史很好笑，但历史从不轻飘。"
    },
    bailuyuan: {
      kicker: "BOOK 03 · 当代长篇小说 · 推荐阅读",
      title: "《白鹿原》",
      meta: "陈忠实 · 中国 · 长篇小说",
      page: "03",
      body: [
        "白嘉轩与鹿子霖，白鹿两家在渭河平原上的恩怨，从清末一直铺到二十世纪中叶。婚丧嫁娶、土地、祠堂、革命、饥荒，每一件事都落在具体的人身上，没有一句是轻飘飘的。",
        "读它需要一点耐心。人物多，方言密，前几章像在走一条很长的土路。但走着走着，那些人的呼吸就贴近了。你会记住白嘉轩的腰杆，也会记住田小娥的沉默。",
        "它不负责让人舒服，却让人明白：所谓乡土，不只是风景，也是几代人共同背负的东西。"
      ],
      scene: "长假 / 安静的夜晚 / 愿意慢读的时候",
      find: "各大书店、图书馆与电子书平台。",
      memo: "有些土地，长庄稼，也长命运。"
    },
    liuzhu: {
      kicker: "MUSIC 01 · 独立流行 · 推荐收听",
      title: "《我用什么把你留住》",
      meta: "福禄寿 FloruitShow · 中国 · 独立流行",
      page: "04",
      body: [
        "第一次听《我用什么把你留住》，是在一个很普通的晚上。前奏慢慢铺开，主唱的声音像从很远的地方传来，唱的是挽留，却没有声嘶力竭。",
        "我喜欢它把“不舍”处理得很克制。没有大哭大闹，只是一遍遍问“我用什么把你留住”。有些告别就是这样，明明知道留不住，还是想再问一次。",
        "适合在夜里独自走路时听。听完会想起一些已经走远的人，也会更想珍惜还在身边的人。"
      ],
      scene: "夜里走路 / 一个人发呆 / 想念谁的时候",
      find: "在各大音乐平台搜索「福禄寿 我用什么把你留住」。",
      memo: "留不住也没关系，记得曾经认真留过。"
    },
    merrychristmas: {
      kicker: "MUSIC 02 · 电影原声 · 推荐收听",
      title: "Merry Christmas Mr. Lawrence",
      meta: "坂本龙一 · 1983 · 电影原声",
      page: "05",
      body: [
        "这是电影《战场上的快乐圣诞》的主题曲，也是坂本龙一最被熟悉的作品之一。钢琴的旋律很简单，却有一种慢慢落雪的感觉，安静得让人不敢大声呼吸。",
        "我常常在写东西写不下去的时候放它。它不催促，也不安慰，只是陪着。主题一次次回来，像同一句话被反复轻声说出，最后落在一种很平静的惆怅里。",
        "如果只选一首坂本龙一入门，我会选它。不是最复杂的，却是最容易让人记住的。"
      ],
      scene: "下雪的冬天 / 深夜写字 / 需要安静的时候",
      find: "在各大音乐平台搜索「Merry Christmas Mr. Lawrence 坂本龙一」。",
      memo: "有些告别，不需要歌词。"
    },
    pipa: {
      kicker: "MUSIC 03 · 古风诗词 · 推荐收听",
      title: "《琵琶行》",
      meta: "奇然 · 古风 / 诗词歌曲",
      page: "06",
      body: [
        "第一次听《琵琶行》，是被那句“同是天涯沦落人，相逢何必曾相识”击中的。奇然的声线清亮，唱这种带一点怅惘的长句，像在灯下慢慢展开一封旧信。",
        "原诗很长，但歌没有把它唱成生硬的背诵。旋律顺着诗句的停顿走，琵琶的颗粒感也在，听着听着，课本里那些需要注解的句子，忽然就有了画面和温度。",
        "适合在夜里戴耳机听。不一定非要听懂每一个典故，先让那句“江州司马青衫湿”落在心里就好。"
      ],
      scene: "夜里戴耳机 / 通勤发呆 / 想读诗的时候",
      find: "在各大音乐平台搜索「奇然 琵琶行」。",
      memo: "有些诗，读一遍是字，听一遍才是人。"
    }
  };

  /* ---------- 推荐详情弹窗 ---------- */
  const dialog = document.getElementById("rec-dialog");
  const dialogKicker = document.getElementById("dialog-kicker");
  const dialogTitle = document.getElementById("dialog-title");
  const dialogMeta = document.getElementById("dialog-meta");
  const dialogBody = document.getElementById("dialog-body");
  const dialogScene = document.getElementById("dialog-scene");
  const dialogFind = document.getElementById("dialog-find");
  const dialogMemo = document.getElementById("dialog-memo");
  const dialogPage = document.getElementById("dialog-page");
  const dialogClose = dialog ? dialog.querySelector(".dialog-close") : null;
  let dialogOpener = null;

  function openRecommendation(id, opener) {
    const data = recommendations[id];
    if (!data || !dialog) return;

    dialogKicker.textContent = data.kicker;
    dialogTitle.textContent = data.title;
    dialogMeta.textContent = data.meta;
    dialogBody.innerHTML = data.body.map(function (paragraph) {
      return "<p>" + paragraph + "</p>";
    }).join("");
    dialogScene.textContent = data.scene;
    dialogFind.textContent = data.find;
    dialogMemo.textContent = data.memo;
    dialogPage.textContent = data.page;

    dialogOpener = opener;
    closeNav();

    if (typeof dialog.showModal === "function") {
      if (dialog.open) dialog.close();
      dialog.showModal();
      document.body.classList.add("is-locked");
      if (dialogClose) dialogClose.focus();
      dialog.querySelector(".dialog-paper").scrollTop = 0;
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function closeRecommendation() {
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      document.body.classList.remove("is-locked");
    }
  }

  document.querySelectorAll(".rec-card").forEach(function (card) {
    card.addEventListener("click", function () {
      openRecommendation(card.dataset.rec, card);
    });
  });

  if (dialog) {
    if (dialogClose) {
      dialogClose.addEventListener("click", closeRecommendation);
    }

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeRecommendation();
    });

    dialog.addEventListener("close", function () {
      document.body.classList.remove("is-locked");
      if (dialogOpener && document.contains(dialogOpener)) {
        dialogOpener.focus({ preventScroll: true });
      }
      dialogOpener = null;
    });
  }

  /* ---------- 复制 GitHub 链接 ---------- */
  const copyButton = document.querySelector("[data-copy-link]");
  const githubUrl = "https://github.com/ddby2022";
  const toast = document.getElementById("toast");
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2600);
  }

  function legacyCopy(text) {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.top = "-9999px";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    let succeeded = false;
    try {
      succeeded = document.execCommand("copy");
    } catch (error) {
      succeeded = false;
    }
    document.body.removeChild(helper);
    return succeeded;
  }

  if (copyButton) {
    copyButton.addEventListener("click", function () {
      const onSuccess = function () {
        copyButton.classList.add("is-copied");
        window.setTimeout(function () {
          copyButton.classList.remove("is-copied");
        }, 1800);
        showToast("GitHub 链接已复制，等你来玩。");
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(githubUrl).then(onSuccess).catch(function () {
          if (legacyCopy(githubUrl)) {
            onSuccess();
          } else {
            showToast("复制失败，链接是 " + githubUrl);
          }
        });
      } else if (legacyCopy(githubUrl)) {
        onSuccess();
      } else {
        showToast("复制失败，链接是 " + githubUrl);
      }
    });
  }

  /* ---------- 年份兜底 ---------- */
  if (!html.classList.contains("js")) {
    html.classList.add("js");
  }
})();
