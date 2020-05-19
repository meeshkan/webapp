const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = process.env.GH_TOKEN_SIGNING_KEY;

export interface IEncryptedString { iv: string, encryptedData: string}

export function encrypt(text: string, iv: Buffer) {
 let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

export function decrypt(text: IEncryptedString): string {
 let iv = Buffer.from(text.iv, 'hex');
 let encryptedText = Buffer.from(text.encryptedData, 'hex');
 let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}