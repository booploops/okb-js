import { merge } from "lodash-es";

export class KeyboardConfig {
  enabled = true;
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

  attributeConfig = {
    NumberTypeAttribute: 'okb-numtype',
    OverrideTypeAttribute: 'okb-type'
  }

  merge(config: Partial<KeyboardConfig>) {
    merge(this, config);
    return this;
  }
}
