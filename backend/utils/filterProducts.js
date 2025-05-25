
const filterProducts = (products, { budget, titleMatch = '', minRating = 0, company = '' }) => {
    const max = parseInt(budget, 10);
  
    return products.filter((product) => {
      const name = (product.title || product.name || '').toLowerCase();
      const rating = parseFloat(product.rating) || 0;
  
      const priceOk = !budget || (product.price && product.price <= max);
      const titleOk = !titleMatch || name.includes(titleMatch.toLowerCase());
      const ratingOk = !minRating || rating >= minRating;
      const companyOk = !company || name.includes(company.toLowerCase());
  
      return priceOk && titleOk && ratingOk && companyOk;
    });
};


  module.exports = { filterProducts };
  