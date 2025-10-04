<img width="1280" height="640" alt="Open Keyboard Banner" src="https://github.com/user-attachments/assets/c64f5871-b23f-45ec-b0de-f880e601ba91" />

# okb-js

**This project is still in early development.**

okb-js (short for Open Keyboard JS) is a simple drop-in On Screen Keyboard for web based applications.

This project was created out of a need for an on-screen keyboard for kiosk like environments, where the keyboard is not always available or provided by the operating system for `<input>` and `<textarea>` fields.

It is intended to be extremely portable, framework agnostic, and can be used in a variety of different environments. All from a single file.

okb-js is compiled for **ESM**, **IIFE** and **UMD** formats.

## Installation

```sh
pnpm add okb-js
# or
npm install okb-js
# or
yarn add okb-js
```

## CDN

## Usage Examples

### Enabling the keyboard for the entire DOM

**ESM**

```ts
import { bindKeyboard, init } from "okb-js";

document.addEventListener("DOMContentLoaded", () => {
  bindKeyboard(document);
  init();
});
```

**IIFE**

```html
<script src="path/to/okb.iife.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", () => {
    OKB.bindKeyboard(document);
    OKB.init();
  });
</script>
```

The IIFE version can be used directly from a CDN via a script tag.
```html
<script src="https://unpkg.com/okb-js@latest/dist/okb.iife.js"></script>
```

### Ignored Elements

You can ignore elements by adding the `okb-ignore` attribute to the element.

```html
<input type="text" placeholder="Text" okb-ignore />
```

### Number Types

You can specify the number type by adding the `okb-numtype` attribute to the element.
Currently supported number types are: `dec` (automatic decimal point, example: 123 -> 1.23)

```html
<input type="number" placeholder="Number" okb-numtype="dec" />
```

### Usage with `<iframe>`

The keyboard can be injected into an iframe by adding the `okb-frame` attribute to the iframe.

```html
<iframe src="path/to/iframe.html" okb-frame></iframe>
```

This scenario is useful for embedding the keyboard in a separate document, such as a popup or modal.

Alternatively, if the iframe has adequate privileges, the frame can request `bindKeyboard` from `top` or `parent` to bind the keyboard to the iframe.

#### Example implementation

```html
<!-- Parent Document -->
<iframe src="path/to/iframe.html" okb-frame="1"></iframe>
<script type="module">
  import { bindKeyboard } from "okb-js";

  /// ...

  window.OKB = {
    bindKeyboard,
  };
</script>
```

```html
<!-- Child Document -->
<script>
  // Calling the parent's bindKeyboard function will make it so that the parent's keyboard instance can be used in the child document
  parent.OKB.bindKeyboard(document);
</script>
```

## Configuration

```ts
OKB.init({
  // or simply init() when imported as a module
  enabled: true, // Whether the keyboard is enabled
  language: "en-US", // The language of the keyboard
  autoCapitalizeOnEmpty: true, // Whether to automatically capitalize the first letter of the input
  allowSwitchLanguage: true, // Allows the user to switch the language using the language picker
  allowedInputTypes: [
    "text",
    "password",
    "email",
    "search",
    "tel",
    "url",
    "number",
  ], // The input types that are allowed
  allowedTags: ["input", "textarea"], // The tags that are allowed
  ignoreSelectors: ["[okb-ignore]"], // The selectors that are ignored
  container: document.body, // The container of the keyboard
  attributeConfig: {
    NumberTypeAttribute: "okb-numtype", // The attribute that indicates the number type
    OverrideTypeAttribute: "okb-type", // The attribute that indicates the type
  },
});
```

## Goals

## Language Support

| Language      | Supported | Notes                |
| ------------- | --------- | -------------------- |
| English (US)  | ✅        | The default language |
| Spanish (ES)  | ✅        |                      |
| Japanese (JP) | ⚠️        | WIP                  |

## Technical Details

This project is built with Vue 3 and TypeScript and uses Web Components to add the keyboard to the DOM.

The web component itself has the Shadow DOM disabled, so it can be styled with CSS.

## License

This project is licensed under the Mozilla Public License 2.0 - see the [LICENSE](LICENSE) file for details.
