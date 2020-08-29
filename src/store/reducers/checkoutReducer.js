const initState ={
    addresses:[],
    cart: [],
    saved: [],
    checkoutMessage: null
}

export const cartUpdateReducer = (state = initState, action)=>{
    console.log(action.type);
    switch(action.type){
        
        default: return state;
    }
}

