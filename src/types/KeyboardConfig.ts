import { merge } from "lodash-es";

export class KeyboardConfig {
    theme: string = 'dark';
    language: string = 'en-US';
    autoCapitalizeOnEmpty: boolean = true;

    static parse(config: Partial<KeyboardConfig>) {
        const newConfig = merge(new KeyboardConfig(), config);
        return newConfig;
    }
}