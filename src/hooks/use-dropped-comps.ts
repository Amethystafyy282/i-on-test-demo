import {useCallback, useEffect, useState} from "react";
import {useLocalStorage} from "./use-local-storage";

export interface ComponentTypeProps {
    id: string;
    type: 'button' | 'paragraph';
}

export interface ButtonComponentTypeProps extends ComponentTypeProps {
    type: 'button';
    buttonText: string;
    alertMessage: string;
}

export interface ParagraphComponentTypeProps extends ComponentTypeProps {
    type: 'paragraph';
    paragraphText: string;
}

export type EditDroppedCompProps = Pick<ButtonComponentTypeProps, 'buttonText'> | Pick<ButtonComponentTypeProps, 'alertMessage'> | Pick<ParagraphComponentTypeProps, 'paragraphText'>

interface UseDroppedCompsProps {
    droppedComps: Array<ButtonComponentTypeProps | ParagraphComponentTypeProps>;
    addDroppedComp: (type: string) => void;
    editDroppedComp: (id: string, newProps: EditDroppedCompProps) => void;
    saveToStorage: () => void;
}

export const useDroppedComps = (): UseDroppedCompsProps => {
    const {get, set} = useLocalStorage();

    const [droppedComps, setDroppedComps] = useState<Array<ButtonComponentTypeProps | ParagraphComponentTypeProps>>([]);

    const addDroppedComp = useCallback((type: string) => {
        let item: ButtonComponentTypeProps | ParagraphComponentTypeProps | undefined = undefined;

        if (type === 'button') {
            item = {
                id: Math.random().toString(),
                type: 'button',
                buttonText: 'button',
                alertMessage: 'alert message',
            }
        }

        if (type === 'paragraph') {
            item = {
                id: Math.random().toString(),
                type: 'paragraph',
                paragraphText: 'paragraph',
            }
        }

        setDroppedComps((prev) => {
            const cloned = [...prev];
            return item ? [...cloned, item] : prev;
        })
    }, [setDroppedComps]);

    const editDroppedComp = useCallback((id: string, newProps: Pick<ButtonComponentTypeProps, 'buttonText'> | Pick<ButtonComponentTypeProps, 'alertMessage'> | Pick<ParagraphComponentTypeProps, 'paragraphText'>) => {
        if (!id) return;

        setDroppedComps((prev) => {
            const index = prev.findIndex((c) => c.id === id);

            if (index > -1) {
                const cloned = [...prev];
                cloned[index] = {
                    ...cloned[index],
                    ...newProps,
                }

                return cloned;
            }

            return prev;
        })
    }, [setDroppedComps])

    const saveToStorage = useCallback(() => {
        set(droppedComps)
        alert('Saved successfully');
    }, [droppedComps, set])

    const fetchFromLocal = () => {
        const fromLocal = get();
        if (Array.isArray(fromLocal) && fromLocal.length) setDroppedComps(fromLocal);
    }

    useEffect(() => {
        fetchFromLocal();

        if (typeof window !== 'undefined') {
            window.addEventListener('focus', fetchFromLocal);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('focus', fetchFromLocal);
            }
        }
    }, [])

    return {
        droppedComps,
        addDroppedComp,
        saveToStorage,
        editDroppedComp,
    }
}
