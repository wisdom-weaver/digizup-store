import { combineReducers } from "redux"
import { firebaseReducer } from "react-redux-firebase"
import { firestoreReducer } from "redux-firestore"
import { authReducer } from "./authReducer"
import { searchReducer } from "./searchReducer"

const rootReducer = combineReducers({
    auth: authReducer,
    search: searchReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer
})

export default rootReducer