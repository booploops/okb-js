/*
 * Copyright (C) 2025-Present booploops and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import enUS from "./en-US";
import esES from "./es-ES";
import jaJP from "./ja-JP";

const layouts = {
  "en-US": enUS,
  "es-ES": esES,
  "ja-JP": jaJP,
};

export type Languages = keyof typeof layouts | (string & {});
export default layouts;
