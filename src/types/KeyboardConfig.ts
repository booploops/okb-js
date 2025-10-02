/*
 * Copyright (C) 2025-Present booploops and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import { merge } from "lodash-es";

export class KeyboardConfig {
  enabled = true;
  theme: string = "dark";
  language: string = "en-US";
  debug: boolean = false;
  autoCapitalizeOnEmpty: boolean = true;
  allowSwitchLanguage: boolean = true;
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
