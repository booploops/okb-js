
const INPUT_TYPES = ['text', 'password', 'email', 'search', 'tel', 'url', 'number'];

const ALLOWED_TAGS = ['input', 'textarea'];

export function canSelectElement(element: HTMLElement | null): boolean {
    if (!element) return false;

    const tagName = element.tagName.toLowerCase();
    const isReadonly = element.hasAttribute('readonly');
    const isDisabled = element.hasAttribute('disabled');
    const canBeEdited = !isReadonly && !isDisabled;
    if (ALLOWED_TAGS.includes(tagName) && canBeEdited) {
        if (tagName === 'input') {
            const type = element.getAttribute('type') || 'text';
            return INPUT_TYPES.includes(type);
        }
        return true; // textarea or other allowed tag
    }

    return false;
}