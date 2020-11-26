import React from 'react';
import { Link } from 'react-router-dom';
import './Product.css'

export default function Product(props) {
  const { product } = props;
  


  return (
    <div key={product.id} className="card">
      <Link to={`/product/${product.id}`}>
        <img className="medium card-image" src={product.image} alt={product.name} />
      </Link>
      <div className="card-body">
        <Link to={`/product/${product.id}`}>
          <h2 className="heading">{product.title}</h2>
        </Link>
        <p className="lead">{product.description}</p>
        <div className="price">${product.price}</div>
      </div>
    </div>
  );
}
