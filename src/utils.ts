import { keyboardConfig } from "./state";

export function canSelectElement(element: HTMLElement | null): boolean {
  if (!element) return false;

  if (keyboardConfig.value.ignoreSelectors.some(selector => element.matches(selector))) {
    return false;
  }

  const tagName = element.tagName.toLowerCase();
  const isReadonly = element.hasAttribute("readonly");
  const isDisabled = element.hasAttribute("disabled");
  const canBeEdited = !isReadonly && !isDisabled;
  if (keyboardConfig.value.allowedTags.includes(tagName) && canBeEdited) {
    if (tagName === "input") {
      const type = element.getAttribute("type") || "text";
      return keyboardConfig.value.allowedInputTypes.includes(type);
    }
    return true;
  }

  return false;
}
