import React, { useState } from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper";
import { Link } from "react-router-dom";
import { createCategory } from "./helper/adminapicall";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = isAuthenticated();

  const handleChange = (event) => {
    setError("");
    setName(event.target.value);
  };
  const onsubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    //backend request fired
    createCategory(user._id, token, { name }).then((data) => {
      // console.log(data.error);
      if (data.error) {
        setError(true);
      } else {
        setError("");
        setSuccess(true);
        setName("");
      }
    });
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
      return <h4 className="text-success">Category created successfully</h4>;
    }
  };
  const errorMessage = () => {
    if (error) {
      return <h4 className="text-warning">Error in creating category</h4>;
    }
  };
  const myCategoryForm = () => {
    return (
      <form>
        <div className="form-group">
          <p className="lead">Create Cateory:</p>
          <input
            type="text"
            className="form-control my-3"
            onChange={handleChange}
            value={name}
            autoFocus
            required
            placeholder="For Ex. Summer"
          />
          <button onClick={onsubmit} className="btn btn-outline-info">
            Create category
          </button>
        </div>
      </form>
    );
  };

  return (
    <Base
      title="create a new category"
      description="Add a new category for a new tshirt"
      className="container bg-info p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {errorMessage()}
          {myCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Base>
  );
};

export default AddCategory;
