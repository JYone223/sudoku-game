const createEvent = <T extends string>() => {
  const listeners: Record<string, ((...args: any[]) => void)[]> = {};

  return {
    on: (event: T, callback: (...args: any[]) => void) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(callback);
    },
    off: (event: T, callback: (...args: any[]) => void) => {
      if (!listeners[event]) return;
      listeners[event] = listeners[event].filter((fn) => fn !== callback);
    },
    emit: (event: T, ...args: any[]) => {
      if (!listeners[event]) return;
      listeners[event].forEach((fn) => fn(...args));
    },
  };
};

export const { on, off, emit } = createEvent<'add' | 'remove'>();
