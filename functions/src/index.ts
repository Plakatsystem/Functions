import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// @ts-ignore
export const deleteDepartment = functions.firestore.document('departments/{depId}').onDelete(( change, context ) => {
    const userRef = admin.firestore().collection('users');
    userRef.get().then(( snapshot ) => {
        snapshot.forEach(doc => {
            console.log('Delete department', '=>', change.data(), change.id);
            // @ts-ignore
            console.log('LOGGER: ', '====>>>', change.data());
            console.log('LOGGER: DOC', '====>>>', doc.data());
            // @ts-ignore
            if ( doc.data().department === change.data().name ) {
                // Delete user from Auth
                admin.auth().deleteUser(doc.id)
                    .then(function () {
                        console.log('deleted user from same department in AUTH')
                        admin.firestore().collection('users').doc(doc.id).delete().then(( res ) => {
                            console.log('Deleted user from DB');
                        }).catch(( err ) => {
                            console.log('Could not delete user from DB');
                        });
                    })
                    .catch(function ( error ) {
                        console.log('Error deleting user:', error);
                    });
                console.log('Detected user with same department', doc.id)
            }

        })
    }).catch(( err ) => {
        console.log(err);
    })
});

// export const passwordChange = functions.https.onCall(( data, context ) => {
//     console.log('Password change!');
//     console.log('DATA RECEIVED: ', data);
//     console.log('CONTEXT RECEIVED: ', context);
//
//     // if (!context.auth) {
//     //     // Throwing an HttpsError so that the client gets the error details.
//     //     throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
//     //         'while authenticated.');
//     // }
//     return {text: 'OK'};
// });



