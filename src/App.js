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
import Account from './views/Account';
import AccountAddresses from './views/AccountAddresses';
import AccountPayments from './views/AccountPayments';
import Err404 from './views/Err404';
import Loading from './components/Loading';
import LoadingFullScreen from './components/LoadingFullScreen';
import AppFooter from './components/AppFooter';

import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import Payment from './views/Payment';

const promise = loadStripe('pk_test_51HR0lzK03SbZNRhEPy0jM1O5DL7iDBBkTQko9PQFwOFn9sdhKeZ2KYEGy1gtfLnGKZ6nDN4htp0rhaSTLBe3BDQv00MKU66mjj');


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
            <Route exact path="/checkout"> 
              <Elements stripe={promise}>
                <Checkout />
              </Elements>
            </Route>
            {/* <Route exact path="/payment"> 
              <Elements stripe={promise}>
                <Payment />
              </Elements>
            </Route> */}
            <Route exact path="/login"> <Login /> </Route>
            <Route exact path="/signup"> <Signup /> </Route>
            <Route exact path="/product/:productid"> <Product /> </Route>
            <Route exact path="/account"> <Account /> </Route>          
            <Route exact path="/account/orders"> <Orders /> </Route>          
            <Route exact path="/account/order/:orderid"> <Order /> </Route>          
            <Route exact path="/account/addresses"> <AccountAddresses /> </Route>          
            {/* <Route exact path="/account/payments"> <AccountPayments /> </Route>           */}
            {/* <Route exact path="/loading"> <Loading /> </Route>           */}
            {/* <Route exact path="/loadingfull"> <LoadingFullScreen /> </Route>           */}
            {/* <Route exact path="/err404"> <Err404 /> </Route>           */}
            <Route exact path="/"> <Home /> </Route>
            <Route component={Err404} />
          </Switch>
          <AppFooter />
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
}

export default App; 