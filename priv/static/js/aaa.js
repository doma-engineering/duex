////
// https://github.com/doma-engineering/doauthor-js#adding-to-your-website
//
// Namely:
// The reason why you can't add it [doauthor initialisation] in window.onload is that we're using sodium.js underneath, which loads asynchronously and independently from window, calling its own window.sodium.onload hook.
////
const withDoAuthor = async (awayWeGo) => {
    try {
        const _lightsOut = await DoAuthorBootstrapper.main();
        return awayWeGo();
    } catch (e) {
        console.log("DoAuthor or its payload has failed", e);
    }
}

const fz = () => { return 0; }

const mkIdentity = async (password) => {
    await withDoAuthor(fz);

    const mkey = doauthor.crypto.mainKey(password);
    const skp = doauthor.crypto.deriveSigningKeypair(mkey, 1);
    const show = doauthor.crypto.show;
    return { secret: show(skp.secret), public: show(skp.public) };
}

const register = async (skp, captchaToken, meta) => {

    console.log(skp);

    const pk = getIn(skp, ['public'], '');
    const sk = getIn(skp, ['secret'], '');
    const name = getIn(meta, ['name']);
    var skp_raw = undefined;

    try {
        if (name === undefined) {
            throw "Missing `name`";
        }

        await withDoAuthor(fz);
        skp_raw = { public: doauthor.crypto.read(skp.public), secret: doauthor.crypto.read(skp.secret) };
        console.log(skp_raw);

        const req0 = {
            credential: doauthor.credential.from_claim(
                skp_raw,
                {
                    me: skp.public,
                    // We currently only support (and require) names in metadata, but see
                    // https://github.com/doma-engineering/megalith/issues/39
                    // https://github.com/doma-engineering/megalith/issues/41
                    // https://github.com/doma-engineering/megalith/issues/40
                    name: meta.name
                }
            )
        }
        const req1 = {
            captchaToken: captchaToken
        }

        // This assumes that users of arclight shall route requests to arclight router via /arc/.
        // Perhaps we want to let the caller of register configure this via opts argument a la elixir.
        return await foldReqDo('/arc/register', [req0, req1]);
    } catch (e) {
        return {
            status: -500,
            json: undefined,
            error: {
                error: "invalid inputs",
                details: e,
                validation: {
                    hasCaptcha: !!captchaToken,
                    publicLengthEqualsToCryptoSignED25519_PUBLICKEYBYTES:
                        32 === getIn(skp_raw, ['public'], new ArrayBuffer()).byteLength,
                    secretLengthEqualsToCryptoSignED25519_SECRETKEYBYTES:
                        32 + 32 === getIn(skp_raw, ['secret'], new ArrayBuffer()).byteLength,
                    nameIsSet: !!name
                }
            }
        }
    }
}
