<script setup lang="ts">

const props = defineProps<{
    clearButton?: boolean;
}>();

const emit = defineEmits<{
    input: [value: string]
    enter: []
    backspace: [],
    clear: []
}>()

const handleNumber = (num: string) => {
    emit('input', num)
}

const handleBackspace = () => {
    emit('backspace')
}

const handleEnter = () => {
    emit('enter')
}

const handleClear = () => {
    emit('clear')
}

const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['0']
]
</script>

<template>
    <div
        class="numpad"
        :class="{
            'numpad-dark': true,
        }"
    >
        <div class="numpad-grid">
            <div
                v-for="row in numbers"
                :key="row.join()"
                class="numpad-row"
                :class="{ 'numpad-row-single': row.length === 1 }"
            >
                <button
                    v-for="num in row"
                    :key="num"
                    @click="handleNumber(num)"
                    class="numpad-btn numpad-number"
                >
                    {{ num }}
                </button>
            </div>
            <div class="numpad-actions">
                <button
                    @click="handleBackspace"
                    class="numpad-btn numpad-action"
                >
                    ⌫
                </button>
                <button
                    @click="handleClear"
                    class="numpad-btn numpad-action"
                >
                    C
                </button>
                <button
                    @click="handleEnter"
                    class="numpad-btn numpad-action"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
$md-surface: #f8f9fa;
$md-primary: #6750a4;
$md-on-primary: #fff;
$md-on-surface: #1c1b1f;
$md-outline: #e0e0e0;

$md-surface-dark: #1c1b1f;
$md-primary-dark: #d0bcff;
$md-on-primary-dark: #381e72;
$md-on-surface-dark: #e6e1e5;
$md-outline-dark: #444;

.numpad {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: $md-surface;
    border-radius: min(4cqi, 16px);
    padding: min(4cqi, 16px) min(5cqi, 20px);
    box-shadow: 0 1.5px 6px rgba(60, 60, 60, 0.10), 0 0.5px 1.5px rgba(60, 60, 60, 0.08);
    border: 1px solid $md-outline;
    box-sizing: border-box;
    container-type: inline-size;
}

.numpad.numpad-dark {
    background: $md-surface-dark;
    border: 1px solid $md-outline-dark;
}

.numpad-grid {
    display: grid;
    grid-template-rows: repeat(4, 1fr) auto;
    gap: min(3cqi, 12px);
    height: 100%;
    flex: 1;
}

.numpad-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: min(3cqi, 12px);
    height: 100%;
}

.numpad-row-single {
    grid-template-columns: 1fr 1fr 1fr;
    
    button {
        grid-column: 2; // Center the single button in the middle column
    }
}

.numpad-actions {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: min(3cqi, 12px);
    margin-top: min(2cqi, 8px);
}

.numpad-btn {
    width: 100%;
    height: 100%;
    min-height: min(12cqi, 48px);
    max-height: min(14cqi, 72px);
    border: none;
    border-radius: min(3cqi, 12px);
    font-size: clamp(1rem, 5cqi, 1.5rem);
    font-weight: 500;
    cursor: pointer;
    background: transparent;
    color: $md-on-surface;
    position: relative;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(60, 60, 60, 0.08);
    transition: box-shadow 0.2s, background 0.2s, color 0.2s;
    outline: none;
    display: grid;
    place-items: center;
    aspect-ratio: 1;

    .numpad-dark & {
        color: $md-on-surface-dark;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
    }

    &:hover {
        background: rgba(103, 80, 164, 0.08);
        box-shadow: 0 2px 8px rgba(103, 80, 164, 0.10);
    }

    &:active {
        background: rgba(103, 80, 164, 0.16);
        box-shadow: 0 1px 2px rgba(103, 80, 164, 0.12);
    }

    .numpad-dark & {
        &:hover {
            background: rgba(208, 188, 255, 0.10);
            color: $md-primary-dark;
        }

        &:active {
            background: rgba(208, 188, 255, 0.18);
            color: $md-primary-dark;
        }
    }

    // Ripple effect
    &::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 0;
        height: 0;
        background: rgba(103, 80, 164, 0.18);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s, opacity 0.3s;
        opacity: 0;
        pointer-events: none;
    }

    &:active::after {
        width: 120%;
        height: 120%;
        opacity: 1;
        transition: width 0.2s, height 0.2s, opacity 0.2s;
    }

    // SVG icons should scale with button
    svg {
        width: clamp(1rem, 4cqi, 1.5rem);
        height: clamp(1rem, 4cqi, 1.5rem);
    }
}

.numpad-number {
    background: $md-surface;
    color: $md-on-surface;
    box-shadow: 0 1px 2px rgba(60, 60, 60, 0.08);

    .numpad-dark & {
        background: $md-surface-dark;
        color: $md-on-surface-dark;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
    }

    &:hover {
        background: rgba(103, 80, 164, 0.08);
        color: $md-primary;
    }

    &:active {
        background: rgba(103, 80, 164, 0.16);
        color: $md-primary;
    }

    .numpad-dark & {
        &:hover {
            background: rgba(208, 188, 255, 0.10);
            color: $md-primary-dark;
        }

        &:active {
            background: rgba(208, 188, 255, 0.18);
            color: $md-primary-dark;
        }
    }
}

.numpad-action {
    background: $md-primary;
    color: $md-on-primary;
    box-shadow: 0 2px 8px rgba(103, 80, 164, 0.10);

    .numpad-dark & {
        background: $md-primary-dark;
        color: $md-on-primary-dark;
        box-shadow: 0 2px 8px rgba(208, 188, 255, 0.10);
    }

    &:hover {
        background: darken($md-primary, 8%);
    }

    &:active {
        background: darken($md-primary, 16%);
    }

    .numpad-dark & {
        &:hover {
            background: darken($md-primary-dark, 8%);
        }

        &:active {
            background: darken($md-primary-dark, 16%);
        }
    }
}

// Typography
.numpad-btn {
    font-family: "Roboto", "Helvetica Neue", Arial, sans-serif;
    letter-spacing: 0.02em;
}

// Container queries for responsive design
@container (max-width: 500px) {
    .numpad {
        border-radius: min(6cqi, 24px);
        padding: min(6cqi, 24px) min(7cqi, 28px);
    }
    
    .numpad-grid {
        gap: min(4cqi, 16px);
    }
    
    .numpad-row, .numpad-actions {
        gap: min(4cqi, 16px);
    }
    
    .numpad-btn {
        min-height: min(15cqi, 60px);
        max-height: min(18cqi, 80px);
        font-size: clamp(1.1rem, 6cqi, 1.8rem);
        border-radius: min(4cqi, 16px);
    }
}

@container (max-width: 300px) {
    .numpad {
        border-radius: min(8cqi, 20px);
        padding: min(8cqi, 20px);
    }
    
    .numpad-grid {
        gap: min(5cqi, 12px);
    }
    
    .numpad-row, .numpad-actions {
        gap: min(5cqi, 12px);
    }
    
    .numpad-btn {
        min-height: min(18cqi, 50px);
        max-height: min(20cqi, 70px);
        font-size: clamp(1rem, 7cqi, 1.6rem);
        border-radius: min(5cqi, 12px);
    }
}

@container (max-width: 200px) {
    .numpad {
        padding: 8px;
        border-radius: 8px;
    }
    
    .numpad-grid {
        gap: 6px;
    }
    
    .numpad-row, .numpad-actions {
        gap: 6px;
    }
    
    .numpad-btn {
        min-height: 40px;
        max-height: 50px;
        font-size: 0.9rem;
        border-radius: 6px;
    }
}
</style>