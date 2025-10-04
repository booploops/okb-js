/*
 * Copyright (C) 2025-Present booploops and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import { merge } from "lodash-es";
import type { Languages } from "../layouts";

export class KeyboardConfig {
  /** Whether the on-screen keyboard is enabled */
  enabled = true;
  
  /** 
   * The visual theme of the keyboard ("dark" or "light") 
   * 
   * @todo Implement stock light and dark theme
   */
  theme: string = "dark";

  /** Additional classes to add to the keyboard container */
  keyboardClasses: string[] = [];
  
  /** The language/locale for the keyboard layout */
  language: Languages = "en-US";
  
  /** Enable debug mode for development and troubleshooting */
  debug: boolean = false;
  
  /** Automatically capitalize the first letter when input field is empty */
  autoCapitalizeOnEmpty: boolean = true;
  
  /** Allow users to switch between different keyboard languages */
  allowSwitchLanguage: boolean = true;
  
  /** Array of HTML input types that the keyboard should activate for */
  allowedInputTypes = [
    "text",
    "password",
    "email",
    "search",
    "tel",
    "url",
    "number",
  ];
  
  /** HTML tags that the keyboard should target */
  allowedTags = ["input", "textarea"];
  
  /** CSS selectors for elements that should be ignored by the keyboard */
  ignoreSelectors = ["[okb-ignore]"];
  
  /** The DOM container element where the keyboard will be rendered */
  container: HTMLElement = document.body;

  /**
   * When using a fixed viewport, the keyboard can pan the viewport to bring the target element into view if it's behind the keyboard
   */
  fixedViewport: string | HTMLElement | undefined;

  /** Configuration for custom data attributes used by the keyboard */
  attributeConfig = {
    /** Attribute name for specifying number input type behavior */
    NumberTypeAttribute: 'okb-numtype',
    /** Attribute name for overriding the input type */
    OverrideTypeAttribute: 'okb-type'
  }

  /**
   * Merges the provided configuration with the current configuration
   * @param config - Partial configuration object to merge
   * @returns The updated KeyboardConfig instance for method chaining
   */
  merge(config: Partial<KeyboardConfig>) {
    merge(this, config);
    return this;
  }
}
