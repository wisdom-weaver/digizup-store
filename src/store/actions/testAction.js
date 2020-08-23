export const testAction = ()=>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        dispatch({type:'CART_UPDATING'});
        console.log('1=>test action');
        return dispatch({type:'CART_UPDATED'});
    }
}
