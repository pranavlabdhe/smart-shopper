const { scrapeAmazon } = require('../scraper/amazonScraper');
const { scrapeFlipkart } = require('../scraper/filpkartScraper'); // fixed typo
const { filterProducts } = require('../utils/filterProducts');
const { sortProducts } = require('../utils/sortProducts');

const searchProduct = async (req, res) => {
  try {
    const {
      productNeed,
      budget,
      category,
      titleMatch = '',
      minRating = 0,
      sortBy = 'relevance',
      company = ''
    } = req.body;

    if (!productNeed) {
      return res.status(400).json({ error: 'Kindly Search a Product required' });
    }

    const [amazonProducts, flipkartProducts] = await Promise.all([
      scrapeAmazon(productNeed, category),
      scrapeFlipkart(productNeed, category)
    ]);

    let combinedProducts = [...amazonProducts, ...flipkartProducts];

    // Filtering
    const filteredProducts = filterProducts(combinedProducts, {
      budget,
      titleMatch,
      minRating,
      company
    });

    // Sorting
    const sortedProducts = sortProducts(filteredProducts, sortBy, productNeed);

    if (sortedProducts.length === 0) {
      return res.status(404).json({ message: 'No products found matching your criteria.' });
    }

    res.json({ products: sortedProducts });
  } catch (error) {
    console.error('Error in searchProducts controller:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { searchProduct };
