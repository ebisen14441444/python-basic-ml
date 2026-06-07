(function () {
  const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/";
  const PYODIDE_SCRIPT_URL = `${PYODIDE_INDEX_URL}pyodide.js`;

  let pyodidePromise = null;
  let numpyPromise = null;
  let pillowPromise = null;
  let imageFixturePromise = null;

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

  function isNumpyPage() {
    return /\/(08_numpy_basics|09_numpy_multidim|10_numpy_indexing|11_numpy_calculation)\/?(index\.html)?$/.test(window.location.pathname);
  }

  function isImagePage() {
    return /\/11_numpy_calculation\/?(index\.html)?$/.test(window.location.pathname);
  }

  async function preparePackages(pyodide) {
    if (!isNumpyPage()) {
      return;
    }

    if (!numpyPromise) {
      numpyPromise = pyodide.loadPackage("numpy");
    }

    await numpyPromise;

    if (!isImagePage()) {
      return;
    }

    if (!pillowPromise) {
      pillowPromise = pyodide.loadPackage("pillow");
    }

    await pillowPromise;

    if (!imageFixturePromise) {
      imageFixturePromise = (async () => {
        const imageUrl = new URL("../images/numpy_rgb/astronaut_original.png", window.location.href);
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error("画像ファイルを読み込めませんでした。");
        }
        const bytes = new Uint8Array(await response.arrayBuffer());
        pyodide.FS.writeFile("/astronaut_original.png", bytes);
      })();
    }

    await imageFixturePromise;
  }

  function runCode(pyodide, source) {
    const setupSource = isImagePage()
      ? `
import numpy as np
from PIL import Image

image = np.array(Image.open("/astronaut_original.png").convert("RGB"))
`
      : "";

    const wrappedSource = `
import contextlib
import base64
import io
import json
import traceback

__runner_code = ${JSON.stringify(source)}
__runner_setup = ${JSON.stringify(setupSource)}
__runner_output = io.StringIO()
__runner_globals = {}

try:
    with contextlib.redirect_stdout(__runner_output):
        exec(__runner_setup, __runner_globals, __runner_globals)
        exec(__runner_code, __runner_globals, __runner_globals)
except Exception:
    __runner_payload = {
        "ok": False,
        "output": traceback.format_exc(),
    }
else:
    __runner_images = []
    if __runner_setup:
        __runner_image_class = __runner_globals["Image"]
        for __runner_name in ["inverted", "bright", "shifted", "gray"]:
            if __runner_name not in __runner_globals:
                continue

            __runner_array = __runner_globals[__runner_name]
            if not hasattr(__runner_array, "ndim"):
                continue

            if __runner_array.ndim == 2:
                __runner_image = __runner_image_class.fromarray(__runner_array.astype("uint8"), mode="L")
            elif __runner_array.ndim == 3 and __runner_array.shape[2] == 3:
                __runner_image = __runner_image_class.fromarray(__runner_array.astype("uint8"), mode="RGB")
            else:
                continue

            __runner_buffer = io.BytesIO()
            __runner_image.save(__runner_buffer, format="PNG")
            __runner_images.append({
                "name": __runner_name,
                "src": "data:image/png;base64," + base64.b64encode(__runner_buffer.getvalue()).decode("ascii"),
            })

    __runner_payload = {
        "ok": True,
        "output": __runner_output.getvalue(),
        "images": __runner_images,
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
    const output = document.createElement("div");
    output.className = "python-runner-output";
    output.hidden = true;

    const text = document.createElement("pre");
    text.className = "python-runner-output-text";

    const code = document.createElement("code");
    text.appendChild(code);

    const images = document.createElement("div");
    images.className = "python-runner-images";

    output.append(text, images);

    return { output, code, images };
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
    const { output, code, images } = createOutput();

    wrapper.insertBefore(toolbar, pre);
    wrapper.appendChild(output);

    button.addEventListener("click", async () => {
      const source = codeBlock.textContent.replace(/\n$/, "");

      button.disabled = true;
      status.textContent = "実行中";
      output.hidden = false;
      images.innerHTML = "";
      code.textContent = "Python を準備しています...";

      try {
        const pyodide = await getPyodide();
        if (isNumpyPage()) {
          code.textContent = "NumPy を準備しています...";
        }
        if (isImagePage()) {
          code.textContent = "画像を準備しています...";
        }
        await preparePackages(pyodide);
        code.textContent = "実行しています...";

        const result = JSON.parse(await runCode(pyodide, source));
        code.textContent = result.output.trimEnd() || "(出力なし)";
        images.innerHTML = "";
        if (result.images && result.images.length > 0) {
          result.images.forEach((image) => {
            const figure = document.createElement("figure");
            figure.className = "python-runner-image";

            const img = document.createElement("img");
            img.src = image.src;
            img.alt = `${image.name} の実行結果`;

            const caption = document.createElement("figcaption");
            caption.textContent = image.name;

            figure.append(img, caption);
            images.appendChild(figure);
          });
        }
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
    if (!/\/(01_python_basics|02_data_structures|03_control_flow|04_functions|05_objects|06_classes|07_python_extras|08_numpy_basics|09_numpy_multidim|10_numpy_indexing|11_numpy_calculation)\/?(index\.html)?$/.test(window.location.pathname)) {
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
