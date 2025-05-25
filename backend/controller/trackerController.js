// controllers/trackerController.js
// const TrackedProduct = require('../models/TrackedProduct');

// exports.addTrackedProduct = async (req, res) => {
//   try {
//     const { productName, platform, desiredPrice, userEmail, site } = req.body;
//     if (!productName || !platform || !desiredPrice || !userEmail)
//       return res.status(400).json({ message: 'Missing required fields' });

//     const tracked = await TrackedProduct.create({
//       productName, platform, desiredPrice, userEmail, site
//     });

//     res.status(201).json({ message: 'Tracking started', tracked });
//   } catch (err) {
//     res.status(500).json({ message: 'Error tracking product', error: err.message });
//   }
// };





const TrackedProduct = require('../models/TrackedProduct');

exports.addTrackedProduct = async (req, res) => {
  try {
    const { productName, platform, desiredPrice, userEmail, site } = req.body;

    if (!productName || !platform || !desiredPrice || !userEmail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const tracked = await TrackedProduct.create({
      productName,
      platform,
      desiredPrice,
      userEmail,
      site
    });

    res.status(201).json({ message: 'Product tracking started successfully.', tracked });
  } catch (err) {
    res.status(500).json({
      message: 'Error starting product tracking',
      error: err.message
    });
  }
};
