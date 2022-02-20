const crypto = require('crypto');

const algorithm = 'AES-256-CBC';

exports.encrypt = function (text, secretHash) {
  const initVector = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretHash, 'hex'),
    initVector
  );

  const encryptedData = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    encryptedData: encryptedData.toString('hex'),
    iv: initVector.toString('hex'),
  };
};

exports.decrypt = function (encryptedData, secretHash, initVectorStr) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretHash, 'hex'),
    Buffer.from(initVectorStr, 'hex')
  );

  const decryptedData = Buffer.concat([
    decipher.update(Buffer.from(encryptedData, 'hex')),
    decipher.final(),
  ]);

  return decryptedData.toString('utf8');
};

exports.hash = function (secret) {
  const hash = crypto.createHash('sha256');
  hash.update(secret);
  const digest = hash.digest('hex');
  return digest;
};
