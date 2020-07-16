import React, { useEffect, useState } from "react";
import { loadCart, cartEmpty } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import { getMeToken, processPayment } from "./helper/paymentbhelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "../auth/helper";
import DropIn from "braintree-web-drop-in-react";
import Base from "./Base";

const Paymentb = () => {
  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const [products, setProducts] = useState([]);

  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
  });
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const onPurchase = () => {
    setInfo({ loading: true });
    console.log("INFO instance", info.instance);
    let nonce;
    info.instance.requestPaymentMethod().then((data) => {
      nonce = data.nonce;
      console.log("NONCE:", nonce);
      let paymentData = {
        payment_method_nonce: nonce,
        amount: getAmount(),
      };
      processPayment(userId, token, paymentData)
        .then((response) => {
          console.log("PAYMENT SUCCESS:", response);
          setInfo({ ...info, success: response.success, loading: false });

          const orderData = {
            order: {
              products: products,
              transaction_id: response.transaction.id,
              amount: response.transaction.amount,
            },
          };
          createOrder(userId, token, orderData)
            .then((data) => {
              console.log("order creation status:", data);
            })
            .catch((err) => console.log(err));
          cartEmpty(() => {
            console.log("any crash ?");
          });
          setReload(!reload);
        })
        .catch((err) => {
          console.log("PAYMENT FAILED");

          setInfo({ ...info, error: err, success: false, loading: false });
        });
    });
  };

  const showbtdropIn = () => {
    // console.log(products);
    return (
      <Base
        title="Checkout page"
        description="checkout using braintree safe and easy...."
      >
        <div>
          <h3>Your total bill is $ {getAmount()}</h3>

          {info.clientToken !== null && products.length > 0 ? (
            <div>
              <DropIn
                options={{ authorization: info.clientToken }}
                onInstance={(instance) => (info.instance = instance)}
              />
              <button
                className="btn btn-outline-success btn-block"
                onClick={onPurchase}
              >
                Buy
              </button>
            </div>
          ) : (
            <h3>Please signin or add products in your cart</h3>
          )}
        </div>
      </Base>
    );
  };
  const getToken = (userId, token) => {
    getMeToken(userId, token).then((response) => {
      console.log("INFORMATION", response);
      if (response.error) {
        setInfo({ ...info, error: response.error });
      } else {
        const clientToken = response.clientToken;
        setInfo({ clientToken });
      }
    });
  };

  const getAmount = () => {
    let amount = 0;
    products.map((p) => {
      amount += p.price * p.count;
    });
    return amount;
  };
  useEffect(() => {
    getToken(userId, token);
  }, []);

  return <div>{showbtdropIn()}</div>;
};

export default Paymentb;
