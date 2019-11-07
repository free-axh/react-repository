import cryptoJS from 'crypto-js';

/**
 * AES 秘钥
 */
const AesKey = 'E15S3A4F5R6E7G8S';


// AES-128-CBC偏移量
const CBCIV = '0000000000000000';

/**
 * AES 加密 CBC
 */
export const encrypt = (word) => {
  const key = cryptoJS.enc.Utf8.parse(AesKey);
  const srcs = cryptoJS.enc.Utf8.parse(word);
  const encrypted = cryptoJS.AES.encrypt(srcs, key, {
    mode: cryptoJS.mode.CBC,
    padding: cryptoJS.pad.Pkcs7,
    iv: cryptoJS.enc.Utf8.parse(CBCIV),
  });
  return encrypted.toString();
};
