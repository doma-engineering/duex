const jsonResp = async (fetchF) => {
    try {
        const resp = await fetchF;
        try {
            const json = await resp.json();
            return { status: resp.status, json: json };
        } catch (e) {
            return { status: -2, json: undefined, error: { error: "can't decode JSON", details: e } };
        }
    } catch (e) {
        return { status: -1, json: undefined, error: { error: "can't perform fetch", details: e } };
    }
}

const jsonReq = async (path, xkv) => {
    return await fetch(path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(xkv)
    });
}

const foldReq = (foldableXkvs) => {
    var req = {};
    for (xkv in foldableXkvs) {
        req = { ...req, ...foldableXkvs[xkv] };
    }
    return async (path) => {
        return await jsonReq(path, req);
    }
}

const reqDo = async (path, xkv) => {
    return await jsonResp(jsonReq(path, xkv));
}

const foldReqDo = async (path, foldableXkvs) => {
    return await jsonResp(foldReq(foldableXkvs)(path));
}
