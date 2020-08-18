//importing defaults
//----------------------------------------------------------
import React, { Children } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

//importing 'redux': Redux Store
//createStore: create our redux store
//applyMiddleware: extend Redux with custom functionality
import { createStore, applyMiddleware, compose } from 'redux';
 
//importing 'react-redux': binding layer between the store and the dom
//Provider: makes our store available to be used in our components
import { Provider, useSelector } from "react-redux";
// import { Provider } from "react-redux";
//----------------------------------------------------------


//Reducers: handles the store opertations and data mutations
//import rootReducer 
import  rootReducer from './store/reducers/rootReducer';

//import thunk
//thunk: is a middleware that allows us to return a function instead of an action-creator
//these asynchronous funcitons send a call do the processing and then dispatch a synchronous action 
import thunk from 'redux-thunk';


//firebase
//----------------------------------------------------------
//importing Firebase 


//importing react-redux-firebase
//ReactReduxFirebaseProvider: lets rrfProps(store content from firebase) be available to our redux store
//getFirebase: used to manipulate data in firebase
//isLoaded: hepler funciton, detects if data from redux state has been loaded or not
import { ReactReduxFirebaseProvider, getFirebase, isLoaded, firebaseConnect  } from "react-redux-firebase";

//importing redux-firestore
//createFirestoreInstance: in v3.0.0 version this is introduced that is passed in rrfProps
//getFirestore: used to manipulate data in firestore
//reduxFirestore: v2.0.0 way to firebase-store-enhancer
import { createFirestoreInstance, getFirestore, reduxFirestore } from 'redux-firestore'

import firebase from "./config/FirebaseConfig";
//----------------------------------------------------------

//store
//----------------------------------------------------------
//create store
//createStore( reducer, store-enhancer ) 
//[OR]  createStore( reducer, compose(...multiple-store-enhancers) ) 
//compose: use to apply multiple store enhancer. (programmatic utility)
//thunk.withExtraArgument(object of store-enhacer): adds these encapsulated  store-enhancers as an extra-argument to the reducer
//reduxFirestore(firebase): adds store-enhancer of Firestore 

const store = createStore(
  rootReducer, 
  compose(
    applyMiddleware(thunk.withExtraArgument({getFirebase, getFirestore})),
    reduxFirestore(firebase)
  )
);

//react-redux-firebase-configuration of store
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true
}
//react-redux-firebase-props the actual contents of the store from firebase
const rrfProps = {
  firebase,
  config:   rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
}
//----------------------------------------------------------

//wait to load
//----------------------------------------------------------
const AuthIsLoaded = ( {children} )=>{
  const auth = useSelector( state=>state.firebase.auth );
  if(!isLoaded(auth)) return <div>Loading...</div>;
  return children;
}
//----------------------------------------------------------

//we are rendering our web app accordingly to the dom
//----------------------------------------------------------
ReactDOM.render(
  
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <AuthIsLoaded>
        <App />
      </AuthIsLoaded>
    </ReactReduxFirebaseProvider>
  </Provider>

  ,document.getElementById('root')
);
//----------------------------------------------------------

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();