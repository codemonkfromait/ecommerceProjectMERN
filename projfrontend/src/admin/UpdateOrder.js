import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper";
import { Link, withRouter } from "react-router-dom";
import { getOrder, updateOrderStatus } from "./helper/adminapicall";

const UpdateOrder = ({ match, history }) => {
  const [values, setValues] = useState({
    status: "",
    error: "",
    success: false,
    getRedirect: false,
  });
  const { status, error, success, getRedirect } = values;
  const { user, token } = isAuthenticated();
  const preload = (orderId) => {
    getOrder(orderId).then((data) => {
      console.log(data);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          status: data.status,
        });
      }
    });
  };

  useEffect(() => {
    preload(match.params.orderId);
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, status: event.target.value });
  };
  const onsubmit = (event) => {
    event.preventDefault();

    setValues({ ...values, success: false });

    //backend request fired
    updateOrderStatus(match.params.orderId, user._id, token, { status }).then(
      (data) => {
        // console.log(data.error);
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            success: true,
            error: "",
            status: "",
            getRedirect: true,
          });
        }
      }
    );
  };
  const getARedirect = (history) => {
    if (getRedirect) {
      setTimeout(() => {
        history.push("/admin/dashboard");
      }, 3000);
    }
  };
  const goBack = () => {
    return (
      <div className="mt-5">
        <Link className="btn btn-success mb-3 btn-sm" to="/admin/dashboard">
          Admin Home
        </Link>
      </div>
    );
  };
  const successMessage = () => {
    //
    if (success) {
      return (
        <h4 className="text-success">order status updated successfully</h4>
      );
    }
  };
  const errorMessage = () => {
    if (error) {
      return <h4 className="text-warning">Error in updating order status</h4>;
    }
  };
  const myOrderStatusForm = () => {
    return (
      <form>
        <div className="form-group">
          <p className="lead">Update Order status:</p>
          <select
            onChange={handleChange}
            className="form-control"
            placeholder="Order status"
            value={status}
          >
            <option value={status}>{status}</option>
            <option>shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
          <button onClick={onsubmit} className="btn btn-outline-info">
            Update Order Status
          </button>
        </div>
      </form>
    );
  };

  return (
    <Base
      title="update order status"
      description="update the order status for the tshirt"
      className="container bg-info p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {errorMessage()}
          {myOrderStatusForm()}
          {goBack()}
          {getARedirect(history)}
        </div>
      </div>
    </Base>
  );
};

export default withRouter(UpdateOrder);
