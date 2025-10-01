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
import type { KeyboardLayout } from "./layouts/KeyboardLayout";

export const targetElement = ref<HTMLInputElement | HTMLTextAreaElement>()
export const caretPosition = ref<number>(0)
export const keyboardConfig = ref<KeyboardConfig>(new KeyboardConfig())

export const currentKeyboardLanguage = ref<KeyboardLayout>(EnglishKeyboard)