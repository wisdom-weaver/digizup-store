import React from 'react'
import { useSelector } from "react-redux"; 

export const addAddressAction = (newAddress)=>{
    console.log('addAddressAction')
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        const firestore = getFirestore();
        const authuid = getState().firebase.auth.uid;
        firestore.collection('users').doc(authuid).collection('addresses').add({...newAddress, createdAt: new Date()})
        .then(()=>{
            console.log('newAddress added');
        })
        .catch((err)=>{console.log('err=>',err.message)});

    }
}

export const addCardAction = (newCard)=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        const firestore = getFirestore();
        const authuid = getState().firebase.auth.uid;
        firestore.collection('users').doc(authuid).collection('cards').add({...newCard, createdAt: new Date()})
        .then(()=>{ console.log('new card added') })
        .catch((err)=>{ console.log('err=>', err.message) })
    }
}

export const placeOrderAction = (newOrder)=>{
    console.log('newOrder',newOrder);
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        const firestore = getFirestore();
        const authuid = getState().firebase.auth.uid;
        firestore.collection('users').doc(authuid).collection('orders').add({...newOrder, createdAt:new Date()})
        .then(()=>{console.log('placed order')})
        .then(async ()=>{ 
            var snap = await firestore.collection('users').doc(authuid).collection('cart').get();
            console.log('snap', snap);
            snap.docs.forEach((doc) => {
                firestore.collection('users').doc(authuid).collection('cart').doc(doc.id).delete();
            });
        })
        .catch(err=>{console.log('err=>', err)});
    }
}