/*
 * Copyright (C) 2025-Present booploops and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import type { Languages } from '../types/Languages';

export class KeyboardLayout {
    name: string = '';
    flag: string = '';
    code: Languages = 'en-US';
    normal: string[] = [];
    shift: string[] = [];

    keyboardClasses: string[] = [];
    /**
     * If enabled, the shift key will lock the shift state until the shift key is pressed again.
     */
    shiftLock: boolean = false;

    constructor(args: Partial<KeyboardLayout> = {}) {
        Object.assign(this, args);
    }
}