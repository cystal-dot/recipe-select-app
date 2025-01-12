export const getLocalStorageData = (key: string): unknown[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};
