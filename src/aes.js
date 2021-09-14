import aes256 from "aes256";

export const doEncrypt = (key, text) => {
    if(key !== "") {
        var encrypted = aes256.encrypt(key, text);
        return encrypted;
    } else {
        return text;
    }
}

export const doDecrypt = (key, text) => {
    if(key !== "") {
        try {
            var decrypted = aes256.decrypt(key, text);
            return decrypted;
        } catch (TypeError) {
            /* message without encryption */
            return text;
        }
    } else {
        return text;
    }
}