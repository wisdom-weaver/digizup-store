import React, { useState, useEffect, Fragment } from 'react'
import { priceFormat } from '../utils/utils'

import CartCard from '../components/CartCard';
import { connect, useSelector } from 'react-redux';
import { auth } from 'firebase';
import { useFirebaseConnect, useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import { v1 as uuid } from 'uuid';
import { updateCartAction, addCartAction, removeFromCartAction, cartMessageReset } from '../store/actions/cartUpdateActions';
import { testAction } from '../store/actions/testAction';
import { db } from '../config/FirebaseConfig';
import { useHistory, NavLink } from 'react-router-dom';
import Delayed from '../utils/Delayed';

function Cart(props) {
    const history = useHistory();
    const authuid = useSelector(state=> state.firebase.auth.uid ) ?? 'default';
    useEffect(()=>{
        if(!authuid || authuid == 'default'){
            setTimeout(()=>{
                // history.push('/login');
            },3000)
        }
    },[authuid])

    const [total, setTotal] = useState(0)
    
    useFirestoreConnect([ {
        collection: 'users', 
        doc: authuid,
        subcollections: [{ collection: 'cart' }], 
        storeAs: 'cart' 
    } ])
    const cartCollection = useSelector(state=> state.firestore.ordered.cart)
    const [cart,setCart] = useState([]);
    useEffect(()=>{
        if(!isLoaded(cartCollection)) return;
        setCart(cartCollection);
        var newTotal = cartCollection.reduce((tot,each)=>(tot+each.productPrice*each.cartQty),0)
        console.log(total);
        setTotal(newTotal);
    },[cartCollection])

    const {updateCartAction, removeFromCart, cartMessageReset} = props;
    const updateCart = (cartid, qty)=>{
        var newcart = cart.map((each)=>((each.id ==cartid)?({...each, cartQty:qty}):(each)));
        var newTotal = newcart.reduce((tot,each)=>(tot+each.productPrice*each.cartQty),0)
        setTotal(newTotal);
        setCart(newcart);
        updateCartAction(cartid, qty);
    }
    const cartFunc={
        updateCart,
        removeFromCart
    }

    const cartMessage =props?.cartUpdate?.cartMessage;
    
    useEffect(()=>{
        if(cartMessage == 'CART_UPDATED' || cartMessage == 'CART_ADDED'){
            cartMessageReset();
        }
    },[cartMessage])


    const cartTotalSectionJSX = (
            <div className="col s12 m5 push-s0 push-m7">
                <div className="cart-total-container center">
                  <h6 className="primary-green-light">Cart Total</h6>
                  <h5 className="center-align primary-green-dark heavy_text">{priceFormat(total)}</h5>
                  <div onClick={()=>{history.push('/checkout')}} className="btn dark_btn">Checkout</div>
                </div>
            </div>);
    const cartItemsJSX = (
            <div className="col s12 m7 pull-s0 pull-m5">
                <div className="cart-items-container">
                  {cart && cart.map(cartItem=>( <CartCard key={uuid()} cartFunc={cartFunc} cartItem={cartItem} /> ))}
                </div>
            </div>);
    const CartPageMarkUpJSX = (
            <div className="row">
                {(cart && cart.length>0)?(
                    <Fragment>
                        {cartTotalSectionJSX}
                        {cartItemsJSX}
                    </Fragment>
                ):(
                    <div className="center">
                        <div className="row">
                        <div className="col s8 m6 l6 offset-s2 offset-m3 offset-l3">
                        <div className="card round-card">
                        <div className="card-content">
                            <p className="flow-text">
                                Your Cart is Empty
                            </p>
                            <NavLink to='/store/all'><div className="btn dark_btn">Shop Now</div></NavLink>
                        </div>    
                        </div>    
                        </div>
                        </div>
                    </div>
                )}
            </div>
    )

    return (
        <div className="Cart">
            <div className="container">
                <h5 className="primary-green-dark-text">Your Shopping <span className="heavy_text">Cart</span></h5>
                {(authuid!='default')?(
                    <Delayed waitBeforeShow={5000} >
                        {CartPageMarkUpJSX}
                    </Delayed>
                ):(
                    <div className="center">
                        <div className="row">
                        <div className="col s8 m6 l6 offset-s2 offset-m3 offset-l3">
                        <div className="card round-card">
                        <div className="card-content">
                            <p className="flow-text">
                                Please <span className="heavy_text primary-green-dark-text">SignIn</span> To Continue
                            </p>
                        </div>    
                        </div>    
                        </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
const mapStateToProps = (state)=>{
    console.log(state);
    return{
        cartUpdate: state.cartUpdate,
        authuid : state.firebase.auth.uid
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {
        updateCartAction: (cartid, cartQty)=>{
            dispatch(updateCartAction(cartid, cartQty))
        },
        removeFromCart : (cartid)=>{ dispatch( removeFromCartAction(cartid) ) },
        cartMessageReset: ()=>{ dispatch( cartMessageReset() ) }
    }
}

export default  connect(mapStateToProps, mapDispatchToProps)(Cart)
