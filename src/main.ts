import { defineCustomElement } from "vue";
import KeyboardSurface from "./components/KeyboardSurface.vue";
import InlineNumPad from "./components/Numpad.vue";
import NumpadInput from "./components/NumpadInput.vue";
import { bindKeyboard } from "./bind";
import { keyboardConfig, targetElement } from "./state";
import type { KeyboardConfig } from "./types/KeyboardConfig";

const keyboardSurface = defineCustomElement(KeyboardSurface, {
  shadowRoot: false,
});

const inlineNumPad = defineCustomElement(InlineNumPad, {
  shadowRoot: false,
});

const numpadInput = defineCustomElement(NumpadInput, {
  shadowRoot: false,
});

const keyboardElement = document.createElement("keyboard-surface");
function init(options: Partial<KeyboardConfig> = {}) {
  customElements.define("keyboard-surface", keyboardSurface);
  customElements.define("okb-inline-numpad", inlineNumPad);
  customElements.define("okb-numpad-input", numpadInput);
  keyboardConfig.value.merge(options);
  keyboardConfig.value.container.appendChild(keyboardElement);
}

export { keyboardElement, bindKeyboard, targetElement, init, keyboardConfig };
