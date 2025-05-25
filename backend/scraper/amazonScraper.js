// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// puppeteer.use(StealthPlugin());

// const scrapeAmazon = async (productNeed) => {
//   const searchQuery = productNeed.trim().split(' ').join('+');
//   const url = `https://www.amazon.in/s?k=${searchQuery}`;

//   const browser = await puppeteer.launch({
//     headless: true, // true in production
//     slowMo: 50,
//     args: ['--no-sandbox', '--disable-setuid-sandbox']
//   });

//   try {
//     const page = await browser.newPage();

//     await page.setUserAgent(
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
//     );

//     await page.goto(url, { waitUntil: 'networkidle2', timeout: 600000 });

//     await page.waitForSelector('div[data-component-type="s-search-result"]', { timeout: 10000 });

//     const rawProducts = await page.evaluate(() => {
//       const productElements = document.querySelectorAll('div[data-component-type="s-search-result"]');
//       const raw = [];

//       productElements.forEach((el) => {
//         const name = el.querySelector('h2 span')?.innerText?.trim() || null;

//         // safer link extraction
//         let linkElement = el.querySelector('h2 a');
//         if (!linkElement) {
//           linkElement = el.querySelector('a.a-link-normal.s-no-outline');
//         }
//         const link = linkElement ? linkElement.getAttribute('href') : null;

//         const priceWhole = el.querySelector('.a-price-whole')?.innerText || null;
//         const priceFraction = el.querySelector('.a-price-fraction')?.innerText || null;
//         const image = el.querySelector('img.s-image')?.src || null;

//         raw.push({ name, priceWhole, priceFraction, link, image });
//       });

//       return raw;
//     });

//     // console.log('🛒 Raw extracted product count:', rawProducts.length);
//     // console.log('🔍 Sample product:', rawProducts[0]);

//     const products = rawProducts
//       .filter(item => item.name && item.link && item.image)
//       .map(item => {
//         const price = item.priceWhole
//           ? parseInt(item.priceWhole.replace(/[^\d]/g, '') + (item.priceFraction || '').replace(/[^\d]/g, ''), 10)
//           : null;

//         return {
//           name: item.name,
//           price,
//           link: `https://www.amazon.in${item.link}`,
//           image: item.image,
//           source: 'Amazon'
//         };
//       });

//     // console.log('✅ Final products count:', products.length);
//     return products.slice(0, 10);
//   } catch (error) {
//     console.error('❌ Amazon scraping failed:', error.message);
//     return [];
//   } finally {
//     await browser.close();
//   }
// };

// module.exports = { scrapeAmazon };




// {
//     "productNeed": "tv",
//     "budget": "80000",
//     "category": "electronics",
//     "minRating": 0,
//     "company": "lg",
//     "sortBy": "rating"
//   }
  



const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const scrapeAmazon = async (productNeed) => {
  const searchQuery = productNeed.trim().split(' ').join('+');
  const url = `https://www.amazon.in/s?k=${searchQuery}`;

  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 50,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 600000 });

    await page.waitForSelector('div[data-component-type="s-search-result"]', { timeout: 10000 });

    const rawProducts = await page.evaluate(() => {
      const productElements = document.querySelectorAll('div[data-component-type="s-search-result"]');
      const raw = [];

      productElements.forEach((el) => {
        const name = el.querySelector('h2 span')?.innerText?.trim() || null;
        let linkElement = el.querySelector('h2 a') || el.querySelector('a.a-link-normal.s-no-outline');
        const link = linkElement ? linkElement.getAttribute('href') : null;
        const priceWhole = el.querySelector('.a-price-whole')?.innerText || null;
        const priceFraction = el.querySelector('.a-price-fraction')?.innerText || null;
        const image = el.querySelector('img.s-image')?.src || null;

        raw.push({ name, priceWhole, priceFraction, link, image });
      });

      return raw;
    });

    const products = rawProducts
      .filter(item => item.name && item.link && item.image)
      .map(item => {
        const price = item.priceWhole
          ? parseInt(item.priceWhole.replace(/[^\d]/g, '') + (item.priceFraction || '').replace(/[^\d]/g, ''), 10)
          : null;

        return {
          name: item.name,
          price,
          url: `https://www.amazon.in${item.link}`,
          image: item.image,
          source: 'Amazon'
        };
      });

    return products.slice(0, 10);
  } catch (error) {
    console.error('❌ Amazon scraping failed:', error.message);
    return [];
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeAmazon };



