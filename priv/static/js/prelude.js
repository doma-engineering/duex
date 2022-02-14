const getIn = (xkv, ps, fallbackV) => {
    try {
        const res = ps.reduce((xkv_current, k) => xkv_current[k], xkv)
        if (res === undefined) {
            throw "Undefined is not OK for us";
        }
        return res;
    } catch (e) {
        return fallbackV;
    }
}

const jtoa = (x) => JSON.stringify(x)
