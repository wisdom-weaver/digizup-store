const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

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

exports.orderUpdatedUserSide = functions.firestore
    .document('users/{userid}/orders/{orderid}')
    .onUpdate((change,context)=>{

        const order = change.after.data();
        const update = {
            oaid: `${context.params.userid}-${context.params.orderid}`,
            data:{
                tracking : order.tracking,
                status: order.status,
                cancellationMessage: order.cancellationMessage,
                isOpen: order.isOpen
            }
        }
        return updateOrderAdminSide(update);
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
        // console.log(oaid);
        return updateOrderUserSide(update);
        // return console.log('order req',order);
    })