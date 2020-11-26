import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  listProducts,
} from '../actions/productActions';

export default function ProductListScreen(props) {
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;


  const dispatch = useDispatch();
  useEffect(() => {
    
    dispatch(listProducts());
  }, [ dispatch, props.history]);

 
  return (
    <div>
      <div className="row">
        <h1>Products</h1>
        <button type="button" className="primary">
          Create Product
        </button>
      </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
          
          </tbody>
        </table>
    </div>
  );
}
