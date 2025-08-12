import { targetElement } from "./state";
import { canSelectElement } from "./utils";

export function bindKeyboard(doc: Document) {
    doc.addEventListener('keydown', () => {
        targetElement.value = undefined;
    });

    doc.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.getAttribute('okb-ignore') !== null) {
            return;
        }
        if (
            canSelectElement(target)
        ) {
            targetElement.value = target as HTMLInputElement;
        } 
    });

    // find any okb-frame
    const frames = doc.querySelectorAll('[okb-frame]') as NodeListOf<HTMLIFrameElement>;
    frames.forEach(frame => {
        if (frame.contentDocument && frame.contentDocument.readyState === 'complete') {
            bindKeyboard(frame.contentDocument);
        } else {
            frame.addEventListener('load', () => {
                bindKeyboard(frame.contentDocument!);
            });
        }
    });

    // Watch for new okb-frame elements added dynamically
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (
                    node instanceof HTMLIFrameElement &&
                    node.getAttribute('okb-frame') !== null
                ) {
                    const frame = node as HTMLIFrameElement;
                    if (frame.contentDocument && frame.contentDocument.readyState === 'complete') {
                        bindKeyboard(frame.contentDocument);
                    } else {
                        frame.addEventListener('load', () => {
                            bindKeyboard(frame.contentDocument!);
                        });
                    }
                }
            });
        });
    });

    observer.observe(doc.body, { childList: true, subtree: true });
}