import jwt from "jsonwebtoken";

const sign = async (userInfo: string | object | Buffer): Promise<string> => {
    return jwt.sign({ userInfo }, process.env.UUID ?? "", {
        expiresIn: 60 * 60 * 24
    });
};

export default sign;
