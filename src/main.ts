import { defineCustomElement } from "vue";
import KeyboardSurface from "./components/KeyboardSurface.vue";
import { bindKeyboard } from "./bind";
import { keyboardConfig, targetElement } from "./state";

const keyboardSurface = defineCustomElement(KeyboardSurface, {
  shadowRoot: false,
});

customElements.define("keyboard-surface", keyboardSurface);

const keyboardElement = document.createElement("keyboard-surface");

type InitOptions = {
  container: HTMLElement;
};

function init(options?: Partial<InitOptions>) {
  const defaults = {
    container: document.body,
  };
  options = { ...defaults, ...options };
  if (!options.container) {
    throw new Error(
      "Container element is required for keyboard initialization."
    );
  }
  options.container.appendChild(keyboardElement);
}

export { keyboardElement, bindKeyboard, targetElement, init, keyboardConfig };
