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

export const removeAddressAction = (addressid)=>{
    console.log('addAddressAction')
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        const firestore = getFirestore();
        const authuid = getState().firebase.auth.uid;
        firestore.collection('users').doc(authuid).collection('addresses').doc(addressid).delete()
        .then(()=>{
            console.log('address removed');
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

export const removeCardAction = (cardid)=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        const firestore = getFirestore();
        const authuid = getState().firebase.auth.uid;
        firestore.collection('users').doc(authuid).collection('cards').doc(cardid).delete()
        .then(()=>{ console.log('card removed') })
        .catch((err)=>{ console.log('err=>', err.message) })
    }
}