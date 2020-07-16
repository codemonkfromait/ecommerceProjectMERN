import React, { useEffect, useState } from "react";
import ImageHelper from "./helper/ImageHelper";
import { Redirect } from "react-router-dom";
import {
  addItemToCart,
  removeItemFromCart,
  updateCart,
} from "./helper/cartHelper";
import "../styles.css";

const Card = ({
  product,
  addtoCart = true,
  removefromCart = false,
  countButton = false,
  reload = undefined,
  setReload = (f) => f, //function(f){return f}
}) => {
  const cardTitle = product ? product.name : "A cool picture from pixels";
  const cardDescription = product ? product.description : "a cool coder";
  const cardPrice = product ? product.price : "$15";

  const [redirect, setRedirect] = useState(false);

  const [count, setCount] = useState(1);
  const addToCart = () => {
    addItemToCart(product, () => {
      setRedirect(true);
    });
  };

  const getARedirect = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const showaddtoCart = (addtoCart) => {
    //
    return (
      addtoCart && (
        <button
          onClick={addToCart}
          className="btn btn-block btn-outline-success mt-2 mb-2"
        >
          Add to Cart
        </button>
      )
    );
  };
  const showcountbutton = (countButton) => {
    const incrementButton = () => {
      setCount((prevState) => {
        console.log("incre", prevState);
        return prevState + 1;
      });
      updateCart(product._id, count);
      setReload(!reload);
    };

    const decrementButton = () => {
      setCount((prevState) => {
        console.log("decre", prevState);
        if (prevState > 1) {
          return prevState - 1;
        } else {
          return 1;
        }
      });
      updateCart(product._id, count);
      setReload(!reload);
    };
    return (
      countButton && (
        <div>
          <button
            onClick={incrementButton}
            className="btn btn-success btn-circle btn-md mt-2 mb-2"
          >
            +
          </button>
          <span className="mt-2 mb-2 px-2 py-2">{product.count}</span>
          <button
            onClick={decrementButton}
            className="btn btn-success btn-circle btn-md mt-2 mb-2"
          >
            -
          </button>
        </div>
      )
    );
  };
  const showremovefromCart = (removefromCart) => {
    //
    return (
      removefromCart && (
        <button
          onClick={() => {
            removeItemFromCart(product._id);
            setReload(!reload);
          }}
          className="btn btn-block btn-outline-danger mt-2 mb-2"
        >
          Remove from cart
        </button>
      )
    );
  };
  return (
    <div className="card text-white bg-dark border border-info ">
      <div className="card-header lead">{cardTitle}</div>
      <div className="card-body">
        {getARedirect(redirect)}
        <ImageHelper product={product} />
        <p className="lead bg-success font-weight-normal text-wrap">
          {cardDescription}
        </p>
        <p className="btn btn-success rounded  btn-sm px-4">${cardPrice}</p>
        <div className="row">
          <div className="col-12">{showaddtoCart(addtoCart)}</div>
        </div>

        <div className="row">
          <div className="col-6">{showremovefromCart(removefromCart)}</div>
          <div className="col-6">{showcountbutton(countButton)}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
