export const loginAction = (credentials)=>{
    return (dispatch, getState,{ getFirebase, getFirestore} ) =>{
        const firebase = getFirebase();
        firebase.auth().signInWithEmailAndPassword(
            credentials.email,
            credentials.password
        )
        .then(()=>{
            dispatch({type: "LOGIN_SUCCESS"});
        })
        .catch(err=>{
            dispatch({
                type: "LOGIN_ERROR",
                err: err.message
            })
        })
    }
}

export const logoutAction = ()=>{
    return (dispatch, getState,{ getFirebase, getFirestore })=>{
        const firebase = getFirebase();
        return firebase.auth.signOut()
        .then(()=>{ dispatch({type:'LOGOUT_SUCCESS'}) })
        .catch(err=>{
            dispatch({
                type: "LOGOUT_ERROR",
                err: err.message
            })
        })
    }
}

export const  authMessageResetAction = ()=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        return dispatch({ type:'AUTH_MESSAGE_RESET' })
    }
}