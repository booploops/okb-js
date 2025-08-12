import { ref } from "vue";
import { KeyboardConfig } from "./types/KeyboardConfig";
import EnglishKeyboard from './layouts/en-US'
import type { KeyboardLayout } from "./layouts/KeyboardLayout";

export const targetElement = ref<HTMLInputElement | HTMLTextAreaElement>()
export const caretPosition = ref<number>(0)
export const keyboardConfig = ref<KeyboardConfig>(new KeyboardConfig())

export const currentKeyboardLanguage = ref<KeyboardLayout>(EnglishKeyboard)