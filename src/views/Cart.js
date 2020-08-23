import React, { useState, useEffect } from 'react'
import { priceFormat } from '../utils/utils'

import CartCard from '../components/CartCard';
import { connect, useSelector } from 'react-redux';
import { auth } from 'firebase';
import { useFirebaseConnect, useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import { v1 as uuid } from 'uuid';
import { updateCartAction, addCartAction, removeFromCartAction, cartMessageReset } from '../store/actions/cartUpdateActions';
import { testAction } from '../store/actions/testAction';
import { db } from '../config/FirebaseConfig';
import { useHistory } from 'react-router-dom';
import Delayed from '../utils/Delayed';

function Cart(props) {
    const [total, setTotal] = useState(0)
    const [cart, setCart] = useState()
    
    const authuid = useSelector(state=>state.firebase.auth.uid);
    useFirestoreConnect([ {
        collection: 'users', 
        doc: authuid,
        subcollections: [{ collection: 'cart' }], 
        storeAs: 'cart' 
    } ])
    var cartCollection = useSelector(state=>state.firestore.ordered.cart);
    var cartCollectionObj = useSelector(state=>state.firestore.data.cart);
    
    useEffect(()=>{
        if(!isLoaded(cartCollection) || !isLoaded(cartCollectionObj)) return;
        if(!cartCollection || !cartCollectionObj){ setCart([]); setTotal(0); return;}
        getCart();
    },[cartCollection,cartCollectionObj])
    const getCart = async ()=>{
        //console.log('getcart', cartCollection);
        var localCart = [];
        var localTotal = 0;
        var cartCollectionIds = Object.keys(cartCollectionObj);
        for(let i=0;i<cartCollection.length;i++){
            //console.log(i);
            try{
                var cartEach = cartCollection[i];
            //console.log(cartEach);
            var cartProductDoc = await db.collection('products').doc(cartEach?.cartItemRef).get();
            if(cartProductDoc.empty){ /* console.log('product doc not found'); */ continue;}
            var cartProduct = cartProductDoc.data();
            //console.log(cartProduct);
            var localCartItem = {}
            if(cartEach.option == false){
                localCartItem = {
                    productName : cartProduct.productName,
                    productid : cartProductDoc.id,
                    price: cartProduct.price,
                    defaultImage: cartProduct.images[0],
                    cartQty : cartEach.cartQty,
                    option: false,
                    cartid: cartCollectionIds[i]
                }
                localTotal += localCartItem.price*localCartItem.cartQty;
            }else{
                localCartItem = {
                    productName : cartProduct[cartEach.option].productFullName,
                    productid : cartProductDoc.id,
                    price: cartProduct[cartEach.option].price,
                    defaultImage: cartProduct[cartEach.option].images[0],
                    cartQty : cartEach.cartQty,
                    option: cartEach.option,
                    cartid: cartCollectionIds[i]
                }
                localTotal += localCartItem.price*localCartItem.cartQty;
            }
            }catch(er){continue;}
            //console.log(localCartItem);
            localCart.push(localCartItem);
        }
        setCart(localCart);
        setTotal(localTotal);
    }

    const {updateCartAction, removeFromCart, cartMessageReset} = props;
    const updateCart = (cartid, qty)=>{
        console.log('updateCart', cartid, qty);
        var newcart = cart;
        var index = cart.findIndex((each)=>each.cartid ==cartid);
        newcart[index] = { ...newcart[index], cartQty: qty };
        setCart(newcart);
        console.log(newcart);
        updateCartAction(cartid, qty);
    }
    const cartFunc={
        updateCart,
        removeFromCart
    }
    const history = useHistory();
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
                  <h5 className="price-container center-align primary-green-dark heavy_text">{priceFormat(total)}</h5>
                  <div className="btn dark_btn proceed_to_payment_btn">Proceed to Payment</div>
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
                {cartTotalSectionJSX}
                {cartItemsJSX}
            </div>
    )

    return (
        <div className="Cart">
            <div className="container">
                <h5 className="primary-green-dark-text">Your Shopping <span className="heavy_text">Cart</span></h5>
                <Delayed waitBeforeShow={3000}>
                    {(cart)
                    ?(CartPageMarkUpJSX)
                    :( <p>Your Shopping Cart is Empty</p> )}
                </Delayed>
            </div>
        </div>
    )
}
const mapStateToProps = (state)=>{
    //console.log(state);
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
