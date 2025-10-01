<!--
  Copyright (C) 2025-Present booploops and contributors

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->
<script setup lang="ts">
import { targetElement, caretPosition, currentKeyboardLanguage, keyboardConfig, updateKeyboardLanguage } from '../state';
import { numpadLayout } from '../layouts/numpad'
import { ref, computed, watch, onUnmounted, onMounted } from 'vue';
import { canSelectElement } from '../utils';
import LanguagePicker from './LanguagePicker.vue';


const previewInput = ref<HTMLInputElement>();
const previewInputValue = ref('');
const previewInputLabel = ref('');

const isShifted = ref(false);
const showSymbols = ref(false);
const showLanguagePicker = ref(false);

const currentKeyset = computed(() => {
    return isShifted.value ? currentKeyboardLanguage.value.shift : currentKeyboardLanguage.value.normal
})

const symbolKeyset = [
    ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"],
    ["_", "+", "=", "-", "[", "]", "{", "}", "|", "\\"],
    [":", ";", "'", '"', "<", ">", "?",],
];

const isNumpad = computed(() => {
    return inputType.value === 'number' || inputType.value === 'tel' || targetElement.value?.getAttribute(keyboardConfig.value.attributeConfig.NumberTypeAttribute) != null;
});

const keyRows = computed(() => {
    if (isNumpad.value) {
        return numpadLayout;
    }
    if (showSymbols.value) {
        return symbolKeyset;
    }
    // Keep all characters from the layout, including non-English characters
    return currentKeyset.value.map((row) => {
        return row.split(' ');
    });
});

const okbType = computed(() => {
    if (targetElement.value?.getAttribute(keyboardConfig.value.attributeConfig.OverrideTypeAttribute)) {
        return targetElement.value.getAttribute(keyboardConfig.value.attributeConfig.OverrideTypeAttribute);
    }

    // check for numpad
    if (targetElement.value?.getAttribute(keyboardConfig.value.attributeConfig.NumberTypeAttribute) != null) {
        return 'number'
    }
    return targetElement.value?.type || 'text';
});

const inputType = computed(() => {
    return okbType.value ?? 'text';
});

const isTextArea = computed(() => {
    return targetElement.value?.tagName === 'TEXTAREA';
});

/**
 * If true, the numpad will automatically insert a decimal point.
 * For example: if the user entered "200" it will be converted to "2.00"
 * If the user entered "2" it will be converted to "0.02"
 */
const numpadAutoDecimal = computed(() => {
    return targetElement.value ? targetElement.value.getAttribute(keyboardConfig.value.attributeConfig.NumberTypeAttribute) == 'dec' : false;
});

function onKeyPress(key: string) {
    if (key === 'SHIFT') {
        isShifted.value = !isShifted.value;
        return;
    }

    // Handle textarea directly
    if (isTextArea.value && targetElement.value) {
        const textarea = targetElement.value as HTMLTextAreaElement;
        const cursorPos = textarea.selectionStart || 0;
        const selectionEnd = textarea.selectionEnd || cursorPos;
        const hasSelection = cursorPos !== selectionEnd;
        const textBefore = textarea.value.substring(0, cursorPos);
        const textAfter = textarea.value.substring(selectionEnd);

        if (key === 'ENTER') {
            textarea.value = textBefore + '\n' + textAfter;
            textarea.setSelectionRange(cursorPos + 1, cursorPos + 1);
            caretPosition.value = cursorPos + 1;
            // Keep focus on textarea
            textarea.focus();
            return;
        }

        if (key === 'BACKSPACE' || key === '⌫') {
            if (hasSelection) {
                // Delete selected text
                textarea.value = textBefore + textAfter;
                textarea.setSelectionRange(cursorPos, cursorPos);
                caretPosition.value = cursorPos;
            } else if (cursorPos > 0) {
                // Delete one character before cursor
                textarea.value = textarea.value.substring(0, cursorPos - 1) + textAfter;
                textarea.setSelectionRange(cursorPos - 1, cursorPos - 1);
                caretPosition.value = cursorPos - 1;
            }
            // Keep focus on textarea
            textarea.focus();
            return;
        }

        let charToInsert = key;

        // Regular key press
        textarea.value = textBefore + charToInsert + textAfter;
        textarea.setSelectionRange(cursorPos + 1, cursorPos + 1);
        caretPosition.value = cursorPos + 1;

        // Keep focus on textarea
        textarea.focus();
        isShifted.value = false;
        return;
    }

    // Handle regular input elements with preview
    if (!previewInput.value) return;

    const cursorPos = caretPosition.value;

    if (key === 'ENTER') {
        const beforeCursor = previewInputValue.value.slice(0, cursorPos);
        const afterCursor = previewInputValue.value.slice(cursorPos);
        previewInputValue.value = beforeCursor + '\n' + afterCursor;
        caretPosition.value = cursorPos + 1;
        updateTargetFromPreview();
        return;
    }

    if (key === 'BACKSPACE' || key === '⌫') {
        if (numpadAutoDecimal.value && isNumpad.value) {
            let digits = previewInputValue.value.replace(/\D/g, '');
            digits = digits.slice(0, -1);
            previewInputValue.value = formatAutoDecimal(digits);
            updateTargetFromPreview();
            return;
        } else {
            if (cursorPos > 0) {
                const beforeCursor = previewInputValue.value.slice(0, cursorPos - 1);
                const afterCursor = previewInputValue.value.slice(cursorPos);
                previewInputValue.value = beforeCursor + afterCursor;
                caretPosition.value = cursorPos - 1;
                updateTargetFromPreview();
            }
            return;
        }
    }

    // Numpad auto-decimal logic
    if (numpadAutoDecimal.value && isNumpad.value) {
        // Only allow digits, ignore '.'
        if (/^\d$/.test(key)) {
            let digits = previewInputValue.value.replace(/\D/g, '') + key;
            previewInputValue.value = formatAutoDecimal(digits);
            updateTargetFromPreview();
        }
        // Ignore '.' key
        return;
    }

    let charToInsert = key;


    // Insert character at cursor position
    const beforeCursor = previewInputValue.value.slice(0, cursorPos);
    const afterCursor = previewInputValue.value.slice(cursorPos);
    previewInputValue.value = beforeCursor + charToInsert + afterCursor;
    caretPosition.value = cursorPos + 1;
    updateTargetFromPreview();
    isShifted.value = false;
}

function formatAutoDecimal(digits: string) {
    // Always show at least 2 decimal places
    digits = digits.replace(/\D/g, '');
    if (!digits) return '0.00';
    let padded = digits.padStart(3, '0');
    let intPart = padded.slice(0, -2);
    let decPart = padded.slice(-2);
    intPart = intPart.replace(/^0+(?!$)/, '');
    return intPart + '.' + decPart;
}

function toggleSymbols() {
    showSymbols.value = !showSymbols.value;
    isShifted.value = false;
}

function toggleLanguagePicker() {
    showLanguagePicker.value = !showLanguagePicker.value;
}

function selectLanguage(languageCode: string) {
    keyboardConfig.value.language = languageCode;
    updateKeyboardLanguage();
    showLanguagePicker.value = false;
}

function bindTargetToPreview() {
    if (previewInput.value && targetElement.value) {
        previewInputLabel.value = targetElement.value.getAttribute('aria-label') || targetElement.value.getAttribute('placeholder') || '';
        previewInputValue.value = targetElement.value.value;
        if (isTextArea.value) {
            // Inherit caret for textarea
            caretPosition.value = (targetElement.value as HTMLTextAreaElement).selectionStart || 0;
        } else {
            // For input, always start at end
            caretPosition.value = previewInputValue.value.length;
        }
        setTimeout(() => {
            if (previewInput.value && inputType.value !== 'number') {
                previewInput.value.setSelectionRange(caretPosition.value, caretPosition.value);
            }
        }, 0);

        if (previewInputValue.value.length == 0 && keyboardConfig.value.autoCapitalizeOnEmpty) {
            isShifted.value = true;
        } else {
            isShifted.value = false;
        }
    }
}

function updateTargetFromPreview() {
    if (previewInput.value && targetElement.value) {
        targetElement.value.value = previewInputValue.value;
        // Sync cursor position to target element
        if (inputType.value !== 'number') {
            targetElement.value.setSelectionRange(caretPosition.value, caretPosition.value);
            // Also update preview input cursor position
            previewInput.value.setSelectionRange(caretPosition.value, caretPosition.value);
        }

        // Focus
        if (isTextArea.value) {
            previewInput.value.focus();
        }
        dispatchEvents();
    }
}

function handleClickOutside(event: MouseEvent) {

    if(!keyboardConfig.value.enabled) return;

    const keyboardContainer = document.querySelector('.keyboard-container');
    const clickedElement = event.target as HTMLElement;

    // Check for okb-ignore attribute or if clicked element is a child of an element with okb-ignore
    let element: HTMLElement | null = clickedElement;
    while (element) {
        element = element.parentElement;
    }

    if (!keyboardContainer?.contains(clickedElement)) {
        if (canSelectElement(clickedElement)) {
            targetElement.value = clickedElement as HTMLInputElement;
        } else {
            targetElement.value = undefined; // Fix type error
        }
    }
}

function trackTextAreaCaret() {
    if (isTextArea.value && targetElement.value) {
        const textarea = targetElement.value as HTMLTextAreaElement;
        caretPosition.value = textarea.selectionStart || 0;
    }
}

watch(targetElement, (newTarget, oldTarget) => {
    showSymbols.value = false;

    // Clean up old listeners
    if (oldTarget?.tagName === 'TEXTAREA') {
        oldTarget.removeEventListener('click', trackTextAreaCaret);
        oldTarget.removeEventListener('keyup', trackTextAreaCaret);
        oldTarget.removeEventListener('select', trackTextAreaCaret);
    }

    if (isTextArea.value && newTarget) {
        const textarea = newTarget as HTMLTextAreaElement;
        // Listen for selection changes on textarea
        textarea.addEventListener('click', trackTextAreaCaret);
        textarea.addEventListener('keyup', trackTextAreaCaret);
        textarea.addEventListener('select', trackTextAreaCaret);
        // Set initial caret position
        caretPosition.value = textarea.selectionStart || 0;
    } else {
        bindTargetToPreview();
    }
}, {
    immediate: true
});

// Watch for language changes and update keyboard layout
watch(() => keyboardConfig.value.language, () => {
    updateKeyboardLanguage();
}, {
    immediate: true
});


function dispatchEvents() {
    if (targetElement.value) {
        const inputEvent = new Event('input', { bubbles: true });
        targetElement.value.dispatchEvent(inputEvent);

        const keyupEvent = new Event('keyup', { bubbles: true });
        targetElement.value.dispatchEvent(keyupEvent);

        const changeEvent = new Event('change', { bubbles: true });
        targetElement.value.dispatchEvent(changeEvent);

    }
}

function clearPreview(event?: MouseEvent) {
    previewInputValue.value = '';
    caretPosition.value = 0;
    updateTargetFromPreview();

    // Prevent event propagation to keep keyboard open
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // Keep focus on the input to prevent keyboard from closing
    setTimeout(() => {
        if (previewInput.value) {
            previewInput.value.focus();
        }
    }, 0);
}

function updateCaretPosition() {
    if (previewInput.value) {
        caretPosition.value = previewInput.value.selectionStart || 0;
    }
}

onMounted(() => {
    window.addEventListener('click', handleClickOutside);
})

onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside);
})

</script>

<template>
    <div
        class="keyboard-container"
        :class="{
            'opened': targetElement,
            'dark': true,
        }"
    >
        <div
            class="keyboard-preview"
            v-if="!isTextArea"
        >
            <div class="input-wrapper">
                <input
                    ref="previewInput"
                    v-model="previewInputValue"
                    :type="inputType"
                    okb-ignore
                    spellcheck="false"
                    autocapitalize="false"
                    autocomplete="false"
                    :placeholder="previewInputLabel"
                    @click="updateCaretPosition"
                    @keyup="updateCaretPosition"
                    @focus="updateCaretPosition"
                >
                <button
                    class="clear-btn-inline"
                    @click.stop.prevent="clearPreview($event)"
                    v-if="previewInputValue.length > 0"
                    okb-ignore
                    aria-label="Clear input"
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="10"
                            cy="10"
                            r="9"
                            stroke="currentColor"
                            stroke-width="2"
                            fill="none"
                        />
                        <path
                            d="M7 7l6 6M13 7l-6 6"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                        />
                    </svg>
                </button>
            </div>
        </div>
        <div
            class="keyboard-surface"
            :class="{
                'numpad': isNumpad,
            }"
        >
            <div class="keyboard">
                <div class="keyboard-layout">
                    <div class="keyboard-main">
                        <div
                            class="keyboard-row"
                            v-for="(row, rowIndex) in keyRows"
                            :key="rowIndex"
                        >
                            <template v-if="rowIndex === keyRows.length - 1 && !isNumpad">
                                <button
                                    class="keyboard-key shift-key"
                                    :class="{ active: isShifted }"
                                    @click="onKeyPress('SHIFT')"
                                >
                                    <span>
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M10 3l6 7h-4v7h-4v-7H4l6-7z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    </span>
                                </button>
                            </template>
                            <button
                                class="keyboard-key"
                                v-for="(key, keyIndex) in row"
                                :key="keyIndex"
                                :disabled="numpadAutoDecimal && isNumpad && key === '.'"
                                @click="onKeyPress(key)"
                            >
                                <span>{{ key }}</span>
                            </button>
                        </div>
                        <div
                            class="keyboard-row"
                            v-if="inputType !== 'number'"
                        >
                            <button
                                class="keyboard-key sym-key"
                                @click="toggleSymbols"
                            >
                                <span>{{ showSymbols ? 'ABC' : 'SYM' }}</span>
                            </button>
                            <button
                                v-if="inputType === 'email'"
                                class="keyboard-key at-key"
                                @click="onKeyPress('@')"
                            >
                                <span>@</span>
                            </button>
                            <button
                                class="keyboard-key space-bar"
                                @click="onKeyPress(' ')"
                            >
                                <span>Space</span>
                            </button>
                            <LanguagePicker @toggle-picker="toggleLanguagePicker" />
                            <button
                                class="keyboard-key done-key"
                                @click="targetElement = undefined"
                            >
                                <span>Done</span>
                            </button>
                        </div>
                    </div>

                    <!-- Right side vertical buttons -->
                    <div class="keyboard-side-buttons">
                        <button
                            class="keyboard-key backspace-key"
                            @click="onKeyPress('BACKSPACE')"
                        >
                            <span>⌫</span>
                        </button>
                        <button
                            class="keyboard-key enter-key"
                            v-if="isTextArea"
                            @click="onKeyPress('ENTER')"
                        >
                            <span>Enter</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Language Picker Overlay -->
            <div class="language-picker-overlay" v-if="showLanguagePicker" @click.stop>
                <div class="language-picker-header">
                    <h3>Select Language</h3>
                    <button class="close-picker" @click.stop="showLanguagePicker = false">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                <div class="language-options">
                    <button
                        v-for="language in [
                            { code: 'en-US', name: 'English', flag: '🇺🇸' },
                            { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
                            { code: 'ja-JP', name: '日本語', flag: '🇯🇵' }
                        ]"
                        :key="language.code"
                        class="language-option-btn"
                        :class="{ 'selected': language.code === keyboardConfig.language }"
                        @click.stop="selectLanguage(language.code)"
                    >
                        <span class="flag-large">{{ language.flag }}</span>
                        <span class="language-name">{{ language.name }}</span>
                        <span class="language-code">{{ language.code }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.keyboard-container {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background: var(--md-sys-color-surface-container);
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

    user-select: none;
    -webkit-user-drag: none;

    .input-wrapper {
        position: relative;
        width: 100%;
        max-width: 100vw;
        display: flex;
        align-items: center;
    }

    transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1),
    opacity 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
    transform: translateY(100%);
    opacity: 0;

    &.opened {
        transform: translateY(0);
        opacity: 1;
    }

    button,
    input {
        appearance: none;
        font-family: inherit;
    }

    /* Material 3 color variables */
    --md-sys-color-surface-container: #f7f2fa;
    --md-sys-color-surface-container-dark: #1d1b20;
    --md-sys-color-on-surface: #1c1b1f;
    --md-sys-color-on-surface-dark: #e6e0e9;
    --md-sys-color-surface-variant: #e7e0ec;
    --md-sys-color-surface-variant-dark: #49454f;
    --md-sys-color-on-surface-variant: #49454f;
    --md-sys-color-on-surface-variant-dark: #cac4d0;
    --md-sys-color-primary: #6750a4;
    --md-sys-color-primary-dark: color-mix(in srgb, #6750a4 80%, white);
    --md-sys-color-primary-container: color-mix(in srgb, #6750a4 20%, white);
    --md-sys-color-primary-container-dark: color-mix(in srgb, #6750a4 60%, black);
    --md-sys-color-on-primary-container: color-mix(in srgb, #6750a4 90%, black);
    --md-sys-color-on-primary-container-dark: color-mix(in srgb, #6750a4 20%, white);
    --md-sys-color-secondary: #625b71;
    --md-sys-color-secondary-dark: #cbc2db;
    --md-sys-color-outline: #79747e;
    --md-sys-color-outline-dark: #938f99;
}

.keyboard-container.dark {
    background: var(--md-sys-color-surface-container-dark);
    color: var(--md-sys-color-on-surface-dark);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.32);

    .clear-btn-inline {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--md-sys-color-on-surface-variant-dark);
        padding: 0.75rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
        z-index: 2;

        svg {
            pointer-events: none;
        }

        &:active {
            background: rgba(208, 188, 255, 0.12);
        }
    }
}

.keyboard-preview {
    padding: 1rem;
    padding-bottom: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
    align-items: center;
    gap: 0.5rem;
}

.keyboard-preview input {
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;
    padding: 1rem 1.25rem;
    font-size: 1.1rem;
    border-radius: 1rem;
    border: 1px solid var(--md-sys-color-outline);
    background: var(--md-sys-color-surface-variant);
    color: var(--md-sys-color-on-surface);
    text-align: center;
    transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);

    &:focus {
        outline: none;
        border-color: var(--md-sys-color-primary);
        box-shadow: 0 0 0 2px rgba(103, 80, 164, 0.12);
    }
}

.clear-btn {
    margin-left: 0.5rem;
    background: none;
    border: none;
    color: #888;
    padding: 0.25rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, color 0.15s;
}

.keyboard-container.dark .clear-btn {
    color: #aaa;
}

.keyboard-container.dark .keyboard-preview input {
    background: var(--md-sys-color-surface-variant-dark);
    color: var(--md-sys-color-on-surface-dark);
    border: 1px solid var(--md-sys-color-outline-dark);

    &:focus {
        border-color: var(--md-sys-color-primary-dark);
        box-shadow: 0 0 0 2px rgba(208, 188, 255, 0.12);
    }
}

.keyboard-surface {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0rem 0;
    width: 100%;
    position: relative;

    &.numpad {
        max-width: 25%;
        min-width: 20rem;
        margin: 0 auto;
    }
}

.keyboard {
    border-radius: 1rem;
    padding: 0.75rem 1rem 1.5rem 1rem;
    width: 100%;
    box-sizing: border-box;
}

.keyboard-layout {
    display: flex;
    gap: 0.5rem;
    width: 100%;
}

.keyboard-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.keyboard-side-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 6rem;
}

.keyboard-row {
    display: flex;
    justify-content: center;
    gap: 0.375rem;
    width: 100%;
    flex-wrap: nowrap;
    overflow: hidden;
}

.keyboard-key {
    background: var(--md-sys-color-surface-variant);
    color: var(--md-sys-color-on-surface-variant);
    border: none;
    border-radius: 1.5rem;
    height: 4rem;
    min-width: 3rem;
    font-size: clamp(0.875rem, 2.5vw, 2rem);
    font-weight: 500;
    letter-spacing: 0.1px;
    padding: 0 0.75em;
    outline: none;
    flex: 1 1 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

    /* Material 3 state layer */
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit;
        background: var(--md-sys-color-on-surface-variant);
        opacity: 0;
        transition: opacity 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
        pointer-events: none;
    }

    &:active {
        transform: scale(0.96);

        &::before {
            opacity: 0.12;
        }
    }

    &:disabled {
        background: rgba(var(--md-sys-color-on-surface), 0.12);
        color: rgba(var(--md-sys-color-on-surface), 0.38);
        cursor: not-allowed;

        &::before {
            display: none;
        }
    }
}

.keyboard-container.dark .keyboard-key {
    background: var(--md-sys-color-surface-variant-dark);
    color: var(--md-sys-color-on-surface-variant-dark);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.24);

    &::before {
        background: var(--md-sys-color-on-surface-variant-dark);
    }

    &:disabled {
        background: rgba(var(--md-sys-color-on-surface-dark), 0.12);
        color: rgba(var(--md-sys-color-on-surface-dark), 0.38);
    }
}

.special-keys .keyboard-key {
    flex-grow: 1;
    flex-basis: 0;
}

.space-bar {
    flex: 3 1 0;
    min-width: 4rem;
}

.shift-key {
    background: var(--md-sys-color-primary-container) !important;
    color: var(--md-sys-color-on-primary-container) !important;

    &.active {
        background: var(--md-sys-color-primary) !important;
        color: white !important;

        &::before {
            background: white;
        }
    }

    &::before {
        background: var(--md-sys-color-on-primary-container);
    }
}

.enter-key {
    height: 4.5rem;
    background: var(--md-sys-color-primary) !important;
    color: white !important;
    font-weight: 600;

    &::before {
        background: white;
    }
}

.backspace-key {
    height: 4.5rem;
    background: var(--md-sys-color-secondary) !important;
    color: white !important;

    &::before {
        background: white;
    }
}

.keyboard-container.dark .shift-key {
    background: var(--md-sys-color-primary-container-dark) !important;
    color: var(--md-sys-color-on-primary-container-dark) !important;

    &.active {
        background: var(--md-sys-color-primary-dark) !important;
        color: var(--md-sys-color-on-primary-container) !important;
    }

    &::before {
        background: var(--md-sys-color-on-primary-container-dark);
    }
}

.keyboard-container.dark .enter-key {
    background: var(--md-sys-color-primary-dark) !important;
    color: var(--md-sys-color-on-primary-container) !important;
}

.keyboard-container.dark .backspace-key {
    background: var(--md-sys-color-secondary-dark) !important;
    color: var(--md-sys-color-on-primary-container) !important;
}

.done-key {
    flex: 1.5 1 0;
    min-width: 3.5rem;
    background: var(--md-sys-color-primary-container) !important;
    color: var(--md-sys-color-on-primary-container) !important;
    font-weight: 600;

    &::before {
        background: var(--md-sys-color-on-primary-container);
    }
}

.keyboard-container.dark .done-key {
    background: var(--md-sys-color-primary-container-dark) !important;
    color: var(--md-sys-color-on-primary-container-dark) !important;

    &::before {
        background: var(--md-sys-color-on-primary-container-dark);
    }
}

.keyboard-side-buttons .keyboard-key {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1.25rem;
}

.at-key {
    flex: 1 1 0;
    min-width: 3rem;
}

.sym-key {
    background: var(--md-sys-color-secondary) !important;
    color: white !important;
    font-weight: 600;
    border-radius: 1.25rem;
    flex: 1 1 0;
    min-width: 3rem;

    &::before {
        background: white;
    }
}

.keyboard-container.dark .sym-key {
    background: var(--md-sys-color-secondary-dark) !important;
    color: var(--md-sys-color-on-primary-container) !important;
}

@media (max-width: 500px) {
    .keyboard {
        max-width: 100vw;
        padding: 0.75rem 1rem 1rem 1rem;
    }

    .keyboard-key {
        height: 2.75rem;
        border-radius: 1.25rem;
        font-size: 0.875rem;
    }

    .keyboard-side-buttons {
        width: 3.5rem;
    }

    .backspace-key,
    .shift-key,
    .enter-key {
        height: 3.75rem;
    }

    .keyboard-layout {
        gap: 0.375rem;
    }

    .keyboard-main .keyboard-row {
        gap: 0.25rem;
    }

    /* Ensure bottom row fits on small screens */
    .keyboard-main .keyboard-row:last-child {
        gap: 0.125rem;
    }

    .keyboard-key {
        min-width: 2.5rem;
        padding: 0 0.5em;
    }

    .space-bar {
        flex: 3 1 0;
        min-width: 3rem;
    }

    .done-key {
        flex: 1.5 1 0;
        min-width: 2.5rem;
    }

    .sym-key {
        flex: 1 1 0;
        min-width: 2.5rem;
    }
}

/* Language Picker Overlay */
.language-picker-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--md-sys-color-surface-container);
    z-index: 100;
    display: flex;
    flex-direction: column;
    border-radius: 1rem 1rem 0 0;
    overflow: hidden;
}

.keyboard-container.dark .language-picker-overlay {
    background: var(--md-sys-color-surface-container-dark);
}

.language-picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid var(--md-sys-color-outline);

    h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--md-sys-color-on-surface);
    }
}

.keyboard-container.dark .language-picker-header {
    border-bottom-color: var(--md-sys-color-outline-dark);

    h3 {
        color: var(--md-sys-color-on-surface-dark);
    }
}

.close-picker {
    background: none;
    border: none;
    color: var(--md-sys-color-on-surface);
    padding: 0.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: var(--md-sys-color-surface-variant);
    }
}

.keyboard-container.dark .close-picker {
    color: var(--md-sys-color-on-surface-dark);

    &:hover {
        background: var(--md-sys-color-surface-variant-dark);
    }
}

.language-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.5rem;
    overflow-y: auto;
}

.language-option-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: var(--md-sys-color-surface-variant);
    border: none;
    border-radius: 1rem;
    color: var(--md-sys-color-on-surface);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
    font-size: 1rem;

    &:hover {
        background: var(--md-sys-color-primary-container);
        color: var(--md-sys-color-on-primary-container);
    }

    &.selected {
        background: var(--md-sys-color-primary-container);
        color: var(--md-sys-color-on-primary-container);
        font-weight: 600;
    }

    .flag-large {
        font-size: 2rem;
    }

    .language-name {
        flex: 1;
        text-align: left;
        font-weight: 500;
    }

    .language-code {
        font-size: 0.875rem;
        opacity: 0.7;
    }
}

.keyboard-container.dark .language-option-btn {
    background: var(--md-sys-color-surface-variant-dark);
    color: var(--md-sys-color-on-surface-dark);

    &:hover {
        background: var(--md-sys-color-primary-container-dark);
        color: var(--md-sys-color-on-primary-container-dark);
    }

    &.selected {
        background: var(--md-sys-color-primary-container-dark);
        color: var(--md-sys-color-on-primary-container-dark);
    }
}
</style>