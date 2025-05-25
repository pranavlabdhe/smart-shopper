
// // cron/priceChecker.js
// const cron = require('node-cron');
// const TrackedProduct = require('../models/TrackedProduct');
// const { scrapeAmazon } = require('../scraper/amazonScraper');
// const { scrapeFlipkart } = require('../scraper/filpkartScraper');
// const { sendPriceDropEmail } = require('../utils/emailService');

// cron.schedule('* * * * *', async () => {
//   console.log('🔍 Running daily price check...');
//   const trackedItems = await TrackedProduct.find();

//   for (const item of trackedItems) {
//     try {
//       let products = [];
//       if (item.site === 'Amazon') {
//         products = await scrapeAmazon(item.productName);
//       } else if (item.site === 'Flipkart') {
//         products = await scrapeFlipkart(item.productName);
//       } else {
//         products = [
//           ...(await scrapeAmazon(item.productName)),
//           ...(await scrapeFlipkart(item.productName)),
//         ];
//       }

//       const match = products.find(p => p.url === item.platform);
//       if (!match) continue;

//       const currentPrice = match.price;
//       if (currentPrice <= item.desiredPrice) {
//         // Avoid spamming: send only if not notified in last 24h
//         const now = new Date();
//         if (!item.lastNotified || now - item.lastNotified > 24 * 60 * 60 * 1000) {
//           await sendPriceDropEmail(item.userEmail, item);
//           item.lastNotified = now;
//           await item.save();
//           console.log(`📧 Email sent to ${item.userEmail}`);
//         }
//       }
//     } catch (err) {
//       console.error(`Error checking product ${item.productName}:`, err.message);
//     }
//   }
// });




// cron/priceChecker.js
const cron = require('node-cron');
const TrackedProduct = require('../models/TrackedProduct');
const { scrapeAmazon } = require('../scraper/amazonScraper');
const { scrapeFlipkart } = require('../scraper/filpkartScraper');
const { sendPriceDropEmail } = require('../utils/emailService');

cron.schedule('* * * * *', async () => {
  console.log('🔍 Running daily price check...');
  const trackedItems = await TrackedProduct.find();

  for (const item of trackedItems) {
    try {
      let products = [];
      if (item.site === 'Amazon') {
        products = await scrapeAmazon(item.productName);
      } else if (item.site === 'Flipkart') {
        products = await scrapeFlipkart(item.productName);
      } else {
        products = [
          ...(await scrapeAmazon(item.productName)),
          ...(await scrapeFlipkart(item.productName)),
        ];
      }
      console.log('🔗 Tracked platform URL:', item.platform);
      console.log('🔎 Scraped product URLs:');
      products.forEach(p => console.log('👉', p.url));
      const match = products.find(p => p.url === item.platform);
      if (!match) continue;

      const currentPrice = match.price;
      if (currentPrice <= item.desiredPrice) {
        // Removed the lastNotified check for testing
        await sendPriceDropEmail(item.userEmail, item);
        item.lastNotified = new Date();
        await item.save();
        console.log(`📧 Email sent to ${item.userEmail}`);
      }
    } catch (err) {
      console.error(`Error checking product ${item.productName}:`, err.message);
    }
  }
});

