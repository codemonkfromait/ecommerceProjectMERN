import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper";
import { Link } from "react-router-dom";
import { updateCategory, getCategory } from "./helper/adminapicall";

const UpdateCategory = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    error: "",
    success: false,
  });
  const { name, error, success } = values;
  const { user, token } = isAuthenticated();
  const preload = (categoryId) => {
    getCategory(categoryId).then((data) => {
      console.log(data);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: data.name,
        });
      }
    });
  };

  useEffect(() => {
    preload(match.params.categoryId);
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, name: event.target.value });
  };
  const onsubmit = (event) => {
    event.preventDefault();

    setValues({ ...values, success: false });

    //backend request fired
    updateCategory(match.params.categoryId, user._id, token, { name }).then(
      (data) => {
        // console.log(data.error);
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({ ...values, success: true, error: "", name: "" });
        }
      }
    );
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
      return <h4 className="text-success">Category updated successfully</h4>;
    }
  };
  const errorMessage = () => {
    if (error) {
      return <h4 className="text-warning">Error in updating category</h4>;
    }
  };
  const myCategoryForm = () => {
    return (
      <form>
        <div className="form-group">
          <p className="lead">Update Category:</p>
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
            Update category
          </button>
        </div>
      </form>
    );
  };

  return (
    <Base
      title="update a  category"
      description="update the category for the tshirt"
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

export default UpdateCategory;
