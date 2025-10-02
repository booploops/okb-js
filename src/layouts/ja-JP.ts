/*
 * Copyright (C) 2025-Present booploops and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Purpose: Provide keyboard layout for Japanese (JIS standard)
 */
import { KeyboardLayout } from "./KeyboardLayout";

export default new KeyboardLayout({
    normal: [
        "1 2 3 4 5 6 7 8 9 0",
        "た て い す か ん な に ら せ",
        "ち と し は き く ま の り れ け む",
        "つ さ そ ひ こ み も ね る め ろ や",
    ],
    shift: [
        "1 2 3 4 5 6 7 8 9 0",
        "タ テ イ ス カ ン ナ ニ ラ セ",
        "チ ト シ ハ キ ク マ ノ リ レ ケ ム",
        "ツ サ ソ ヒ コ ミ モ ネ ル メ ロ ヤ",
    ]
});