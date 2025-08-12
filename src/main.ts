import { defineCustomElement } from "vue";
import KeyboardSurface from "./components/KeyboardSurface.vue";
import { bindKeyboard } from "./bind";
import { keyboardConfig, targetElement } from "./state";
import type { KeyboardConfig } from "./types/KeyboardConfig";

const keyboardSurface = defineCustomElement(KeyboardSurface, {
  shadowRoot: false,
});

customElements.define("keyboard-surface", keyboardSurface);

const keyboardElement = document.createElement("keyboard-surface");
function init(options: Partial<KeyboardConfig> = {}) {
  keyboardConfig.value.merge(options);
  keyboardConfig.value.container.appendChild(keyboardElement);
}

export { keyboardElement, bindKeyboard, targetElement, init, keyboardConfig };
