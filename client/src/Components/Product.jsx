import React, { useState } from 'react';
import ProductSearchForm from './ProductSearchForm';

const Products = () => {
  const [results, setResults] = useState([]);

  return (
    <div>
      <h2>Find Products</h2>
      <ProductSearchForm onSearch={setResults} />
      <hr />
      <div>
        {results.length > 0 ? (
            <>
             <ul>
            {results.map((product, idx) => (
              <li key={idx}>
                <strong>{product.title || product.name}</strong> — ₹{product.price} — ⭐{product.rating}
                <button className='btn btn-warning ms-3'>Alert on price Drop</button>
              </li>
            ))}
          </ul>
          </>
         
        ) : (
          <p>No products yet. Search something!</p>
        )}
      </div>
    </div>
  );
};

export default Products;
