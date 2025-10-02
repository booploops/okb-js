/*
 * Copyright (C) 2025-Present booploops and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Purpose: Provide comprehensive keyboard layout for Japanese
 * Layout includes all hiragana characters organized by consonant groups (gojūon)
 * Shift provides katakana equivalents
 */
import { KeyboardLayout } from "./KeyboardLayout";

export default new KeyboardLayout({
    keyboardClasses: ['small-key-height'],
    normal: [
        "あ い う え お わ を ん ー 〜",
        "か き く け こ が ぎ ぐ げ ご",
        "さ し す せ そ ざ じ ず ぜ ぞ",
        "た ち つ て と だ ぢ づ で ど",
        "な に ぬ ね の は ひ ふ へ ほ",
        "ま み む め も ば び ぶ べ ぼ",
        "や ゆ よ ぱ ぴ ぷ ぺ ぽ",
        "ら り る れ ろ 、 。 「 」 ・",
        "ぁ ぃ ぅ ぇ ぉ っ ゃ ゅ ょ ゎ",
    ],
    shift: [
        "ア イ ウ エ オ ワ ヲ ン ー 〜",
        "カ キ ク ケ コ ガ ギ グ ゲ ゴ",
        "サ シ ス セ ソ ザ ジ ズ ゼ ゾ",
        "タ チ ツ テ ト ダ ヂ ヅ デ ド",
        "ナ ニ ヌ ネ ノ ハ ヒ フ ヘ ホ",
        "マ ミ ム メ モ バ ビ ブ ベ ボ",
        "ヤ ユ ヨ パ ピ プ ペ ポ",
        "ラ リ ル レ ロ 、 。 「 」 ・",
        "ァ ィ ゥ ェ ォ ッ ャ ュ ョ ヮ",
    ]
});