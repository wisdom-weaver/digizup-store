export const requestCancellationAction = (orderId, cancellationMessage)=>{
    console.log('rqCan dispatch', orderId, cancellationMessage);
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        console.log('in in dispatch', orderId, cancellationMessage);
        const firestore = getFirestore();
        const authuid = getState().firebase.auth.uid;
        console.log('authuid', authuid);
        firestore.collection('users').doc(authuid).collection('orders').doc(orderId).get()
        .then(snap=>{
            console.log('got snap',snap);
            var {tracking} = snap.data();
            tracking.unshift({ title: 'Requested Cancellation', updateTime: new Date() });
            console.log('tracking',tracking);
            console.log(orderId, cancellationMessage);
            return firestore.collection('users').doc(authuid).collection('orders').doc(orderId).update({
                tracking,
                status: "Cancellation Pending",
                cancellationMessage
            })
        })
        .then(()=>{
            console.log('success added');
        })
        .catch((err)=>{console.log('err=>',err.message)});

    }
    // return (dispatch, getState, {getFirestore, getFirebase})=>{
        // console.log('in in dispatch', orderId, cancellationMessage);
        // return dispatch({type:'akjsdf'});
    // }
}