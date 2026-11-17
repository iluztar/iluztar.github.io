(function () {
  "use strict";

  /* ---------------- footer year ---------------- */
  var yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- contact form: real submission to api/contact.php ---------------- */
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    // the success message is a sibling shown in the form's place after submit,
    // not a descendant — look it up from the shared wrapper instead.
    var contactWrap = document.getElementById("contact-form-wrap") || contactForm.parentElement;
    var submitBtn = contactForm.querySelector('button[type="submit"]');
    var errorBox = contactForm.querySelector("[data-contact-error]");
    var successBox = contactWrap.querySelector("[data-contact-success]");

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (errorBox) { errorBox.textContent = ""; errorBox.classList.add("hidden"); }

      var data = {
        name: contactForm.elements.name.value,
        email: contactForm.elements.email.value,
        service: contactForm.elements.service.value,
        budget: contactForm.elements.budget.value,
        message: contactForm.elements.message.value,
        website: contactForm.elements.website ? contactForm.elements.website.value : "", // honeypot
      };

      if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add("opacity-50"); }

      var apiBase = window.ILUZTAR_API_BASE || "/api/"; // injected by includes/header.php
      fetch(apiBase + "contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (res) { return res.json().then(function (json) { return { status: res.status, json: json }; }); })
        .then(function (result) {
          if (result.json && result.json.ok) {
            contactForm.reset();
            contactForm.hidden = true;
            if (successBox) successBox.classList.remove("hidden");
          } else if (errorBox) {
            errorBox.textContent = (result.json && result.json.msg) || "Something went wrong. Please try again.";
            errorBox.classList.remove("hidden");
          }
        })
        .catch(function () {
          if (errorBox) {
            errorBox.textContent = "Network error — please check your connection and try again.";
            errorBox.classList.remove("hidden");
          }
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove("opacity-50"); }
        });
    });
  }

  /* ---------------- newsletter form: real submission to api/subscribe.php ---------------- */
  var newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    var newsletterWrap = document.getElementById("newsletter-form-wrap") || newsletterForm.parentElement;
    var nfSubmitBtn = newsletterForm.querySelector('button[type="submit"]');
    var nfErrorBox = newsletterForm.querySelector("[data-newsletter-error]");
    var nfSuccessBox = newsletterWrap.querySelector("[data-newsletter-success]");

    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (nfErrorBox) { nfErrorBox.textContent = ""; nfErrorBox.classList.add("hidden"); }

      var data = {
        email: newsletterForm.elements.email.value,
        website: newsletterForm.elements.website ? newsletterForm.elements.website.value : "", // honeypot
      };

      if (nfSubmitBtn) { nfSubmitBtn.disabled = true; nfSubmitBtn.classList.add("opacity-50"); }

      var apiBase = window.ILUZTAR_API_BASE || "/api/"; // injected by includes/header.php
      fetch(apiBase + "subscribe.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (res) { return res.json().then(function (json) { return { status: res.status, json: json }; }); })
        .then(function (result) {
          if (result.json && result.json.ok) {
            newsletterForm.reset();
            newsletterForm.hidden = true;
            if (nfSuccessBox) nfSuccessBox.classList.remove("hidden");
          } else if (nfErrorBox) {
            nfErrorBox.textContent = (result.json && result.json.msg) || "Something went wrong. Please try again.";
            nfErrorBox.classList.remove("hidden");
          }
        })
        .catch(function () {
          if (nfErrorBox) {
            nfErrorBox.textContent = "Network error — please check your connection and try again.";
            nfErrorBox.classList.remove("hidden");
          }
        })
        .finally(function () {
          if (nfSubmitBtn) { nfSubmitBtn.disabled = false; nfSubmitBtn.classList.remove("opacity-50"); }
        });
    });
  }

  /* ---------------- comments: submission to api/comments.php (top-level + replies) ---------------- */
  var cList = document.getElementById("comments-list");
  if (cList) {
    var cEmpty = document.getElementById("comments-empty");
    var apiBase = window.ILUZTAR_API_BASE || "/api/"; // injected by includes/header.php

    // Bilingual strings rendered server-side onto #comments-list (see
    // ilz_comments_section() in includes/components.php) — read once here
    // so comments/replies added live match the page's language instead of
    // always showing English regardless of site language.
    var i18n = {
      like: cList.dataset.likeLabel || "Like this comment",
      reply: cList.dataset.replyLabel || "Reply",
      name: cList.dataset.nameLabel || "Name",
      message: cList.dataset.messageLabel || "Reply",
      postReply: cList.dataset.postReplyLabel || "Post reply",
    };

    function replyFormHtml(pageType, pageId, parentId) {
      return (
        '<div class="hidden" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>' +
        '<div class="isolate -space-y-px rounded-2xl bg-white">' +
          '<div class="group relative z-0 transition-all focus-within:z-10">' +
            '<input name="name" type="text" maxlength="80" required placeholder=" " autocomplete="name" class="peer reply-name-input block w-full border border-neutral-300 bg-transparent px-6 pb-4 pt-12 text-base/6 text-neutral-950 ring-4 ring-transparent transition focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5" style="border-radius:1rem 1rem 0 0">' +
            '<label class="pointer-events-none absolute left-6 top-1/2 -mt-3 origin-left text-base/6 text-neutral-500 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-neutral-950 peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-neutral-950">' + i18n.name + '</label>' +
          '</div>' +
          '<div class="group relative z-0 transition-all focus-within:z-10">' +
            '<textarea name="message" rows="3" maxlength="1000" required placeholder=" " class="peer reply-message-input block w-full resize-none border border-neutral-300 bg-transparent px-6 pb-4 pt-12 text-base/6 text-neutral-950 ring-4 ring-transparent transition focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5" style="border-radius:0 0 1rem 1rem"></textarea>' +
            '<label class="pointer-events-none absolute left-6 top-6 origin-left text-base/6 text-neutral-500 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-neutral-950 peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-neutral-950">' + i18n.message + '</label>' +
          '</div>' +
        '</div>' +
        '<p class="mt-3 hidden text-sm font-semibold text-red-600" data-comment-error></p>' +
        '<p class="mt-3 hidden text-sm text-neutral-600" data-comment-pending></p>' +
        '<button type="submit" class="mt-3 inline-flex rounded-full px-4 py-1.5 text-xs font-semibold transition bg-neutral-950 text-white hover:bg-neutral-800"><span>' + i18n.postReply + '</span></button>'
      );
    }

    function likeButtonHtml(id) {
      return (
        '<button type="button" class="comment-like-btn inline-flex items-center gap-x-1 text-xs font-semibold text-neutral-500 transition hover:text-neutral-950" data-comment-id="' + id + '" aria-label="' + i18n.like + '">' +
          '<svg viewBox="0 0 20 20" class="comment-like-icon h-3.5 w-3.5 fill-none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 8.5v8h-2a1 1 0 01-1-1v-6a1 1 0 011-1h2zm0 0l3.5-6a1.8 1.8 0 013 1.3v3.2H15a1.5 1.5 0 011.45 1.87l-1.2 4.8A2 2 0 0113.31 16.5H8.5a2 2 0 01-2-2V8.5z"></path></svg>' +
          '<span class="comment-like-count">0</span>' +
        '</button>'
      );
    }

    function newCommentLiHtml(pageType, pageId, id) {
      return (
        '<div class="flex items-center justify-between gap-x-4">' +
          '<p class="font-display text-sm font-semibold text-neutral-950"></p>' +
          '<time class="flex-none text-xs text-neutral-500"></time>' +
        '</div>' +
        '<p class="mt-2 text-sm text-neutral-600" style="white-space:pre-line"></p>' +
        '<div class="mt-3 flex items-center gap-x-4">' +
          likeButtonHtml(id) +
          '<button type="button" class="comment-reply-btn text-xs font-semibold text-neutral-500 transition hover:text-neutral-950" data-comment-id="' + id + '">' + i18n.reply + '</button>' +
        '</div>' +
        '<form class="comment-reply-form mt-4 hidden" data-page-type="' + pageType + '" data-page-id="' + pageId + '" data-parent-id="' + id + '">' + replyFormHtml(pageType, pageId, id) + '</form>' +
        '<ul class="comment-replies-list mt-6 border-l-2 border-neutral-950/10 pl-6" data-parent-id="' + id + '"></ul>'
      );
    }

    function submitComment(form, extraFields) {
      var errorBox = form.querySelector("[data-comment-error]");
      var pendingBox = form.querySelector("[data-comment-pending]");
      var submitBtn = form.querySelector('button[type="submit"]');
      if (errorBox) { errorBox.textContent = ""; errorBox.classList.add("hidden"); }
      if (pendingBox) pendingBox.classList.add("hidden");

      var data = {
        page_type: form.dataset.pageType,
        page_id: form.dataset.pageId || "",
        name: form.elements.name.value,
        message: form.elements.message.value,
        website: form.elements.website ? form.elements.website.value : "", // honeypot
      };
      for (var k in extraFields) data[k] = extraFields[k];

      if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add("opacity-50"); }

      return fetch(apiBase + "comments.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (res) { return res.json().then(function (json) { return { status: res.status, json: json }; }); })
        .then(function (result) {
          if (result.json && result.json.ok) {
            form.reset();
            if (result.json.pending) {
              // The top-level form's pending message is pre-rendered bilingually by
              // PHP — only fill it from the API response if it's a JS-built reply
              // form, so the localized SSR text is never overwritten with English.
              if (pendingBox) {
                if (!pendingBox.textContent.trim()) pendingBox.textContent = cList.dataset.replyPendingMsg || result.json.msg || "Thanks! Your comment will appear after admin review.";
                pendingBox.classList.remove("hidden");
              }
            }
          } else if (errorBox) {
            errorBox.textContent = (result.json && result.json.msg) || "Something went wrong. Please try again.";
            errorBox.classList.remove("hidden");
          }
          return result;
        })
        .catch(function () {
          if (errorBox) {
            errorBox.textContent = "Network error — please check your connection and try again.";
            errorBox.classList.remove("hidden");
          }
          return { json: { ok: false } };
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove("opacity-50"); }
        });
    }

    // Comment count badge next to the "Comments" heading — bumped by one on
    // every successful (non-pending) post so it stays in sync without a
    // page reload.
    function bumpCommentCount() {
      var badge = document.getElementById("comments-count-badge");
      if (!badge) return;
      var n = (parseInt((badge.textContent || "").replace(/[^\d]/g, ""), 10) || 0) + 1;
      badge.textContent = "(" + n + ")";
    }

    // Top-level comment form.
    var commentForm = document.getElementById("comment-form");
    if (commentForm) {
      commentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        submitComment(commentForm, {}).then(function (result) {
          if (result.json && result.json.ok && !result.json.pending && result.json.comment) {
            if (cEmpty) cEmpty.hidden = true;
            var li = document.createElement("li");
            li.className = "rounded-2xl bg-neutral-50 p-6";
            li.dataset.commentId = result.json.comment.id;
            li.innerHTML = newCommentLiHtml(commentForm.dataset.pageType, commentForm.dataset.pageId || "", result.json.comment.id);
            li.querySelector("p.font-display").textContent = result.json.comment.name;
            li.querySelector("time").textContent = "Just now";
            li.querySelector("p.mt-2").textContent = result.json.comment.message;
            cList.insertBefore(li, cList.firstChild);
            bumpCommentCount();
          }
        });
      });
    }

    // Reply toggle + reply form submission (event delegation — comment
    // items, including ones added live above, are created dynamically).
    cList.addEventListener("click", function (e) {
      var btn = e.target.closest(".comment-reply-btn");
      if (!btn) return;
      var parentLi = btn.closest("li");
      var form = parentLi ? parentLi.querySelector(":scope > .comment-reply-form") : null;
      if (form) {
        form.classList.toggle("hidden");
        if (!form.classList.contains("hidden")) {
          var nameInput = form.querySelector(".reply-name-input");
          if (nameInput) nameInput.focus();
        }
      }
    });

    cList.addEventListener("submit", function (e) {
      var form = e.target.closest(".comment-reply-form");
      if (!form) return;
      e.preventDefault();
      submitComment(form, { parent_id: form.dataset.parentId }).then(function (result) {
        if (result.json && result.json.ok && !result.json.pending && result.json.comment) {
          var repliesList = form.parentElement.querySelector('.comment-replies-list[data-parent-id="' + form.dataset.parentId + '"]');
          if (repliesList) {
            var li = document.createElement("li");
            li.className = "rounded-xl bg-white p-4";
            li.dataset.commentId = result.json.comment.id;
            li.innerHTML =
              '<div class="flex items-center justify-between gap-x-4">' +
                '<p class="font-display text-sm font-semibold text-neutral-950"></p>' +
                '<time class="flex-none text-xs text-neutral-500"></time>' +
              '</div>' +
              '<p class="mt-2 text-sm text-neutral-600" style="white-space:pre-line"></p>' +
              '<div class="mt-2">' + likeButtonHtml(result.json.comment.id) + '</div>';
            li.querySelector("p.font-display").textContent = result.json.comment.name;
            li.querySelector("time").textContent = "Just now";
            li.querySelector("p.mt-2").textContent = result.json.comment.message;
            repliesList.appendChild(li);
            bumpCommentCount();
          }
          form.classList.add("hidden");
        }
      });
    });

    // Like button — one like per visitor per comment enforced server-side;
    // localStorage just remembers the "liked" look across page reloads so
    // the button doesn't invite a pointless repeat click.
    var LIKED_KEY = "iluztar_liked_comments";
    function getLikedIds() {
      try { return JSON.parse(localStorage.getItem(LIKED_KEY) || "[]"); } catch (e) { return []; }
    }
    function markLiked(id) {
      var ids = getLikedIds();
      if (ids.indexOf(id) === -1) {
        ids.push(id);
        try { localStorage.setItem(LIKED_KEY, JSON.stringify(ids)); } catch (e) {}
      }
    }
    getLikedIds().forEach(function (id) {
      var btn = cList.querySelector('.comment-like-btn[data-comment-id="' + id + '"]');
      if (btn) btn.classList.add("is-liked");
    });

    cList.addEventListener("click", function (e) {
      var btn = e.target.closest(".comment-like-btn");
      if (!btn || btn.classList.contains("is-liked")) return;
      var id = btn.dataset.commentId;
      btn.classList.add("is-liked");
      markLiked(id);
      fetch(apiBase + "comments.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ like_id: id }),
      })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (json && json.ok) {
            var countEl = btn.querySelector(".comment-like-count");
            if (countEl) countEl.textContent = json.likes;
          }
        })
        .catch(function () {});
    });

    // "Show more comments" — reveals the next hidden batch of top-level
    // threads (server hides everything past the first batch so the page
    // doesn't ship one huge unbroken list). Scoped to direct children only
    // so it never touches a reply <li> nested inside a thread.
    var showMoreBtn = document.getElementById("comments-show-more");
    if (showMoreBtn) {
      var showMoreCountEl = document.getElementById("comments-show-more-count");
      var batchSize = parseInt(showMoreBtn.dataset.batchSize, 10) || 5;
      showMoreBtn.addEventListener("click", function () {
        var hiddenItems = Array.prototype.slice.call(cList.querySelectorAll(":scope > li.hidden"));
        hiddenItems.slice(0, batchSize).forEach(function (li) { li.classList.remove("hidden"); });
        var remaining = hiddenItems.length - batchSize;
        if (remaining > 0) {
          if (showMoreCountEl) showMoreCountEl.textContent = "(" + remaining + ")";
        } else {
          showMoreBtn.parentElement.remove();
        }
      });
    }
  }
})();
