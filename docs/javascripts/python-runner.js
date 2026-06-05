(function () {
  const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/";
  const PYODIDE_SCRIPT_URL = `${PYODIDE_INDEX_URL}pyodide.js`;

  let pyodidePromise = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        if (window.loadPyodide) {
          resolve();
        }
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });
  }

  async function getPyodide() {
    if (!pyodidePromise) {
      pyodidePromise = (async () => {
        await loadScript(PYODIDE_SCRIPT_URL);
        return window.loadPyodide({ indexURL: PYODIDE_INDEX_URL });
      })();
    }

    return pyodidePromise;
  }

  function runCode(pyodide, source) {
    const wrappedSource = `
import contextlib
import io
import json
import traceback

__runner_code = ${JSON.stringify(source)}
__runner_output = io.StringIO()
__runner_globals = {}

try:
    with contextlib.redirect_stdout(__runner_output):
        exec(__runner_code, __runner_globals, __runner_globals)
except Exception:
    __runner_payload = {
        "ok": False,
        "output": traceback.format_exc(),
    }
else:
    __runner_payload = {
        "ok": True,
        "output": __runner_output.getvalue(),
    }

json.dumps(__runner_payload, ensure_ascii=False)
`;

    return pyodide.runPythonAsync(wrappedSource);
  }

  function createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = "python-runner-toolbar";

    const button = document.createElement("button");
    button.className = "python-runner-button";
    button.type = "button";
    button.setAttribute("aria-label", "このコードを実行する");

    const icon = document.createElement("span");
    icon.className = "python-runner-play";
    icon.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.textContent = "Run";

    const status = document.createElement("span");
    status.className = "python-runner-status";
    status.textContent = "未実行";

    button.append(icon, label);
    toolbar.append(button, status);

    return { toolbar, button, status };
  }

  function createOutput() {
    const output = document.createElement("pre");
    output.className = "python-runner-output";
    output.hidden = true;

    const code = document.createElement("code");
    output.appendChild(code);

    return { output, code };
  }

  function enhanceBlock(codeBlock) {
    const pre = codeBlock.closest("pre");
    if (!pre || pre.dataset.pythonRunner === "true") {
      return;
    }

    pre.dataset.pythonRunner = "true";

    const wrapper = document.createElement("div");
    wrapper.className = "python-runner";

    const parent = pre.parentElement;
    parent.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const { toolbar, button, status } = createToolbar();
    const { output, code } = createOutput();

    wrapper.insertBefore(toolbar, pre);
    wrapper.appendChild(output);

    button.addEventListener("click", async () => {
      const source = codeBlock.textContent.replace(/\n$/, "");

      button.disabled = true;
      status.textContent = "実行中";
      output.hidden = false;
      code.textContent = "Python を準備しています...";

      try {
        const pyodide = await getPyodide();
        code.textContent = "実行しています...";

        const result = JSON.parse(await runCode(pyodide, source));
        code.textContent = result.output.trimEnd() || "(出力なし)";
        status.textContent = result.ok ? "完了" : "エラー";
      } catch (error) {
        code.textContent = error && error.message ? error.message : String(error);
        status.textContent = "エラー";
      } finally {
        button.disabled = false;
      }
    });
  }

  function initPythonRunner() {
    if (!/\/(01_python_basics|02_data_structures|03_control_flow|04_functions|05_objects|06_classes)\/?(index\.html)?$/.test(window.location.pathname)) {
      return;
    }

    document.querySelectorAll("pre > code.language-python").forEach(enhanceBlock);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPythonRunner);
  } else {
    initPythonRunner();
  }
})();
