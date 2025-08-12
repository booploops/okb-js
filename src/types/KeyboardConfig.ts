import { merge } from "lodash-es";

export class KeyboardConfig {
  theme: string = "dark";
  language: string = "en-US";
  autoCapitalizeOnEmpty: boolean = true;
  allowedInputTypes = [
    "text",
    "password",
    "email",
    "search",
    "tel",
    "url",
    "number",
  ];
  allowedTags = ["input", "textarea"];
  ignoreSelectors = ["[okb-ignore]"];
  container: HTMLElement = document.body;

  merge(config: Partial<KeyboardConfig>) {
    merge(new KeyboardConfig(), config);
  }
}
