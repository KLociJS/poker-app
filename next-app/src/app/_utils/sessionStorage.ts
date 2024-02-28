const getSessionStorageItem = (key: string) => {
  return sessionStorage.getItem(key);
};

const setSessionStorageItem = (key: string, value: string) => {
  sessionStorage.setItem(key, value);
};

export { getSessionStorageItem, setSessionStorageItem };
