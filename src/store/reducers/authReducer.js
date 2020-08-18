const initState = {
    authMessage: null,
    authError: null
}

export const authReducer = (state=initState, action)=>{
    console.log(action?.type);
    switch(action.type){
        case 'LOGIN_SUCCESS': return {authMessage: action.type, authError: null};
        case 'LOGIN_ERROR': return {authMessage: action.type, authError: action.err};
        case 'LOGOUT_SUCCESS': return {authMessage: action.type, authError: null};
        case 'LOGOUT_ERROR': return {authMessage: action.type, authError: action.err};
        case 'SIGNUP_SUCCESS': return {authMessage: action.type, authError: null};
        case 'SIGNUP_ERROR': return {authMessage: action.type, authError: action.err};
        case 'AUTH_MESSAGE_RESET': return initState;
        default: return state;
    }
}