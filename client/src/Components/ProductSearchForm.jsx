import React, { useState } from 'react';

const ProductSearchForm = ({ onSearch }) => {
  const [formData, setFormData] = useState({
    productNeed: '',
    budget: '',
    category: '',
    titleMatch: '',
    minRating: 0,
    sortBy: 'relevance',
    company: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productNeed.trim()) {
      setError('Product need is required');
      return;
    }

    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/search-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        onSearch(data.products); // pass results to parent
      } else {
        alert(data.message || 'No products found');
      }
    } catch (err) {
      alert('Server error. Please try again.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
      <input type="text" name="productNeed" placeholder="What do you need?" value={formData.productNeed} onChange={handleChange} required />
      <input type="number" name="budget" placeholder="Budget (optional)" value={formData.budget} onChange={handleChange} />
      <input type="text" name="category" placeholder="Category (e.g., electronics)" value={formData.category} onChange={handleChange} />
      <input type="text" name="titleMatch" placeholder="Must include in title..." value={formData.titleMatch} onChange={handleChange} />
      <input type="number" name="minRating" placeholder="Min rating (0-5)" value={formData.minRating} onChange={handleChange} />
      <select name="sortBy" value={formData.sortBy} onChange={handleChange}>
        <option value="relevance">Relevance</option>
        <option value="priceLowToHigh">Price: Low to High</option>
        <option value="priceHighToLow">Price: High to Low</option>
        <option value="rating">Rating</option>
      </select>
      <input type="text" name="company" placeholder="Brand (optional)" value={formData.company} onChange={handleChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Search</button>
    </form>
  );
};

export default ProductSearchForm;
