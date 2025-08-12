export class KeyboardLayout {
    normal: string[] = [];
    shift: string[] = [];

    constructor(args: Partial<KeyboardLayout> = {}) {
        Object.assign(this, args);
    }
}