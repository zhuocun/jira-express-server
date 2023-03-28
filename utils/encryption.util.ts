import crypto from "crypto";

const encrypt = (data: string): string => {
    return crypto
        .createHash("md5")
        .update("zhuocun" + data)
        .digest("hex");
};

export default encrypt;
