import React from "react";
import { Route, Link, Switch, BrowserRouter } from "react-router-dom";
import Home from "./core/Home";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import AdminRoute from "./auth/helper/AdminRoutes";
import PrivateRoute from "./auth/helper/PrivateRoutes";
import UserDashBoard from "./user/UserDashBoard";
import AdminDashBoard from "./user/AdminDashBoard";
import AddCategory from "./admin/AddCategory";
import AddProduct from "./admin/AddProduct";
import ManageCategories from "./admin/ManageCategories";
import ManageProducts from "./admin/ManageProducts";
import UpdateProduct from "./admin/UpdateProduct";
import UpdateCategory from "./admin/UpdateCategory";
import Cart from "./core/Cart";
import Paymentb from "./core/Paymentb";
import StripeCheckout from "./core/StripeCheckout";
import UpdateOrder from "./admin/UpdateOrder";
import ManageOrders from "./admin/ManageOrders";

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/cart" component={Cart} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/signin" component={Signin} />
        <PrivateRoute exact path="/user/dashboard" component={UserDashBoard} />
        <PrivateRoute exact path="/user/bcheckout" component={Paymentb} />
        <PrivateRoute exact path="/user/scheckout" component={StripeCheckout} />
        <AdminRoute exact path="/admin/dashboard" component={AdminDashBoard} />
        <AdminRoute
          exact
          path="/admin/create/category"
          component={AddCategory}
        />
        <AdminRoute
          exact
          path="/admin/categories"
          component={ManageCategories}
        />
        <AdminRoute exact path="/admin/create/product" component={AddProduct} />
        <AdminRoute exact path="/admin/products" component={ManageProducts} />
        <AdminRoute exact path="/admin/orders" component={ManageOrders} />
        <AdminRoute
          exact
          path="/admin/product/update/:productId"
          component={UpdateProduct}
        />
        <AdminRoute
          exact
          path="/admin/category/update/:categoryId"
          component={UpdateCategory}
        />
        <AdminRoute
          exact
          path="/admin/order/update/:orderId"
          component={UpdateOrder}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
