import EncryptedStorage from "react-native-encrypted-storage";

type Dict<T> = Record<string, T>;

class BStorage {
    static async getItem(key: string): Promise<Dict<any>> {
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

    static async setItem(key: string, item: Dict<any>): Promise<void> {
        return EncryptedStorage.setItem(key, JSON.stringify(item));
    }

    static async deleteItem(key: string): Promise<void> {
        return EncryptedStorage.removeItem(key);
    }

    static async clearItem(): Promise<void> {
        return EncryptedStorage.clear();
    }
}

export default BStorage;
