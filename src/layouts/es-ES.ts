/*
 * Copyright (C) 2025-Present booploops and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Purpose: Provide keyboard layout for Spanish (Spain and Latin America)
 */
import { KeyboardLayout } from "./KeyboardLayout";

export default new KeyboardLayout({
    normal: [
        "1 2 3 4 5 6 7 8 9 0 ' ¡",
        "q w e r t y u i o p ` +",
        "a s d f g h j k l ñ { }",
        "z x c v b n m , . -",
    ],
    shift: [
        "! \" · $ % & / ( ) = ? ¿",
        "Q W E R T Y U I O P ^ *",
        "A S D F G H J K L Ñ [ ]",
        "Z X C V B N M ; : _",
    ]
});