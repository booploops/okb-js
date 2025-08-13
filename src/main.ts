import { defineCustomElement } from "vue";
import KeyboardSurface from "./components/KeyboardSurface.vue";
import NumpadInput from "./components/NumpadInput.vue";
import { bindKeyboard } from "./bind";
import { keyboardConfig, targetElement } from "./state";
import type { KeyboardConfig } from "./types/KeyboardConfig";

const keyboardSurface = defineCustomElement(KeyboardSurface, {
  shadowRoot: false,
});

const numpadInput = defineCustomElement(NumpadInput, {
  shadowRoot: false,
});
customElements.define("keyboard-surface", keyboardSurface);
customElements.define("okb-numpad-input", numpadInput);

const keyboardElement = document.createElement("keyboard-surface");
function init(options: Partial<KeyboardConfig> = {}) {
  keyboardConfig.value.merge(options);
  console.log(keyboardConfig.value);
  keyboardConfig.value.container.appendChild(keyboardElement);
}

export { keyboardElement, bindKeyboard, targetElement, init, keyboardConfig };
