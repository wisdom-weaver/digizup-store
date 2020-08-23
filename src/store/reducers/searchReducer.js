const initState={
    searchTerm: null,
    searchResults: null,
    searchError: null,
    searchMessage: null
}

export const searchReducer = (state = initState, action)=>{
    // console.log(action?.type);
    switch(action.type){
        case 'SEARCH_IN_PROGRESS': 
            return {searchTerm: action.searchTerm, searchResults: null, searchError:null, searchMessage: action.type };
        case 'SEARCH_RESULTS_FETCHED': 
            return {searchTerm: action.searchTerm, searchResults: action.searchResults, searchError:null, searchMessage: action.type };
        case 'SEARCH_RESULTS_NOT_FOUND': 
            return {searchTerm: action.searchTerm, searchResults: null, searchError:action.err, searchMessage: action.type };
        case 'SEARCH_RESET' :
            return {...initState, searchMessage:action.type};
        default: return state;
    }
}