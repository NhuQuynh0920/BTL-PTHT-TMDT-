import jwt from 'jsonwebtoken';

const generateToken = (res, userId, rememberMe = false) => {
    const expiresInDays = rememberMe ? 30 : 1; // 30 days or 1 day
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: `${expiresInDays}d`
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // lax allows dev proxy to work
        maxAge: expiresInDays * 24 * 60 * 60 * 1000 // In milliseconds
    });

    return token;
};

export default generateToken;
