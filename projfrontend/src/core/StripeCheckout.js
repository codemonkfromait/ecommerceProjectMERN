import React, { useEffect, useState } from "react";
import { isAuthenticated } from "../auth/helper";
import { cartEmpty, loadCart } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import StripeCheckoutButton from "react-stripe-checkout";
import { API, PKEY } from "../backend";
import { createOrder } from "./helper/orderHelper";
import Base from "./Base";

const StripeCheckout = ({}) => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  const [data, setData] = useState({
    loading: false,
    error: "",
    success: false,
    address: "",
  });

  const token = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);
  const getFinalPrice = () => {
    let total = 0;
    products.map((product, index) => {
      total += product.price * product.count;
    });
    return total;
  };

  const makePayment = (token) => {
    const body = {
      token,
      products,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    return fetch(`${API}/stripepayment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response);
        const { status } = response;
        console.log("STATUS", status);
        //create other methods
        //cartEmpty();
      })
      .catch((err) => console.log(err));
  };
  const showStripeButton = () => {
    return isAuthenticated() ? (
      <StripeCheckoutButton
        stripeKey={PKEY}
        token={makePayment}
        amount={getFinalPrice() * 100}
        name="Buy Tshirts"
        shippingAddress
        billingAddress
      >
        <button className="btn btn-success">Pay with stripe</button>
      </StripeCheckoutButton>
    ) : (
      <Link to="/signin">
        <button className="btn btn-danger">SignIn</button>
      </Link>
    );
  };
  return (
    <Base
      title="Checkout page"
      description="checkout using stripe safe and easy...."
    >
      <div className="row ">
        <div className="col align-self-center">
          <h3 className="text-white">Stripe checkout ${getFinalPrice()}</h3>
          {showStripeButton()}
        </div>
      </div>
    </Base>
  );
};

export default StripeCheckout;
