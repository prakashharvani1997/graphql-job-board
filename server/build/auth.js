import { expressjwt } from "express-jwt";
import { getUserByEmail } from "./db/users.js";
import jwt from "jsonwebtoken";
const secret = Buffer.from('test', 'base64');
export const authMiddleware = expressjwt({
    algorithms: ['HS256'],
    credentialsRequired: false,
    secret
});
export async function handleSignin(req, res) {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user || user.password !== password) {
        res.sendStatus(401);
    }
    else {
        const claims = { sub: user.id, email: user.email };
        const token = jwt.sign(claims, secret);
        res.json({ token });
    }
}
