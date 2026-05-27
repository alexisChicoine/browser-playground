const STORAGE_KEY = "browser-playground";
const THEME_KEY = "theme";
const COUNTER_KEY = "counter";

const ITEMS = [
  "Alpha module",
  "Beta handler",
  "Gamma service",
  "Delta worker",
  "Epsilon cache",
  "Zeta router",
];

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveState(partial) {
  const next = { ...loadState(), ...partial };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) ?? "light";
  document.documentElement.dataset.theme = saved;
  const toggle = document.getElementById("theme-toggle");
  toggle.setAttribute("aria-pressed", saved === "dark" ? "true" : "false");
  toggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem(THEME_KEY, next);
    toggle.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
    console.info("[playground] theme:", next);
  });
}

function initNav() {
  const links = document.querySelectorAll(".nav-link");
  const panels = document.querySelectorAll(".panel");

  function showPanel(id) {
    panels.forEach((panel) => {
      const active = panel.dataset.panel === id;
      panel.hidden = !active;
      panel.classList.toggle("active", active);
    });
    links.forEach((link) => {
      link.classList.toggle("active", link.dataset.nav === id);
    });
    history.replaceState(null, "", `#${id}`);
    console.info("[playground] navigated to:", id);
  }

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      showPanel(link.dataset.nav);
    });
  });

  window.addEventListener("hashchange", () => {
    const hash = location.hash.replace("#", "") || "home";
    if (["home", "forms", "network", "scroll"].includes(hash)) {
      showPanel(hash);
    }
  });

  const hash = location.hash.replace("#", "") || "home";
  showPanel(["home", "forms", "network", "scroll"].includes(hash) ? hash : "home");
}

function initCounter() {
  const display = document.getElementById("counter-display");
  let count = Number(loadState()[COUNTER_KEY] ?? 0);

  function render() {
    display.textContent = String(count);
    saveState({ [COUNTER_KEY]: count });
  }

  document.getElementById("counter-increment").addEventListener("click", () => {
    count += 1;
    render();
    console.log("[playground] counter:", count);
  });

  document.getElementById("counter-decrement").addEventListener("click", () => {
    count -= 1;
    render();
    console.log("[playground] counter:", count);
  });

  document.getElementById("counter-reset").addEventListener("click", () => {
    count = 0;
    render();
    console.log("[playground] counter reset");
  });

  render();
}

function initConsoleDemos() {
  document.getElementById("log-info").addEventListener("click", () => {
    console.info("[playground] info message at", new Date().toISOString());
  });
  document.getElementById("log-warn").addEventListener("click", () => {
    console.warn("[playground] warning: deprecated API simulated");
  });
  document.getElementById("log-error").addEventListener("click", () => {
    console.error("[playground] error: something went wrong (demo only)");
  });
}

function initModal() {
  const modal = document.getElementById("demo-modal");
  document.getElementById("open-modal").addEventListener("click", () => {
    modal.showModal();
    console.info("[playground] modal opened");
  });
  modal.addEventListener("close", () => {
    console.info("[playground] modal closed");
  });
}

function initStorageNote() {
  const input = document.getElementById("storage-note");
  const status = document.getElementById("storage-status");
  input.value = loadState().note ?? "";
  status.textContent = input.value ? "Loaded from localStorage." : "Nothing saved yet.";

  let timeout;
  input.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      saveState({ note: input.value });
      status.textContent = `Saved at ${new Date().toLocaleTimeString()}.`;
      sessionStorage.setItem("last-edit", Date.now().toString());
    }, 400);
  });
}

function initForm() {
  const form = document.getElementById("contact-form");
  const success = document.getElementById("form-success");

  function setError(id, message) {
    document.getElementById(`${id}-error`).textContent = message;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    success.hidden = true;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    let valid = true;
    setError("name", name ? "" : "Name is required.");
    setError("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Valid email required.");
    setError("message", message ? "" : "Message is required.");

    if (!name || !email || !message) valid = false;
    if (!valid) {
      console.warn("[playground] form validation failed");
      return;
    }

    success.hidden = false;
    console.info("[playground] form submitted", {
      name,
      email,
      priority: form.priority.value,
      subscribe: form.subscribe.checked,
    });
  });

  form.addEventListener("reset", () => {
    ["name", "email", "message"].forEach((id) => setError(id, ""));
    success.hidden = true;
  });
}

function initSearch() {
  const input = document.getElementById("search");
  const list = document.getElementById("search-results");

  function render(query) {
    const q = query.trim().toLowerCase();
    const filtered = q ? ITEMS.filter((item) => item.toLowerCase().includes(q)) : ITEMS;
    list.innerHTML = filtered
      .map((item) => `<li>${item}</li>`)
      .join("");
    if (filtered.length === 0) {
      list.innerHTML = '<li class="hint">No matches.</li>';
    }
  }

  input.addEventListener("input", () => render(input.value));
  render("");
}

function initNetwork() {
  const output = document.getElementById("network-output");

  async function runRequest(label, url) {
    output.textContent = `Loading: ${label}…`;
    const started = performance.now();
    try {
      const res = await fetch(url);
      const body = await res.text();
      const elapsed = Math.round(performance.now() - started);
      const summary = {
        label,
        status: res.status,
        ok: res.ok,
        elapsedMs: elapsed,
        bodyPreview: body.slice(0, 120),
      };
      output.textContent = JSON.stringify(summary, null, 2);
      console.info("[playground] fetch done", summary);
    } catch (err) {
      output.textContent = JSON.stringify({ label, error: String(err) }, null, 2);
      console.error("[playground] fetch failed", err);
    }
  }

  document.getElementById("fetch-success").addEventListener("click", () => {
    runRequest("success", "https://jsonplaceholder.typicode.com/posts/1");
  });

  document.getElementById("fetch-delay").addEventListener("click", () => {
    runRequest("slow", "https://httpbin.org/delay/1");
  });

  document.getElementById("fetch-fail").addEventListener("click", () => {
    runRequest("404", "https://httpbin.org/status/404");
  });
}

function initScroll() {
  const container = document.getElementById("scroll-blocks");
  for (let i = 1; i <= 24; i += 1) {
    const block = document.createElement("div");
    block.className = "scroll-block";
    block.textContent = `Block ${i} — scroll test content.`;
    container.appendChild(block);
  }

  document.getElementById("scroll-to-top").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.info("[playground] scrolled to top");
  });
}

initTheme();
initNav();
initCounter();
initConsoleDemos();
initModal();
initStorageNote();
initForm();
initSearch();
initNetwork();
initScroll();

console.info("[playground] app ready — use @browser to interact");
