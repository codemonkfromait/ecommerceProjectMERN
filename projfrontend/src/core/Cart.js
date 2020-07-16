import React, { useEffect, useState } from "react";
import "../styles.css";
import { API } from "../backend";
import Base from "./Base";
import Card from "./Card";
import { loadCart } from "./helper/cartHelper";
import StripeCheckout from "./StripeCheckout";
import Paymentb from "./Paymentb";
import { isAuthenticated } from "../auth/helper";
import { Link, withRouter } from "react-router-dom";
import { Fragment } from "react";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const loadAllProducts = (products) => {
    return (
      <div>
        <h1>This section is for loading products........</h1>
        {products.map((product, index) => {
          return (
            <Card
              key={index}
              product={product}
              addtoCart={false}
              removefromCart={true}
              countButton={true}
              reload={reload}
              setReload={setReload}
            />
          );
        })}
      </div>
    );
  };

  const loadCheckout = () => {
    return (
      <div>
        <h1>This section is for checkout</h1>
      </div>
    );
  };

  return (
    <Base title="Cart Page" description="Adjust your cart">
      <div className="row text-center">
        <div className="col-6">
          {products.length > 0 ? (
            loadAllProducts(products)
          ) : (
            <h3>No Products in cart</h3>
          )}
        </div>
        <div className="col-6 align-self-center">
          {isAuthenticated() && products.length > 0 ? (
            <Fragment>
              <h3 className="text-center text-white font-weight-bold ">
                Proceed for checkout.............
              </h3>
              <Link
                to="/user/bcheckout"
                className="nav-link btn btn-outline-success mt-4 mb-2"
              >
                Pay by braintree
              </Link>
              <Link
                to="/user/scheckout"
                className="nav-link btn btn-outline-info mt-4 mb-2 "
              >
                Pay by Stripe
              </Link>
            </Fragment>
          ) : !isAuthenticated() ? (
            <Link to="/signin" className="nav-link btn btn-outline-danger">
              Signin
            </Link>
          ) : (
            <h3>Please Add Products in your cart.........</h3>
          )}
        </div>
      </div>
    </Base>
  );
};

export default withRouter(Cart);
