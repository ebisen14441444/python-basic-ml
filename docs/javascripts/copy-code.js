(function () {
  const COPY_LABEL = "コピー";
  const COPIED_LABEL = "コピーしました";

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise((resolve, reject) => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }

  function addCopyButton(pre) {
    if (pre.dataset.copyReady === "1") {
      return;
    }
    const code = pre.querySelector("code");
    if (!code) {
      return;
    }

    pre.dataset.copyReady = "1";
    pre.classList.add("has-copy-button");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code-button";
    button.textContent = COPY_LABEL;
    button.setAttribute("aria-label", "コードをコピー");

    button.addEventListener("click", () => {
      const text = code.innerText;
      copyText(text).then(
        () => {
          button.textContent = COPIED_LABEL;
          button.classList.add("copied");
          setTimeout(() => {
            button.textContent = COPY_LABEL;
            button.classList.remove("copied");
          }, 1500);
        },
        () => {
          button.textContent = "コピー失敗";
          setTimeout(() => {
            button.textContent = COPY_LABEL;
          }, 1500);
        }
      );
    });

    pre.appendChild(button);
  }

  function enhanceAll() {
    document.querySelectorAll(".rst-content pre").forEach((pre) => {
      addCopyButton(pre);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhanceAll, { once: true });
  } else {
    enhanceAll();
  }

  // python-runner などが後からコードブロックを差し替える場合に備えて監視する
  const observer = new MutationObserver(() => {
    enhanceAll();
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
