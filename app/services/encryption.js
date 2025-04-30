import CryptoJS from 'crypto-js';

// Secret key for encryption/decryption
const secretKey = 'SDJHFGSDJHFGSLKADGDSFG';

// Encrypt function (Base64 encoding)
export const encrypt = (data) => {
    // Encrypt data using AES and convert to Base64
    const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
    return encryptedData;
};

// Decrypt function (Base64 decoding)
export const decrypt = (encryptedData) => {
    // Decrypt data from Base64
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8); // Convert bytes to readable text
    return decryptedData;
};
