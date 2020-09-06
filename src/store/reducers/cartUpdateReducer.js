const initState ={
    cartCount:0,
    cartMessage: null
}

export const cartUpdateReducer = (state = initState, action)=>{
    // console.log(action.type);
    switch(action.type){
        case 'CART_UPDATING': return {...state, cartMessage:action.type};
        case 'CART_UPDATED': return {...state, cartMessage:action.type};
        case 'CART_ADDED': return {...state, cartMessage:action.type};
        case 'CART_MESSAGE_RESET': return {...state,cartMessage:null};
        default: return state;
    }
}

