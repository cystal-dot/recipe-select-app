export const getLocalStorageData = (key: string): any[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};
