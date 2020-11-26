import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { detailsProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';

export default function ProductScreen(props) {
  const dispatch = useDispatch();
  const productId = props.match.params.id;
  const [qty, setQty] = useState(1);
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  useEffect(() => {
    dispatch(detailsProduct(productId));
  }, [dispatch, productId]);

  const addToCartHandler = () => {
    props.history.push(`/cart/${productId}?qty=${qty}`);
  };

  return (
    <div>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : (
        <div>
          <Link to="/">Back to Products</Link>
          <div className="row top mt-5">
            <div className="col-2">
              <img
                className="medium"
                src={product.image}
                alt={product.title}
              ></img>
            </div>
            <div className="col-1">
              <ul>
                <li>
                  <h1>{product.title}</h1>
                </li>
                <li><strong>Pirce:</strong> ${product.price}</li>
                <li>
                  <p className="text-muted"> <strong>Description: </strong><br /> {product.description}</p>
                </li>
              </ul>
            </div>
            <div className="col-1" style={{height: '150px', marginBottom: '50px'}}>
              <div className="card card-body" style={{height: '150px'}}>
                <ul>
                  <li>
                    <div className="row">
                      <div>Price:</div>
                      <div className="price">${product.price}</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>Status:</div>
                      <div>
                          <span className="success">In Stock</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <button
                      onClick={addToCartHandler}
                      className="primary block"
                      style={{marginTop: '40px'}}
                    >
                      Add to Cart
                    </button>
                  </li>

                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
