//ref: https://stackoverflow.com/a/78492203/6430433

import { useEffect, useState } from "react";

const useEffectOnNextRender = (callback: React.EffectCallback) => {
    const [scheduled, setScheduled] = useState(false);

    useEffect(() => {
        if (!scheduled) {
            return;
        }

        setScheduled(false);
        callback();
    }, [scheduled]);

    return () => setScheduled(true);
};

export default useEffectOnNextRender;