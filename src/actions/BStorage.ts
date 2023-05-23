import EncryptedStorage from "react-native-encrypted-storage";

type Dict<T> = Record<string, T>;

class BStorage {
    async getItem(key: string): Promise<Dict> {
        return EncryptedStorage.getItem(key)
            .then((result) => {
                if (result) {
                    return JSON.parse(result);
                }
                return undefined;
            })
            .catch((err) => {
                throw new Error(err);
            });
    }

    async setItem(key: string, item: Dict): Promise<void> {
        return EncryptedStorage.setItem(key, JSON.stringify(item));
    }

    async deleteItem(key: string): Promise<void> {
        return EncryptedStorage.removeItem(key);
    }

    async clearItem(): Promise<void> {
        return EncryptedStorage.clear();
    }
}

const bStorage = new BStorage();

export default bStorage;
