import React, { useEffect, Fragment, useState } from 'react'
import { compose } from 'redux'
import { connect, useSelector } from 'react-redux'
import { withRouter, useHistory, NavLink } from 'react-router-dom'
import { addCardAction, removeCardAction, addAddressAction, removeAddressAction } from '../store/actions/accountActions'
import { useFirestoreConnect } from 'react-redux-firebase'
import Delayed from '../utils/Delayed'
import 'materialize-css';
import { Collapsible, CollapsibleItem, Icon, Modal, Button } from 'react-materialize';
import { v1 as uuid } from 'uuid';

function AccountAddresses(props){
    const { addCard, removeCard, addAddress, removeAddress } = props;
    const authuid = useSelector(state=>state.firebase.auth.uid) || 'default';
    const profile = useSelector(state=>state.firebase.profile) || {};
    const history = useHistory();
    useEffect(()=>{
        if(!authuid || authuid == 'default'){
            setTimeout(()=>{
                history.push('/login');
            },2000);
        }
    },[authuid])

    useFirestoreConnect([{
        collection: 'users',
        doc: authuid,
        subcollections: [{ collection: 'addresses' }],
        storeAs: 'addresses'
    }])

    const addresses = useSelector( state => state.firestore.ordered.addresses)??[];
    const initAddress = { fullName    :'', addressLine :'', city    :'', state   :'', country :'', pincode :'', phoneNo :'' };
    const [newAddress, setNewAddress] = useState(initAddress);
    const submitNewAddress = ()=>{
        addAddress(newAddress);
        setNewAddress(initAddress);
    }
    const submitRemoveAddress = (addressid)=>{
        removeAddress(addressid);
    }
    
    const addAddressBtn = (
            <Modal
              actions={[
                (<Button flat modal="close" node="button" waves="red">Close</Button>),
                (<Button onClick={()=>{submitNewAddress(newAddress)}} flat modal="close" node="button" waves="green">Add Address</Button>)
              ]}
              bottomSheet={false}
              fixedFooter={true}
              header="Add a new Address"
              id="addAddressModal"
              open={false}
              options={{
                dismissible: true,
                endingTop: '16%',
                inDuration: 250,
                onCloseEnd: null,
                onCloseStart: null,
                onOpenEnd: null,
                onOpenStart: null,
                opacity: 0.5,
                outDuration: 250,
                preventScrolling: true,
                startingTop: '55%'
              }}
            //   root={[object HTMLBodyElement]}
              trigger={<div className="btn light_btn"> <i className="material-icons">add</i> <span>Add Address</span> </div>}
            >
                <div className="row">
                    <div className="input-field col s12">
                        <i className="material-icons prefix">account_circle</i>
                        <input onChange={(e)=>{setNewAddress({...newAddress, fullName:e.target.value})}} value={newAddress.fullName} id="fullName-addAddress" type="text" required />
                        <label  htmlFor="fullName-addAddress">Full Name</label>
                    </div>
                    <div className="input-field col s12">
                        <i className="material-icons prefix">location_city</i>
                        <input onChange={(e)=>{setNewAddress({...newAddress, addressLine:e.target.value})}} value={newAddress.addressLine} id="addressLine-addAddress" type="text" required />
                        <label htmlFor="addressLine-addAddress">Address Line</label>
                    </div>
                    <div className="input-field col s6">
                        <i className="material-icons prefix">location_on</i>
                        <input onChange={(e)=>{setNewAddress({...newAddress, city:e.target.value})}} value={newAddress.city} id="city-addAddress" type="text" required />
                        <label htmlFor="city-addAddress">City</label>
                    </div>
                    <div className="input-field col s6">
                        <input onChange={(e)=>{setNewAddress({...newAddress, state:e.target.value})}} value={newAddress.state} id="state-addAddress" type="text" required />
                        <label htmlFor="state-addAddress">State</label>
                    </div>
                    <div className="input-field col s6">
                        <input onChange={(e)=>{setNewAddress({...newAddress, country:e.target.value})}} value={newAddress.country} id="country-addAddress" type="text" required />
                        <label htmlFor="country-addAddress">Country</label>
                    </div>
                    <div className="input-field col s6">
                        <input onChange={(e)=>{setNewAddress({...newAddress, pincode:e.target.value})}} value={newAddress.pincode} id="pincode-addAddress" type="text" required />
                        <label htmlFor="pincode-addAddress">Pincode</label>
                    </div>
                    <div className="input-field col s12">
                        <i className="material-icons prefix">local_phone</i>
                        <input onChange={(e)=>{setNewAddress({...newAddress, phoneNo:e.target.value})}} value={newAddress.phoneNo} id="phoneNo-addAddress" type="text" required />
                        <label htmlFor="phoneNo-addAddress">Phone Number</label>
                    </div>
                </div>
            </Modal>
    );

    const AccountAddressesPageJSX = (authuid && authuid!='default')?(
        <Fragment>
            <div className="row">
                <div className="col s12 m8 offset-m2">
                    <div className="card round-card">
                        <div className="card-content">
                            <h6 className="center">Wanna add <span className="heavy_text primary-green-dark-text">more addresses ?</span></h6>
                            <div className="center"> {addAddressBtn} </div>
                        </div>
                    </div>
                </div>
                {(addresses && addresses.length>0)?(
                    <Fragment>
                        {addresses.map((each,index)=>(
                        <Fragment key={uuid()} >
                        <div className="col s12 m12 l6">
                            <div className="card round-card">
                                <div className="card-content">
                                    <table>
                                        <tbody>
                                            <tr><td className="no-wrap">Name :</td><th>{each.fullName}</th></tr>
                                            <tr><td className="no-wrap">AddressLine :</td><th>{each.addressLine}</th></tr>
                                            <tr><td className="no-wrap">City :</td><th>{each.city}</th></tr>
                                            <tr><td className="no-wrap">State :</td><th>{each.state}</th></tr>
                                            <tr><td className="no-wrap">Country :</td><th>{each.country}</th></tr>
                                            <tr><td className="no-wrap">Pincode :</td><th>{each.pincode}</th></tr>
                                        </tbody>
                                    </table>
                                    <div>
                                        <div className="right">
                                        <Button
                                          className="red"
                                          floating
                                          icon={<Icon>delete</Icon>}
                                          large
                                          node="button"
                                          waves="light"
                                          onClick={()=>{submitRemoveAddress(each.id)}}
                                        />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                        {((index+1)%2==0)?(<div className="col s12"></div>):(null)}
                        </Fragment>
                        ))}
                    </Fragment>
                ):(
                    <div className="col s12 m8 l6 offset-m2 offset-l4">
                    <div className="card round-card">
                        <div className="card-content">
                            <h6 className="center" >No Addresses found</h6>
                            <div className="center">
                                {addAddressBtn}
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </Fragment>
    ):(null)

    return (
        <div className="AccountAddresses Page" >
            <div className="container">
                {(!authuid||authuid=='default')?(
                    <div className="row">
                    <div className="col s12 m6 l6 offset-m2 offset-l2">
                    <div className="card round-card">
                    <div className="card-content center">
                    <h6>Please <span className="heavy_text primary-green-dark-text">SignIn</span> to Continue</h6>
                    </div>
                    </div>
                    </div>
                    </div>
                ):(
                    <Delayed waitBeforeShow={3000}>
                        <Fragment>{AccountAddressesPageJSX}</Fragment>
                    </Delayed>
                )}
            </div>
        </div>
    )
}

const mapStateToProps = (state)=>{
    // console.log(state);
    return { 

    }
}

const mapStateToDispatch = (dispatch) =>{
    return {
        addCard: (newCard)=>{dispatch( addCardAction(newCard) )},
        removeCard: (cardid)=>{dispatch( removeCardAction(cardid) )},
        addAddress: (newAddress)=>{dispatch( addAddressAction(newAddress) )},
        removeAddress: (cardid)=>{dispatch( removeAddressAction(cardid) )}
        
    }
}

export default compose(
    connect(mapStateToProps, mapStateToDispatch),
    withRouter
)(AccountAddresses)
