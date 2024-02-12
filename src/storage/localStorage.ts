type StorageObject = { [name: string]: any };

const IS_ENABLED = "isExtensionEnabled";

export const isExtensionEnabled = async (): Promise<boolean> => {
    const isEnabled = await getFromLocalStorage(IS_ENABLED) as boolean | undefined;
    return isEnabled ?? false;
}

export const setIsExtensionEnabled = async (isEnabled: boolean): Promise<void> => {
    return saveToLocalStorage({[IS_ENABLED]: isEnabled});
}

const getFromLocalStorage = async function (key: string): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, value => resolve(value[key]));
        } catch (e) {
            reject(e);
        }
    });
};

export const saveToLocalStorage = async function (obj: StorageObject): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.set(obj, () => resolve());
        } catch (ex) {
            reject(ex);
        }
    });
};

export const removeFromLocalStorage = async function (keys: string | string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.remove(keys, () => resolve());
        } catch (ex) {
            reject(ex);
        }
    });
};
