class SafeError extends Error {
  constructor(message: string = 'Something went wrong') {
    super(message);
    this.name = 'SafeError';
  }
}

type Safe<T> =
  | {
      success: true;
      data: T;
      safeError?: never;
    }
  | {
      success: false;
      data?: never;
      safeError: SafeError;
    };

function safe<T>(
  promise: Promise<T>,
  safeError?: SafeError,
  finallyCallback?: () => void,
): Promise<Safe<T>>;

function safe<T>(
  func: () => T,
  safeError?: SafeError,
  finallyCallback?: () => void,
): Safe<T>;

function safe<T>(
  promiseOrFunc: Promise<T> | (() => T),
  safeError?: SafeError,
  finallyCallback?: () => void,
): Promise<Safe<T>> | Safe<T> {
  if (promiseOrFunc instanceof Promise) {
    return safeAsync(promiseOrFunc, safeError, finallyCallback);
  }
  return safeSync(promiseOrFunc, safeError, finallyCallback);
}

async function safeAsync<T>(
  promise: Promise<T>,
  safeError?: SafeError,
  finallyCallback?: () => void,
): Promise<Safe<T>> {
  try {
    const data = await promise;
    return { data, success: true };
  } catch (error) {
    return { success: false, safeError: handleError(error, safeError) };
  } finally {
    finallyCallback?.();
  }
}

function safeSync<T>(
  func: () => T,
  safeError?: SafeError,
  finallyCallback?: () => void,
): Safe<T> {
  try {
    const data = func();
    return { data, success: true };
  } catch (error) {
    return { success: false, safeError: handleError(error, safeError) };
  } finally {
    finallyCallback?.();
  }
}

function handleError(error: unknown, safeError?: SafeError): SafeError {
  if (safeError !== undefined) {
    return safeError;
  }
  if (error instanceof Error) {
    return error;
  }
  return new SafeError('An unknown error occurred');
}

export { safe, safeAsync, safeSync, SafeError };
