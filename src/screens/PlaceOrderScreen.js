import React, { useEffect } from 'react';
import Axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import StripeCheckout from "react-stripe-checkout";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrder, detailsOrder } from '../actions/orderActions';
import CheckoutSteps from '../components/CheckoutSteps';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import { CART_EMPTY } from '../constants/cartConstants';
import LoadingBox from '../components/LoadingBox';
import './CartScreen.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useHistory} from 'react-router-dom';

toast.configure();
export default function PlaceOrderScreen(props) {
  let history = useHistory();
  const cart = useSelector((state) => state.cart);
  console.log(":::::::::::::::::::::::::::::::", cart)

  if (!cart.paymentMethod) {
    props.history.push('/payment');
  }

  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading, success, error, order } = orderCreate;
  const toPrice = (num) => Number(num.toFixed(2)); // 5.123 => "5.12" => 5.12
  cart.itemsPrice = toPrice(
    cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0)
  );

  cart.shippingPrice = cart.itemsPrice > 100 ? toPrice(0) : toPrice(10);
  cart.taxPrice = toPrice(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
  const dispatch = useDispatch();
  const placeOrderHandler = () => {
    dispatch(detailsOrder({ ...cart, orderItems: cart.cartItems }));
  };

  const successPaymentHandler = (details, data) => {
    console.log("Pay with PayPal:::::::::::::", details, data)
    dispatch(detailsOrder({ ...cart, orderItems: details }));

    // toast("Success! Check email for details", { type: "success" });
  };

  async function handleToken(token, addresses) {
    dispatch({ type: CART_EMPTY });
    dispatch({ type: ORDER_CREATE_RESET });
    
    toast("Success! Stripe payment successful", { type: "success" });
    history.push("/")
    // Perform some Server Side Logic to save data
    // Note: Stripe does not send receipt on Test Mode Sandbox
  }  

  useEffect(() => {
    if (success) {
      props.history.push(`/order/`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [dispatch, order, props.history, success]);
  
  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Shipping</h2>
                <p>
                  <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                  <strong>Address: </strong> {cart.shippingAddress.address},
                  {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}
                  ,{cart.shippingAddress.country}
                </p>
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Payment</h2>
                <p>
                  <strong>Method:</strong> {cart.paymentMethod}
                </p>
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Order Items</h2>
                <ul>
                  {cart.cartItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="small"
                          ></img>
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.product}`}>
                            {item.title}
                          </Link>
                        </div>

                        <div>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  <div>${cart.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Shipping</div>
                  <div>${cart.shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Tax</div>
                  <div>${cart.taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong> Order Total</strong>
                  </div>
                  <div>
                    <strong>${cart.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              {
                cart.paymentMethod == "PayPal" ? 
                (
                  <PayPalButton
                    amount={cart.totalPrice}
                    onSuccess={successPaymentHandler}
                  ></PayPalButton>
                ) : 
                (
                  <StripeCheckout
                    stripeKey="pk_test_PmbkKDbiWogFurXuUi7Okhiv"
                    token={handleToken}
                    amount={cart.totalPrice * 100}
                    name={cart.shippingAddress.fullName}
                    description="Elon Jobs System"
                    billingAddress
                    shippingAddress
                  />
                )
              }
              
              {loading && <LoadingBox></LoadingBox>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
