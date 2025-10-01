<!--
  Copyright (C) 2025-Present booploops and contributors

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->
<script setup lang="ts">
import { computed } from 'vue';
import InlineNumPad from './Numpad.vue';

const props = defineProps<{
    targetElement?: HTMLInputElement;
    targetSelector?: string;
    /**
     * Automatically add decimal point. Ex: 123 = 1.23, 1 = 0.01
     */
    decimal?: boolean;
    clearValue?: string;
}>();

const targetElement = computed(() => {
    if(props.targetSelector) {
        return document.querySelector(props.targetSelector) as HTMLInputElement;
    }
    return props.targetElement;
})

function formatAutoDecimal(digits: string) {
    digits = digits.replace(/\D/g, '');
    if (!digits) return '0.00';
    let padded = digits.padStart(3, '0');
    let intPart = padded.slice(0, -2);
    let decPart = padded.slice(-2);
    intPart = intPart.replace(/^0+(?!$)/, '');
    return intPart + '.' + decPart;
}

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

const onEnter = () => {
    // You can add custom logic here if needed
}

const onClear = () => {
    if (!targetElement.value) return;

    targetElement.value.value = props.clearValue || '';
    dispatchEvents();
}

const onInput = (value: string) => {
    if (!targetElement.value) return;
    
    const currentValue = targetElement.value.value || '';
    console.log('onInput called with:', value, 'current value:', currentValue);
    
    if (props.decimal) {
        // Only allow digits
        if (/^\d$/.test(value)) {
            let digits = currentValue.replace(/\D/g, '') + value;
            const newValue = formatAutoDecimal(digits);
            console.log('Decimal mode - digits:', digits, 'formatted:', newValue);
            targetElement.value.value = newValue;
            dispatchEvents();
        }
        // Ignore '.' key
        return;
    } else {
        const newValue = currentValue + value;
        console.log('Non-decimal mode - current:', currentValue, 'adding:', value, 'result:', newValue);
        targetElement.value.value = newValue;
        dispatchEvents();
    }
}

const onBackspace = () => {
    if (!targetElement.value) return;
    
    const currentValue = targetElement.value.value || '';
    console.log('onBackspace called, current value:', currentValue);
    
    if (props.decimal) {
        let digits = currentValue.replace(/\D/g, '');
        digits = digits.slice(0, -1);
        const newValue = formatAutoDecimal(digits);
        console.log('Decimal backspace - digits:', digits, 'formatted:', newValue);
        targetElement.value.value = newValue;
        dispatchEvents();
    } else {
        const newValue = currentValue.slice(0, -1);
        console.log('Non-decimal backspace - current:', currentValue, 'result:', newValue);
        targetElement.value.value = newValue;
        dispatchEvents();
    }
}
defineOptions({
    inheritAttrs: false,
})
</script>

<template>
    <InlineNumPad
        @backspace="onBackspace"
        @enter="onEnter"
        @input="onInput"
        @clear="onClear"
    />
</template>

<style scoped lang="scss"></style>