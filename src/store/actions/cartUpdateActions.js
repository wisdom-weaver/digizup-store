import {db } from '../../config/FirebaseConfig';

export const updateCartAction = (cartid, cartQty)=>{

    return (dispatch,getState,{getFirebase,getFirestore})=>{
        dispatch({type:'CART_UPDATING'});
        cartQty = parseInt(cartQty);
        const firestore = getFirestore();
        console.log('state');
        const authuid = getState().firebase.auth.uid;
        firestore.collection('users').doc(authuid).collection('cart').doc(cartid).update({cartQty:cartQty})
            .then(()=>{
                setTimeout(()=>{
                    return dispatch({type:'CART_UPDATED'});
                },500);
            });
    }
}

export const addToCartAction = (productid, option, cartQty)=>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        dispatch({type:'CART_UPDATING'});
        const firestore = getFirestore();
        const authuid = getState().firebase.auth.uid;
        var doc = (option)?(productid+'-'+option):(productid+'-'+'default');
        firestore.collection('/users').doc(authuid).collection('/cart').doc(doc).set({
            cartItemRef: productid,
            cartQty: parseInt(cartQty),
            option: option?(option):false
        })
        .then(()=>{
            return dispatch({type:'CART_UPDATED'});
        })
    }
}

export const removeFromCartAction = (cartid)=>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        dispatch({type:'CART_UPDATING'});
        const firestore = getFirestore();
        const authuid = getState().firebase.auth.uid;
        firestore.collection('/users').doc(authuid).collection('/cart').doc(cartid).delete()
        .then(()=>{
            return dispatch({type:'CART_UPDATED'});
        })
    }
}

export const cartMessageReset = ()=>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        return dispatch({type:'CART_MESSAGE_RESET'});
    }
}


