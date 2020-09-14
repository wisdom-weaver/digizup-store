import React, { useState, useEffect } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CardContent } from '@material-ui/core';
import { compose } from 'redux';
import { withRouter, useHistory } from 'react-router-dom';
import axios from '../axios/axios'

function Payment() {

    const history = useHistory();    
    const stripe = useStripe();
    const elements = useElements();

    const total = 0;

    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(null);
    const [processing, setProcessing] = useState(null);
    const [succeeded, setSucceeded] = useState(null);
    const [clientSecret, setClientSecret] = useState(true);
    useEffect(()=>{
       const getClientSecret = async ()=>{
           const response = await axios({
               method: 'post',
               url: `/payments/create?total=${total*100}`
           })
           setClientSecret(response.data.clientSecret)
       }
       getClientSecret();
    },[total])

    const handleSubmit = async (e)=>{
        e.preventDefault();
        console.log('submit');
        setProcessing(true);
        const payload = await stripe.confirmCardPayment(clientSecret,{
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: 'Danish Ansari',
                  }
            }
        }).then(({paymentIntent})=>{
            setSucceeded(true);
            setError(null);
            setProcessing(false);
            history.replace('/account/orders')
        })
    }

    const handleChange = (event)=>{
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    }

    return (
        <div className="Payment Page">
            <div className="container">
            <h4 className="center head">Payment</h4>
            <div className="card round-card">
            <div className="card-content center">
                <form onSubmit={handleSubmit}>
                    <CardElement onChange={handleChange} />
                    <button  className="btn dark_btn" disabled={processing || disabled || succeeded} >
                        <span>
                            {(processing ? "Procesing" : "Pay Now")}
                        </span>
                    </button>
                </form>
            </div>
            </div>
            </div>
        </div>
    )
}

export default compose(
    withRouter
)(Payment)
