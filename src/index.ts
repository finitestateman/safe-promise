type Safe<T> =
| {
    success: true;
    data: T;
}
| {
    success: false;
    error: string;
};

function safe<T>(promise: Promise<T>, err?: string, finallyCallback?: () => void): Promise<Safe<T>>;
function safe<T>(func: () => T, err?: string, finallyCallback?: () => void): Safe<T>;
function safe<T>(
    promiseOrFunc: Promise<T> | (() => T),
    err?: string,
    finallyCallback?: () => void
): Promise<Safe<T>> | Safe<T> {
    if (promiseOrFunc instanceof Promise) {
        return safeAsync(promiseOrFunc, err, finallyCallback);
    }
    return safeSync(promiseOrFunc, err, finallyCallback);
}

async function safeAsync<T>(
    promise: Promise<T>, 
    err?: string,
    finallyCallback?: () => void
): Promise<Safe<T>> {
    try {
        const data = await promise;
        return { data, success: true };
    } catch (e) {
        if (err !== undefined) {
            return { success: false, error: err };
        }
        if (e instanceof Error) {
            return { success: false, error: e.message };
        }
        return { success: false, error: "Something went wrong" };
    } finally {
        finallyCallback?.();
    }
}

function safeSync<T>(
    func: () => T, 
    err?: string,
    finallyCallback?: () => void
): Safe<T> {
    try {
        const data = func();
        return { data, success: true };
    } catch (e) {
        if (err !== undefined) {
            return { success: false, error: err };
        }
        if (e instanceof Error) {
            return { success: false, error: e.message };
        }
        return { success: false, error: "Something went wrong" };
    } finally {
        finallyCallback?.();
    }
}

export { safe, safeAsync, safeSync };
