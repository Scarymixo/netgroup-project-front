/// <reference types="vite/client" />

declare module 'bootstrap' {
  export class Modal {
    constructor(element: Element | string, options?: Record<string, unknown>);
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;
    static getInstance(element: Element): Modal | null;
    static getOrCreateInstance(element: Element, options?: Record<string, unknown>): Modal;
  }

  export class Offcanvas {
    constructor(element: Element | string, options?: Record<string, unknown>);
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;
    static getInstance(element: Element): Offcanvas | null;
    static getOrCreateInstance(element: Element, options?: Record<string, unknown>): Offcanvas;
  }
}
