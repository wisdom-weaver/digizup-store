const functions = require('firebase-functions');
const express = require('express');
const stripe = require('stripe')('sk_test_51HR0lzK03SbZNRhEdnS9YmPHGGoRucIcnsxu5g5eL9AePGTqx5AIyxi3HkjecDiTfOVWFtAcxB6bAFy2bYFx8CYR00BZGJ5Dd6');
const cors = require('cors');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = express();
app.use(cors({origin: true}));
app.use(express.json());
app.get('/',(req,res)=>{
    res.status(200).send('hello everyone this is digizup store api')
})
app.get('/danish',(req,res)=>{
    res.status(200).send("hello I'm Danish")
})
app.post('/payments/create', async (req, res)=>{
    const total = req.query.total;
    // console.log('payment request recieved>>', total);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: total, //this is in sub units
        currency: "inr"
    })
    res.header( "Access-Control-Allow-Origin" ).status(201).send({
        clientSecret: paymentIntent.client_secret
    })
})
app.post('/requestCancellation', async (req, res)=>{
    ;
    // console.log('cancellaiton request');
    var  {userid, orderid, cancellationMessage} = req.query;
    // console.log(userid, orderid, cancellationMessage);
    if(cancellationMessage == '') cancellationMessage= 'Cancellation Requested';
    if( !userid || !orderid) return res.header( "Access-Control-Allow-Origin" ).status(201).send();
    const oaid = `${userid}-${orderid}`;
    return admin.firestore().collection('ordersForAdmins').doc(oaid).get()
    .then((doc)=>{
        const data = doc.data();
        return admin.firestore().collection('ordersForAdmins').doc(oaid).update({
            cancellationMessage: cancellationMessage,
            tracking: [{title:'Cancellation Requested', updateTime: new Date()}, ...data.tracking],
            status:'Cancellation Requested'
        })
    }).then(()=>{
        res.header( "Access-Control-Allow-Origin" ).status(201).send();
    }).catch(()=>{
        res.header( "Access-Control-Allow-Origin" ).status(201).send();
    })

})

exports.api = functions.https.onRequest(app)

const createOrderForAdmins = (orderForAdminsDoc,orderForAdminsDocId)=>{
    return admin.firestore().collection('ordersForAdmins')
        .doc(orderForAdminsDocId).set(orderForAdminsDoc);
}

const updateOrderAdminSide = (update)=>{
    return admin.firestore().collection('ordersForAdmins')
        .doc(update.oaid)
        .update(update.data);
}
const updateOrderUserSide = (update)=>{
    return admin.firestore().collection('users')
        .doc(update.consumeruid)
        .collection('orders')
        .doc(update.orderid)
        .update(update.data);
}

exports.orderPlaced = functions.firestore
    .document('users/{userid}/orders/{orderid}')
    .onCreate(doc=>{
        const order = doc.data();
        const orderForAdminsDocData = {
            orderid: doc.id,
            address: order.address,
            paymentType: order.paymentType,
            status: order.status,
            consumeruid: order.consumeruid,
            createdAt: order.createdAt,
            isOpen: order.isOpen,
            total: order.total,
            cart: order.cart,
            tracking: order.tracking,
            updatedAt: new Date()
        }
        const orderForAdminsDocId = `${orderForAdminsDocData.consumeruid}-${orderForAdminsDocData.orderid}`;
        return createOrderForAdmins(orderForAdminsDocData, orderForAdminsDocId);
        // return console.log('order req',order);
    })

exports.orderUpdatedAdminsSide = functions.firestore
    .document('ordersForAdmins/{oaid}')
    .onUpdate((change, context)=>{
        const oaBefore = change.before.data();
        const oa = change.after.data();
        if(oaBefore.status == oa.status && oaBefore.tracking == oa.tracking && oaBefore.isOpen == oa.isOpen) return;
        const update = {
            consumeruid: oa.consumeruid,
            orderid: oa.orderid,
            data: {
                status: oa.status,
                tracking: oa.tracking,
                isOpen: oa.isOpen
            }
        }
        return updateOrderUserSide(update);
    })

exports.productPriceUpdated = functions.firestore
    .document('products/{productid}')
    .onUpdate((change,context)=>{
        const beforedoc = change.before.data();
        const afterdoc = change.after.data();
        if(afterdoc.hasOptions == true){
            var productOptions = Object.keys(afterdoc.productOptions).sort().filter(each=>afterdoc.productOptions[each].isActive);
            productOptions.forEach(each=>{
                if(beforedoc.productOptions[each].price != afterdoc.productOptions[each].price){
                    const details = {
                        productid: context.params.productid,
                        option: each,
                        newPrice: afterdoc.productOptions[each].price,
                        notificationMessage: `Price of ${afterdoc.productName} has ${(beforedoc.productOptions[each].price < afterdoc.productOptions[each].price)?('increased'):('decreased')} from ${beforedoc.productOptions[each].price} to ${afterdoc.productOptions[each].price}`
                    };
                    // console.log('priceUpdate details',details);
                    return priceChangeAction(details)
                }
                if(beforedoc.productOptions[each].inStock ==true &&  afterdoc.productOptions[each].inStock ==false){
                    const details = {
                        productid: context.params.productid,
                        option: each,
                        notificationMessage: `${afterdoc.productName} has gone out of stock`
                    }
                    // console.log('priceUpdate details',details);
                    return outOfStockAction(details)
                }
            })
        }else{
            if(beforedoc.price != afterdoc.price){
                const details = {
                    productid: context.params.productid,
                    option: false,
                    newPrice: afterdoc.price,
                    notificationMessage: `Price of ${afterdoc.productName} has ${(beforedoc.price<afterdoc.price)?('increased'):('decreased')} from ${beforedoc.price} to ${afterdoc.price}`
                }
                // console.log('priceUpdate details',details);
                return priceChangeAction(details)
            }
            if(beforedoc.inStock ==true &&  afterdoc.inStock ==false){
                const details = {
                    productid: context.params.productid,
                    option: false,
                    notificationMessage: `${afterdoc.productName} has gone out of stock`
                }
                // console.log('priceUpdate details',details);
                return outOfStockAction(details)
            }
        }
    })

const outOfStockAction = (details)=>{
    return admin.firestore().collectionGroup('cart').where('productid','==',details.productid).where('option','==',details.option).get().then(cartDocs=>{
        var batch = admin.firestore().batch();
        cartDocs.forEach((doc)=>{
            var path = doc.ref.path;
            var pathRef = admin.firestore().doc(path);
            var notificationPath = doc.ref.path.split('cart').join('cartNotifications');
            var notificationPathRef = admin.firestore().doc(notificationPath);
            batch.delete(pathRef);
            batch.set(notificationPathRef, { notificationMessage: details.notificationMessage, createdAt: new Date() })  
        })
        return batch.commit().then(()=>{ 
            return console.log('batch committed');
        });
    });
}
const priceChangeAction = (details)=>{
    return admin.firestore().collectionGroup('cart').where('productid','==',details.productid).where('option','==',details.option).get().then(cartDocs=>{
        var batch = admin.firestore().batch();
        cartDocs.forEach((doc)=>{
            var path = doc.ref.path;
            var pathRef = admin.firestore().doc(path);
            var notificationPath = doc.ref.path.split('cart').join('cartNotifications');
            var notificationPathRef = admin.firestore().doc(notificationPath);
            batch.update(pathRef, { productPrice: parseFloat(details.newPrice) } );
            batch.set(notificationPathRef, { notificationMessage: details.notificationMessage, createdAt: new Date() })  
        })
        return batch.commit().then(()=>{ 
            return console.log('batch committed');
        });
    });
}

