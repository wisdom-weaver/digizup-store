import React, { useState, useEffect, Fragment } from 'react'
import { priceFormat } from '../utils/utils'

import CartCard from '../components/CartCard';
import { connect, useSelector } from 'react-redux';
import { auth } from 'firebase';
import { useFirebaseConnect, useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import { v1 as uuid } from 'uuid';
import { updateCartAction, deleteNotification, addCartAction, removeFromCartAction, cartMessageReset } from '../store/actions/cartUpdateActions';
import { testAction } from '../store/actions/testAction';
import { db } from '../config/FirebaseConfig';
import { useHistory, NavLink } from 'react-router-dom';
import Delayed from '../utils/Delayed';
import _ from 'lodash';
import InfoCard from '../components/InfoCard.js'
import Loading from '../components/Loading';

function Cart(props) {
    const history = useHistory();
    const authuid = useSelector(state=> state.firebase.auth.uid ) ?? 'default';
    useEffect(()=>{
        if(!authuid || authuid == 'default'){
            setTimeout(()=>{
                history.push('/login');
            },3000)
        }
    },[authuid])

    const [total, setTotal] = useState(0)
    
    useFirestoreConnect([ {
        collection: 'users', 
        doc: authuid,
        subcollections: [{ collection: 'cart' }], 
        storeAs: 'cart' 
    },{
        collection: 'users',
        doc: authuid,
        subcollections: [{collection:'cartNotifications'}],
        storeAs: 'cartNotifications'
    }])
    const cartCollection = useSelector(state=> state.firestore.ordered.cart)
    const [cart,setCart] = useState([]);
    const [log, setLog ] = useState('');
    useEffect(()=>{
        if(!isLoaded(cartCollection)) return setLog('LOADING');
        if(!cartCollection || cartCollection.length == 0){ setCart([]); return setLog('EMPTY');}
        setLog('FETCHED');
        setCart(cartCollection)
        var newTotal = cartCollection.reduce((tot,each)=>(tot+each.productPrice*each.cartQty),0)
        // console.log(total);
        setTotal(newTotal);
    },[cartCollection])
    
    const cartNotifications = useSelector(state=> _.orderBy(state.firestore.ordered.cartNotifications ?? [], ['createdAt'],['desc'])) ?? [];
    useEffect(()=>{ 
        // console.log(cartNotifications);
    },[cartNotifications]);

    const {updateCartAction, removeFromCart, cartMessageReset, deleteNotification} = props;
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
            <div className="col s12 l5 push-s0 push-l7">
                <div className="cart-total-container center">
                  <h6 className="primary-green-light">Cart Total</h6>
                  <h5 className="center-align primary-green-dark heavy_text">{priceFormat(total)}</h5>
                  <div onClick={()=>{history.push('/checkout')}} className="btn dark_btn">Checkout</div>
                </div>
            </div>);
    const cartItemsJSX = (
            <div className="col s12 l7 pull-s0 pull-l5">
                <div className="cart-items-container">
                  {cart && cart.map(cartItem=>( <CartCard key={uuid()} cartFunc={cartFunc} cartItem={cartItem} /> ))}
                </div>
            </div>);
    
    const cartNotificationsJSX = (cartNotifications&& cartNotifications.length > 0)?(
        <div className="cartNotifications">
        <div className="card round-card">
        <div className="card-content">
        <div className="row">
        {cartNotifications.map(each=>(
            <Fragment key={uuid()}>
            <div className="col s9">
                <p 
                className="head regular_text center">{each.notificationMessage}</p>
            </div>
            <div className="col s3 center">
                <div
                 onClick={()=>{deleteNotification(each.id)}}
                 className="btn-floating btn-small red_btn"><i className="material-icons">clear</i></div>
            </div>
            </Fragment>
        ))}
        </div>
        </div>
        </div>
        </div>
    ):(null)
    const CartPageMarkUpJSX = (
        <div className="row">
            {(cart && cart.length>0)?(
                <Fragment>
                    {cartTotalSectionJSX}
                    {cartItemsJSX}
                </Fragment>
            ):(
                <Fragment>
                    {(log == 'LOADING')?( <Loading /> ):(null)}
                    {(log == 'EMPTY')?( <InfoCard><p className="center flow-text">Your Cart is Empty</p> </InfoCard> ):(null)}
                </Fragment>
            )}
        </div>
)
    return (
        <div className="Cart">
            <div className="container">
                <h5 className="primary-green-dark-text center">Your Shopping <span className="heavy_text">Cart</span></h5>
                {cartNotificationsJSX}
                {(authuid!='default')?(
                    <Delayed waitBeforeShow={500}>
                        <Fragment>{CartPageMarkUpJSX}</Fragment>
                    </Delayed>
                ):(
                    <InfoCard>
                        <p className="flow-text center">
                        Please <span className="heavy_text primary-green-dark-text">SignIn</span> To Continue
                        </p>
                    </InfoCard>
                )}
            </div>
        </div>
    )
}
const mapStateToProps = (state)=>{
    // console.log(state);
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
        cartMessageReset: ()=>{ dispatch( cartMessageReset() ) },
        deleteNotification: (docid)=>{ dispatch( deleteNotification(docid) )}
    }
}

export default  connect(mapStateToProps, mapDispatchToProps)(Cart)
