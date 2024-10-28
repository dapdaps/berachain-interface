import { useCallback, useEffect, useState } from "react";

export default function useTipModal(boxRef: any) {
    const [showTip, setTipShow] = useState(false)

    const domClick = useCallback((e: any) => {
        const isChild = boxRef.current?.contains(e.target);
        if (!isChild) {
            setTipShow(false);
        }
    }, [])

    useEffect(() => {
        document.addEventListener('click', domClick, false)

        return () => {
            document.removeEventListener('click', domClick)
        }
    }, [])

    return {
        showTip,
        setTipShow
    }
}