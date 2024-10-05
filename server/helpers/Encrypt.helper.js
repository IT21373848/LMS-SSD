import fs from "fs"
import crypto from "crypto"
import path from "path"

const algorithm = "aes-256-ctr";
const secretKey = "blabla";

export const encryptFile = (filePath, encryptedPath) => {
    const cipher = crypto.createCipher(algorithm, secretKey);
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(encryptedPath);
  
    return new Promise((resolve, reject) => {
      input.pipe(cipher).pipe(output).on("finish", resolve).on("error", reject);
    });
  };
  
export const decryptFile = (encryptedPath, decryptedPath) => {
    const decipher = crypto.createDecipher(algorithm, secretKey);
    const input = fs.createReadStream(encryptedPath);
    const output = fs.createWriteStream(decryptedPath);
  
    return new Promise((resolve, reject) => {
      input.pipe(decipher).pipe(output).on("finish", resolve).on("error", reject);
    });
};