(function () {
  function wrapH3Sections() {
    const content = document.querySelector(".rst-content");
    if (!content || content.dataset.sectionCardsReady === "true") {
      return;
    }

    const headings = Array.from(content.querySelectorAll("h3"));
    for (const heading of headings) {
      if (heading.closest(".section-card")) {
        continue;
      }

      const card = document.createElement("section");
      card.className = "section-card";
      heading.parentNode.insertBefore(card, heading);
      card.appendChild(heading);

      let node = card.nextSibling;
      while (node) {
        const next = node.nextSibling;
        if (node.nodeType === Node.ELEMENT_NODE && /^(H2|H3)$/.test(node.tagName)) {
          break;
        }
        card.appendChild(node);
        node = next;
      }
    }

    content.dataset.sectionCardsReady = "true";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wrapH3Sections);
  } else {
    wrapH3Sections();
  }
})();
