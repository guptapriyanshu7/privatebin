const Data = require('../models/data');

exports.getDefaultPage = function (req, res) {
  res.render('index');
};

exports.saveEntry = async function (req, res) {
  const data = new Data({ text: req.body['data'] });
  await data.save();

  res.send(req.headers.host + '/' + data._id);
};

exports.getEntryDetailPage = async function (req, res) {
  try {
    const data = await Data.findById(req.params.id);

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const date = new Date();

    console.log(ip, date);

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
