// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');
// const puppeteer = require('puppeteer');

// /**
//  * Parse a price string like '₹699₹2,99976% off' and return a number (e.g. 2999)
//  */
// function parsePrice(priceStr) {
//   if (!priceStr) return null;
//   const match = priceStr.match(/₹([\d,]+)/);
//   return match ? parseInt(match[1].replace(/,/g, ''), 10) : null;
// }

// /**
//  * Scrapes Flipkart search results for a given query.
//  * Returns an array of products with numeric prices.
//  */
// async function scrapeFlipkart(searchQuery) {
//   const browser = await puppeteer.launch({
//     headless: "new",
//     args: ['--no-sandbox', '--disable-setuid-sandbox']
//   });
//   const page = await browser.newPage();
//   const url = `https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`;
//   await page.goto(url, { waitUntil: 'networkidle2', timeout: 600000 });

//   // Close login popup if present
//   try {
//     await page.waitForSelector('button._2KpZ6l._2doB4z', { timeout: 4000 });
//     await page.click('button._2KpZ6l._2doB4z');
//   } catch (e) {
//     // No popup? Continue
//   }

//   // Scrape products from search results
//   const products = await page.$$eval("div[data-id]", cards => {
//     // Inline parsePrice for browser context
//     function parsePrice(priceStr) {
//       if (!priceStr) return null;
//       const match = priceStr.match(/₹([\d,]+)/);
//       return match ? parseInt(match[1].replace(/,/g, ''), 10) : null;
//     }

//     return cards.map(card => {
//       const title =
//         card.querySelector('a[title]')?.innerText?.trim() ||
//         card.querySelector('img[alt]')?.alt?.trim() ||
//         card.innerText?.split('\n')[0]?.trim() || '';

//       const rawPrice = Array.from(card.querySelectorAll('div, span'))
//         .map(x => x.innerText)
//         .find(x => x && x.trim().startsWith('₹')) || '';
//       const price = parsePrice(rawPrice);

//       const link =
//         card.querySelector('a[title]')?.href ||
//         card.querySelector('a')?.href ||
//         '';

//       const img = card.querySelector('img')?.src || '';

//       const rating = Array.from(card.querySelectorAll('div, span'))
//         .map(x => x.innerText)
//         .find(x => x && /^[0-5](\.\d)?$/.test(x.trim())) || null;

//       const reviews = Array.from(card.querySelectorAll('div, span'))
//         .map(x => x.innerText)
//         .find(x => x && /\(\d[\d,]*\)/.test(x)) || null;

//       return { title, price, link, img, rating, reviews, source: 'Flipkart' };
//     });
//   });

//   await browser.close();
//   // Filter out entries missing essential data
//   return products.filter(p => p.title && p.price != null && p.link);
// }

// // Allow standalone execution for testing
// if (require.main === module) {
//   (async () => {
//     const query = process.argv.slice(2).join(' ') || "earphones";
//     const results = await scrapeFlipkart(query);
//     console.log(JSON.stringify(results, null, 2));
//   })();
// }

// module.exports = { scrapeFlipkart };




const puppeteer = require('puppeteer');

function parsePrice(priceStr) {
  if (!priceStr) return null;
  const match = priceStr.match(/₹([\d,]+)/);
  return match ? parseInt(match[1].replace(/,/g, ''), 10) : null;
}

async function scrapeFlipkart(searchQuery) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  const url = `https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`;
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 600000 });

  // Close login popup
  try {
    await page.waitForSelector('button._2KpZ6l._2doB4z', { timeout: 4000 });
    await page.click('button._2KpZ6l._2doB4z');
  } catch (e) {
    // No popup
  }

  const products = await page.$$eval("div[data-id]", cards => {
    function parsePrice(priceStr) {
      if (!priceStr) return null;
      const match = priceStr.match(/₹([\d,]+)/);
      return match ? parseInt(match[1].replace(/,/g, ''), 10) : null;
    }

    return cards.map(card => {
      const title =
        card.querySelector('a[title]')?.innerText?.trim() ||
        card.querySelector('img[alt]')?.alt?.trim() ||
        card.innerText?.split('\n')[0]?.trim() || '';

      const rawPrice = Array.from(card.querySelectorAll('div, span'))
        .map(x => x.innerText)
        .find(x => x && x.trim().startsWith('₹')) || '';
      const price = parsePrice(rawPrice);

      const link = card.querySelector('a[title]')?.href || card.querySelector('a')?.href || '';
      const img = card.querySelector('img')?.src || '';

      const rating = Array.from(card.querySelectorAll('div, span'))
        .map(x => x.innerText)
        .find(x => x && /^[0-5](\.\d)?$/.test(x.trim())) || null;

      const reviews = Array.from(card.querySelectorAll('div, span'))
        .map(x => x.innerText)
        .find(x => x && /\(\d[\d,]*\)/.test(x)) || null;

      return { title, price, link, img, rating, reviews, source: 'Flipkart' };
    });
  });

  await browser.close();

  return products.filter(p => p.title && p.price != null && p.link);
}

module.exports = { scrapeFlipkart };
