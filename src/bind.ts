/*
 * Copyright (C) 2025-Present booploops and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import { watch } from "vue";
import { keyboardConfig, targetElement } from "./main";
import { canSelectElement, isWithinKeyboardElement } from "./utils";
import { resetViewportPan, viewportPan } from "./viewport-pan";

export function bindKeyboard(doc: Document) {
  watch(targetElement, (newTargetElement) => {
    if (keyboardConfig.value.fixedViewport) {
      if (newTargetElement) {
        viewportPan({
          targetElement: newTargetElement,
          viewportElement: document.querySelector(
            "#fixed-viewport"
          ) as HTMLElement,
        });
        return;
      }
      resetViewportPan(
        document.querySelector("#fixed-viewport") as HTMLElement
      );
    }
  });

  doc.addEventListener("keydown", () => {
    if (!keyboardConfig.value.enabled) return;
    targetElement.value = undefined;
  });

  doc.addEventListener("click", (event: MouseEvent) => {
    if (!keyboardConfig.value.enabled) return;
    const target = event.target as HTMLElement;
    if (canSelectElement(target)) {
      targetElement.value = target as HTMLInputElement;
      return;
    }
    if (!isWithinKeyboardElement(target)) {
      targetElement.value = undefined;
    }
  });

  // find any okb-frame
  const frames = doc.querySelectorAll(
    "[okb-frame]"
  ) as NodeListOf<HTMLIFrameElement>;
  frames.forEach((frame) => {
    if (
      frame.contentDocument &&
      frame.contentDocument.readyState === "complete"
    ) {
      bindKeyboard(frame.contentDocument);
    } else {
      frame.addEventListener("load", () => {
        bindKeyboard(frame.contentDocument!);
      });
    }
  });

  // Watch for new okb-frame elements added dynamically
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (
          node instanceof HTMLIFrameElement &&
          node.getAttribute("okb-frame") !== null
        ) {
          const frame = node as HTMLIFrameElement;
          if (
            frame.contentDocument &&
            frame.contentDocument.readyState === "complete"
          ) {
            bindKeyboard(frame.contentDocument);
          } else {
            frame.addEventListener("load", () => {
              bindKeyboard(frame.contentDocument!);
            });
          }
        }
      });
    });
  });

  observer.observe(doc.body, { childList: true, subtree: true });
}
