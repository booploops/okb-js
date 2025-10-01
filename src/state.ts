/*
 * Copyright (C) 2025-Present booploops and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import { ref } from "vue";
import { KeyboardConfig } from "./types/KeyboardConfig";
import EnglishKeyboard from './layouts/en-US'
import SpanishKeyboard from './layouts/es-ES'
import JapaneseKeyboard from './layouts/ja-JP'
import type { KeyboardLayout } from "./layouts/KeyboardLayout";

export const targetElement = ref<HTMLInputElement | HTMLTextAreaElement>()
export const caretPosition = ref<number>(0)
export const keyboardConfig = ref<KeyboardConfig>(new KeyboardConfig())

// Language mapping
const languageMap: Record<string, KeyboardLayout> = {
    'en-US': EnglishKeyboard,
    'es-ES': SpanishKeyboard,
    'ja-JP': JapaneseKeyboard,
};

export const currentKeyboardLanguage = ref<KeyboardLayout>(EnglishKeyboard)

// Function to update keyboard language based on config
export function updateKeyboardLanguage() {
    const layout = languageMap[keyboardConfig.value.language] || EnglishKeyboard;
    currentKeyboardLanguage.value = layout;
}