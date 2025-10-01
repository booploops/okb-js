<!--
  Copyright (C) 2025-Present booploops and contributors

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->
<script setup lang="ts">
import { computed } from 'vue';
import { keyboardConfig, updateKeyboardLanguage } from '../state';

const emit = defineEmits(['toggle-picker']);

const languages = [
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' }
];

const currentLanguage = computed(() => {
  return languages.find(lang => lang.code === keyboardConfig.value.language) || languages[0];
});

function togglePicker() {
  emit('toggle-picker');
}

function selectLanguage(languageCode: string) {
  keyboardConfig.value.language = languageCode;
  updateKeyboardLanguage();
  emit('toggle-picker'); // Close picker after selection
}

defineExpose({ languages, currentLanguage, selectLanguage });
</script>

<template>
  <button
    class="language-picker-button keyboard-key"
    @click.stop="togglePicker"
  >
    <span class="flag">{{ currentLanguage.flag }}</span>
  </button>
</template>

<style lang="scss" scoped>
.language-picker-button {
  .flag {
    font-size: 1.5rem;
  }
}

@media (max-width: 500px) {
  .language-picker-button {
    .flag {
      font-size: 1.2rem;
    }
  }
}
</style>
