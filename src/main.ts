/*
 * Copyright (C) 2025-Present booploops and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import { defineCustomElement } from "vue";
import KeyboardSurface from "./components/KeyboardSurface.vue";
import NumpadInput from "./components/NumpadInput.vue";
import { bindKeyboard } from "./bind";
import { keyboardConfig, targetElement, updateKeyboardLanguage } from "./state";
import * as layouts from "./layouts";
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
  updateKeyboardLanguage(); // Update keyboard layout based on language
  keyboardConfig.value.container.appendChild(keyboardElement);
}

export { keyboardElement, bindKeyboard, targetElement, init, keyboardConfig, layouts };
