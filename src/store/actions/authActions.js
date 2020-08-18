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
        return firebase.auth().signOut()
        .then(()=>{ dispatch({type:'LOGOUT_SUCCESS'}) })
        .catch(err=>{
            dispatch({
                type: "LOGOUT_ERROR",
                err: err.message
            })
        })
    }
}

export const signupAction = (newUser)=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        
        const firebase = getFirebase();
        const firestore = getFirestore();
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then((resp)=>{
            return firestore.collection('users').doc(resp.user.uid).set({
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                initials: newUser.firstName[0]+newUser.lastName[0]
            })
        })
        .then(()=>{ dispatch({ type:"SIGNUP_SUCCESS" }) })
        .catch((err)=>{ dispatch({ type:"SIGNUP_ERROR", err:err.message }) })
    }
}

export const  authMessageResetAction = ()=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        return dispatch({ type:'AUTH_MESSAGE_RESET' })
    }
}