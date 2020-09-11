import React, { useState } from 'react'
import {db} from '../config/FirebaseConfig';

import _ from "lodash";
import isNumber from 'lodash/isNumber'
import { ImageGradient } from 'material-ui/svg-icons';

function Test() {
    const run = async ()=>{
        // DFh6NH8eqkEFKsqMhzxS-option_0_0
        var cartDocs = await db.collectionGroup('cart').where('productid','==','DFh6NH8eqkEFKsqMhzxS').where('option','==','option_0_0').get();
        cartDocs.forEach((doc)=>{
            console.log(doc.ref.path);
        })
    }

    const run2 = ()=>{
        
        db.doc('users/5yeE1lBOg9VGWUsXX6KHTa1te4B2/cart/DFh6NH8eqkEFKsqMhzxS-option_0_0').update({productPrice: 323})
        .then(()=>{console.log('success')});
    }
    return (
        <div className="Test Page container">
            <div
            onClick={run}
            className="btn dark_btn">
                RUN
            </div>
            <div
            onClick={run2}
            className="btn dark_btn">
                RUN2
            </div>
        </div>
    )
}

export default Test

