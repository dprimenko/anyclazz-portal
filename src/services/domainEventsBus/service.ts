export function publish<T>(eventName: string, detail?: T) {
	const customEvent = new CustomEvent(eventName, detail ? { detail } : {});
    window.dispatchEvent(customEvent);
}

export function subscribe<T extends Partial<Record<string, any>>>(name: string, listener: (event: CustomEvent<T>) => void, options?: boolean | AddEventListenerOptions) {
	window.addEventListener(name, listener as EventListener, options);
}

export function unsubscribe<T extends Partial<Record<string, any>>>(eventName: string, listener: (event: CustomEvent<T>) => void, options?: boolean | AddEventListenerOptions): void {
	window.removeEventListener(eventName, listener as EventListener, options);
}