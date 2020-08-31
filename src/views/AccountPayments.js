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

function AccountPayments(props){
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
        subcollections: [{ collection: 'cards' }],
        storeAs: 'cards'
    }])

    const cards = useSelector( state => state.firestore.ordered.cards)??[];
    var initCard = { cardHolderName: '', cardNo: '', cardExpMM: '', cardExpYY: '' };
    const [newCard, setNewCard] = useState(initCard);
    const submitNewCard = (newCard)=>{
        addCard(newCard);
        setNewCard(initCard);
    } 
    const submitRemoveCard = (cardid)=>{
        removeCard(cardid);
    }
    
    const addCardBtn = (
        <Modal
        actions={[
          (<Button flat modal="close" node="button" waves="red">Close</Button>),
          (<Button onClick={()=>{ submitNewCard(newCard) }} flat modal="close" node="button" waves="green">Add Card</Button>)
        ]}
        bottomSheet={false}
        fixedFooter={true}
        header="Add a new Card"
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
        trigger={<div className="btn light_btn"> <i className="material-icons">add</i> <span>Add Card</span> </div>}
      >
          <div className="row">
              <div className="input-field col s12">
                  <i className="material-icons prefix">account_circle</i>
                  <input onChange={(e)=>{setNewCard({...newCard, cardHolderName:e.target.value})}} value={newCard.cardHolderName} id="cardHolderName-addCard" type="text" required />
                  <label  htmlFor="cardHolder-addCard">Full Name</label>
              </div>
              <div className="input-field col s8">
                  <i className="material-icons prefix">payment</i>
                  <input onChange={(e)=>{setNewCard({...newCard, cardNo:e.target.value})}} value={newCard.cardNo} id="cardNo-addCard" type="text" required />
                  <label htmlFor="cardNo-addCard">Card Line</label>
                  {/* <NumberFormat customInput={TextField} format="#### #### #### ####"/> */}
              </div>
              <div className="input-field col s2">
                  <input onChange={(e)=>{setNewCard({...newCard, cardExpMM:e.target.value})}} value={newCard.cardExpMM} id="cardExpMM-addCard" type="text" required />
                  <label htmlFor="cardExpMM-addCard">MM</label>
              </div>
              <div className="input-field col s2">
                  <input onChange={(e)=>{setNewCard({...newCard, cardExpYY:e.target.value})}} value={newCard.cardExpYY} id="cardExpYY-addCard" type="text" required />
                  <label htmlFor="cardExpYY-addCard">YY</label>
              </div>
          </div>
      </Modal>
    );
    const DebitCreditCardsJSX = (authuid && authuid !='default')?(
        <div className="row">
                <div className="s12">
                    <h5 className="center heavy_text primary-green-dark-text"> <Icon>payments</Icon> Credit/Debit Cards</h5>
                </div>
                <div className="col s12 m8 offset-m2">
                    <div className="card round-card">
                        <div className="card-content">
                            <h6 className="center">Wanna add <span className="heavy_text primary-green-dark-text">more cards ?</span></h6>
                            <div className="center"> {addCardBtn} </div>
                        </div>
                    </div>
                </div>
                {(cards && cards.length>0)?(
                    <Fragment>
                        {cards.map((each,index)=>(
                        <Fragment key={uuid()} >
                        <div className="col s12 m12 l6">
                            <div className="card round-card">
                                <div className="card-content">
                                    <table>
                                        <tbody>
                                            <tr><td className="no-wrap">Card Holder :</td><th>{each.cardHolderName}</th></tr>
                                            <tr><td className="no-wrap">Card Number :</td><th>{'XXXX XXXX XXXX '+each.cardNo.slice(12)}</th></tr>
                                            <tr><td className="no-wrap">Card Expiry :</td><th>{each.cardExpMM+'/'+each.cardExpYY}</th></tr>
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
                                          onClick={()=>{submitRemoveCard(each.id)}}
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
                            <h6 className="center" >No Cards found</h6>
                            <div className="center">
                                {addCardBtn}
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
    ):(null)
    const AccountPaymentsPageJSX = (authuid && authuid!='default')?(
        <Fragment>
            <Collapsible accordion>
              <CollapsibleItem
                expanded={false}
                header="Debit/Credit Cards"
                icon={<Icon>payments</Icon>}
                node="div"
              >
                {DebitCreditCardsJSX}
              </CollapsibleItem>
              <CollapsibleItem
                expanded={false}
                header="PayPal"
                icon={<Icon>place</Icon>}
                node="div"
              >
                Paypal!!! COMING SOON!
              </CollapsibleItem>
              <CollapsibleItem
                expanded={false}
                header="Paytm"
                icon={<Icon>place</Icon>}
                node="div"
              >
                Paytm!!! COMING SOON!
              </CollapsibleItem>
              <CollapsibleItem
                expanded={false}
                header="CryptoCurrencies"
                icon={<Icon>whatshot</Icon>}
                node="div"
              >
                CryptoCurrencies!! Comming Soon !!
              </CollapsibleItem>
            </Collapsible>
        </Fragment>
    ):(null)

    return (
        <div className="AccountPayments Page" >
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
                        <Fragment>{AccountPaymentsPageJSX}</Fragment>
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
)(AccountPayments)
