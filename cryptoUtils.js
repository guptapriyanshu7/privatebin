const crypto = require('crypto');
const argon2 = require('argon2');

const algorithm = 'AES-256-CBC';

const generateKey = function (hash) {
  return crypto.createHash('sha256').update(hash).digest();
};

exports.encrypt = function (text, secretHash) {
  const initVector = crypto.randomBytes(16);
  const key = generateKey(secretHash);

  const cipher = crypto.createCipheriv(algorithm, key, initVector);

  const encryptedData = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    encryptedData: encryptedData.toString('hex'),
    iv: initVector.toString('hex'),
  };
};

exports.decrypt = function (encryptedData, secretHash, initVectorStr) {
  const key = generateKey(secretHash);

  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(initVectorStr, 'hex')
  );

  const decryptedData = Buffer.concat([
    decipher.update(Buffer.from(encryptedData, 'hex')),
    decipher.final(),
  ]);

  return decryptedData.toString('utf8');
};

exports.hash = async function (secret) {
  const hash = await argon2.hash(secret);
  return hash;
};

exports.verify = function (hash, secret) {
  return argon2.verify(hash, secret);
};
