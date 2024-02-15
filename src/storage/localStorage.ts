type StorageObject = { [name: string]: unknown };

// Creating this as a dict, as we might want to save some metadata under the same key.
export type CompanyData = {
    companies: string[];
}

const IS_ENABLED = "isExtensionEnabled";
const COMPANY_DATA = "companyData";

export const isExtensionEnabled = async (): Promise<boolean> => {
    const isEnabled = await getFromLocalStorage(IS_ENABLED) as boolean | undefined;
    return isEnabled ?? false;
}

export const setIsExtensionEnabled = async (isEnabled: boolean): Promise<void> => {
    return saveToLocalStorage({[IS_ENABLED]: isEnabled});
}

export const getCompanyData = async (): Promise<CompanyData> => {
    const companyData = await getFromLocalStorage(COMPANY_DATA) as CompanyData | undefined;
    return companyData ?? { companies: [] };
}

export const setCompanyData = async (companyData: CompanyData): Promise<void> => {
    return saveToLocalStorage({[COMPANY_DATA]: companyData});
}

const getFromLocalStorage = async function (key: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, value => resolve(value[key]));
        } catch (e) {
            reject(e);
        }
    });
};

const saveToLocalStorage = async function (obj: StorageObject): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.set(obj, () => resolve());
        } catch (ex) {
            reject(ex);
        }
    });
};
