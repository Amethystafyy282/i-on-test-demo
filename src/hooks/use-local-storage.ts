const key = 'i-on-test-demo';

interface UseLocalStorageProps {
    get: () => any;
    set: (data: any) => void;
}

export const useLocalStorage = (): UseLocalStorageProps => {
    const get = () => {
        const fromLocal = localStorage.getItem(key);

        if (fromLocal) return JSON.parse(fromLocal);

        return null;
    }

    const set = (data: any) => {
        localStorage.setItem(key, JSON.stringify(data))
    }

    return {
        get,
        set,
    }
}
