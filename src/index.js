import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import firebase from "firebase/app";
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'

import { createStore, applyMiddleware } from "redux";
import { ReactReduxFirebaseProvider, getFirebase } from "react-redux-firebase";
import { createFirestoreInstance, getFirestore } from 'redux-firestore';
import rootReducer from './store/reducers/rootReducer';
import thunk from 'redux-thunk';

const fbConfig= {
  apiKey: "AIzaSyBHW5GkbAYKKiS-0O7V9yE6I_rhqdm5dmI",
    authDomain: "digizup-store-test1.firebaseapp.com",
    databaseURL: "https://digizup-store-test1.firebaseio.com",
    projectId: "digizup-store-test1",
    storageBucket: "digizup-store-test1.appspot.com",
    messagingSenderId: "629806898681",
    appId: "1:629806898681:web:405b49966fdd13c86b7128",
    measurementId: "G-DCTWT63X8B"
}
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true 
}
firebase.initializeApp(fbConfig)
firebase.firestore();
const initialState = {}

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware( thunk.withExtraArgument({ getFirebase, getFirestore }) )
);

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
}

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps} >
      <App />
    </ReactReduxFirebaseProvider>
  </Provider>

  ,document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

