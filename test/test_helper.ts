// test/test_helper.ts
import { JSDOM } from 'jsdom';

const exposedProperties = ['window', 'navigator', 'document'];

(globalThis as any).dom = new JSDOM('<body></body>');
(globalThis as any).window = (globalThis as any).dom.window.document.defaultView;

Object.keys((globalThis as any).dom.window.document.defaultView).forEach((property) => {
    if (typeof (globalThis as any)[property] === 'undefined') {
        exposedProperties.push(property);
        (globalThis as any)[property] = (globalThis as any).dom.window.document.defaultView[property];
    }
});

// Patch navigator.userAgent if possible, otherwise patch the userAgent property directly
try {
    Object.defineProperty((globalThis as any).window, 'navigator', {
        value: { userAgent: 'node.js' },
        configurable: true
    });
} catch (e) {
    // fallback for environments where navigator is read-only
    try {
        Object.defineProperty((globalThis as any).window.navigator, 'userAgent', {
            value: 'node.js',
            configurable: true
        });
    } catch (e2) {
        // ignore if cannot patch
    }
}

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
