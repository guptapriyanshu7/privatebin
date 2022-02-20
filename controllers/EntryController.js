const Data = require('../models/data');
const cryptoUtils = require('../cryptoUtils');

exports.getDefaultPage = function (req, res) {
  res.render('index');
};

exports.getMySnippets = function (req, res) {
  res.render('mySnippets');
};

exports.saveEntry = async function (req, res) {
  let plainOrEncryptedData = req.body['data'];
  let iv;

  if (req.body['secret']) {
    const secretHash = cryptoUtils.hash(req.body['secret']);
    const encDataAndIv = cryptoUtils.encrypt(plainOrEncryptedData, secretHash);

    plainOrEncryptedData = encDataAndIv.encryptedData;
    iv = encDataAndIv.iv;
  }

  const data = new Data({ text: plainOrEncryptedData, iv });
  await data.save();

  res.send({
    id: data._id,
    url: req.headers.host + '/' + data._id,
    details: req.headers.host + '/details/' + data._id,
  });
};

exports.getEntryDetailPage = async function (req, res) {
  try {
    const data = await Data.findById(req.params.id);

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const date = new Date();

    data.access.push({ ip, date });
    await data.save();

    res.render('data', {
      data: data.text,
    });
  } catch (error) {
    res.render('data', {
      data: 'Something went wrong',
    });
  }
};

exports.detailsForEntry = async function (req, res) {
  try {
    const data = await Data.findById(req.params.id);

    res.render('details', {
      access: data.access,
    });
  } catch (error) {
    res.render('data', {
      data: 'Something went wrong',
    });
  }
};

exports.decrypt = async function (req, res) {
  try {
    const data = await Data.findById(req.body['id']);

    const secretHash = cryptoUtils.hash(req.body['secret']);
    const decryptedData = cryptoUtils.decrypt(data.text, secretHash, data.iv);

    res.send(decryptedData);
  } catch (error) {
    res.send('Something went wrong');
  }
};

exports.deleteEntry = async function (req, res) {
  await Data.findByIdAndDelete(req.params.id);
  res.send();
};
