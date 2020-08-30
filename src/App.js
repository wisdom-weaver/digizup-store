import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './views/Home';
import About from './views/About';
import Cart from './views/Cart';
import Checkout from './views/Checkout';
import Store from './views/Store';
import Navbar from './components/Navbar';
import Login from './views/Login';
import Signup from './views/Signup';
import Product from './views/Product';
import Test from './views/Test';
import ScrollToTop from './utils/ScrollToTop';
import Category from './views/Category';
import Orders from './views/Orders';
import Order from './views/Order';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop >
          <Navbar />
          <Switch>
            <Route exact path="/about"> <About /> </Route>
            <Route exact path="/store"> <Store /> </Route>
            <Route exact path="/store/:category"> <Category /> </Route>
            <Route exact path="/cart"> <Cart /> </Route>
            <Route exact path="/checkout"> <Checkout /> </Route>
            <Route exact path="/login"> <Login /> </Route>
            <Route exact path="/signup"> <Signup /> </Route>
            <Route exact path="/product/:productid"> <Product /> </Route>
            <Route exact path="/account/orders"> <Orders /> </Route>          
            <Route exact path="/account/order/:orderid"> <Order /> </Route>          
            <Route exact path="/test"> <Test /> </Route>          
            <Route exact path="/"> <Home /> </Route>
          </Switch>
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
}

export default App;
