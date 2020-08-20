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

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/about"> <About /> </Route>
          <Route exact path="/store"> <Store /> </Route>
          <Route exact path="/cart"> <Cart /> </Route>
          <Route exact path="/checkout"> <Checkout /> </Route>
          <Route exact path="/login"> <Login /> </Route>
          <Route exact path="/signup"> <Signup /> </Route>
          <Route exact path="/product/:productid"> <Product /> </Route>
          <Route exact path="/"> <Home /> </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
