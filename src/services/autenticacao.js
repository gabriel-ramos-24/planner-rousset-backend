import jwt from "@tsndr/cloudflare-worker-jwt";

export async function gerarToken(env, senha) {

    if (senha !== env.SENHA_MESTRE) {
        return Response.json({ mensagem: "Senha incorreta!" }, { status: 403 });
    }

    const agoraUTC = Math.floor(Date.now() / 1000);

    const payload = {
        "iat": agoraUTC,
        "exp": agoraUTC + 21600
    };

    const tokenGerado = await jwt.sign(payload, env.JWT_SECRET);

    return Response.json({ token: tokenGerado, mensagem: "Token entregue." }, { status: 200 });
}

export async function validarToken(env, token) {

    const isValid = await jwt.verify(token, env.JWT_SECRET);

    if (!isValid) return null;

    const decoded = jwt.decode(token);

    if (!decoded || !decoded.payload) return null;

    const payload = decoded.payload;

    return payload;
}