import crypto from "crypto";
// KEY - a secret key (32 bytes for AES-256) used for encryption and decryption of data. (convert to buffer)
// IV - initialization vector (16 bytes for AES) it is used to ensure randomness in encryption algorithms and make sure that the same plaintext encrypted multiple times will yield different ciphertexts each time.

const key = Buffer.from(process.env.ENCRYPTION_KEY as string, "base64");

export const encryptData = (data: string) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(data, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};

export const decryptData = (encrypted: string) => {
  const [ivHex, encryptedData] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};
