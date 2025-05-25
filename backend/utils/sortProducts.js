const sortProducts = (products, sortBy, keyword) => {
    const productsCopy = [...products];
  
    switch (sortBy) {
      case 'price':
        return productsCopy.sort((a, b) => {
          const priceA = a.price ?? Number.MAX_SAFE_INTEGER;
          const priceB = b.price ?? Number.MAX_SAFE_INTEGER;
          return priceA - priceB;
        });
      case 'rating':
        return productsCopy.sort((a, b) => {
          const ratingA = parseFloat(a.rating) || 0;
          const ratingB = parseFloat(b.rating) || 0;
          return ratingB - ratingA;
        });
      case 'relevance':
      default:
        return productsCopy.sort((a, b) => {
          const aName = a.name || a.title || '';
          const bName = b.name || b.title || '';
          return relevanceScore(bName, keyword) - relevanceScore(aName, keyword);
        });
    }
  };
  
  const relevanceScore = (title, keyword) => {
    if (!title || !keyword) return 0;
  
    const titleLower = title.toLowerCase();
    const keywordLower = keyword.toLowerCase();
  
    if (titleLower.includes(keywordLower)) {
      return 100 - titleLower.indexOf(keywordLower);
    }
  
    return 0;
  };
  
  module.exports = { sortProducts };
  