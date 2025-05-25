
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



require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

// Define schema and model (ideally, import from your models file)
const trackedProductSchema = new mongoose.Schema({
  userEmail: String,
  productName: String,
  platform: String,
  desiredPrice: Number,
});

const TrackedProduct =
  mongoose.models.TrackedProduct ||
  mongoose.model("TrackedProduct", trackedProductSchema);

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendPriceDropEmail(to, productName, currentPrice, url) {
  const mailOptions = {
    from: `"Price Tracker" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🔥 Price Drop Alert: ${productName}`,
    html: `
      <h3>Hey there! 🎉</h3>
      <p><strong>${productName}</strong> is now just <strong>₹${currentPrice}</strong></p>
      <p><a href="${url}" target="_blank">Click here to view the product</a></p>
      <p>– Your Price Tracker Bot</p>
    `,
  };

  try {
    // await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Email sending failed:`, error.message);
  }
}

async function fetchAmazonPrice(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);
    const selectors = [
      "#priceblock_ourprice",
      "#priceblock_dealprice",
      "#priceblock_saleprice",
      "#corePrice_feature_div span.a-offscreen",
      "span.a-price span.a-offscreen",
    ];

    for (const selector of selectors) {
      const priceText = $(selector).first().text().replace(/[₹,]/g, "").trim();
      if (priceText && !isNaN(priceText)) {
        return parseFloat(priceText);
      }
    }

    return null;
  } catch (err) {
    console.error("❌ Error fetching price:", err.message);
    return null;
  }
}

async function checkPrices() {
  try {
    const products = await TrackedProduct.find({});
    if (!products.length) {
      console.log("ℹ️ No products to track.");
      return;
    }

    for (const product of products) {
      console.log(`🔍 Checking: ${product.productName}`);
      const currentPrice = await fetchAmazonPrice(product.platform);

      if (currentPrice == null) {
        console.warn(`⚠️ Price not found for: ${product.productName}`);
        continue;
      }

      console.log(`💰 Price: ₹${currentPrice} | Target: ₹${product.desiredPrice}`);

      if (currentPrice <= product.desiredPrice) {
        await sendPriceDropEmail(
          product.userEmail,
          product.productName,
          currentPrice,
          product.platform
        );
      } else {
        console.log("⏳ No price drop yet.");
      }

      console.log("-----------------------------------------------------");
    }
  } catch (err) {
    console.error("❌ Error during price check:", err.message);
  }
}

// Run the price check immediately when this file is loaded
checkPrices();
