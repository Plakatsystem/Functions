import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// @ts-ignore
export const deleteDepartment = functions.firestore.document('departments/{depId}').onDelete(( change, context ) => {
    const postersRef = admin.firestore().collection('posters');
    postersRef.get().then(( snapshot ) => {
        snapshot.forEach(( doc ) => {
            // @ts-ignore
            if ( doc.data().department === change.data().name ) {
                admin.firestore().collection('posters').doc(doc.id).delete().then(( res ) => {
                    // @ts-ignore
                    console.log('Poster deleted from Department', change.data().name)
                }).catch(( err ) => {
                    console.log(err);
                })
            }
        })
    }).catch(( error2 ) => {
        console.log(error2);
    });


    const hungPostersRef = admin.firestore().collection('hungposters');
    hungPostersRef.get().then(( snapshot ) => {
        snapshot.forEach(( doc ) => {
            // @ts-ignore
            if ( doc.data().department === change.data().name ) {
                admin.firestore().collection('hungposters').doc(doc.id).delete().then(( res ) => {
                    // @ts-ignore
                    console.log('Hungposter deleted from Department', change.data().name)
                }).catch(( err ) => {
                    console.log(err);
                })
            }
        })
    }).catch(( error2 ) => {
        console.log(error2)
    });


    const userRef = admin.firestore().collection('users');
    console.log('Delete department', '=>', change.data(), change.id);
    userRef.get().then(( snapshot ) => {
        snapshot.forEach(doc => {
            // @ts-ignore
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

export const passwordChange = functions.https.onCall(async ( data, context ) => {
    console.log('Password change!');
    console.log('DATA RECEIVED: ', data);
    console.log('CONTEXT RECEIVED: ', context);
    if ( !context.auth ) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
            'while authenticated.');
    }
    return admin.auth().updateUser(data.uid, {password: data.pass}).then(( result ) => {
        console.log('User password has been updated => ', data.uid);
        return {success: 'true'};
    }).catch(( err ) => {
        console.log('User password has NOT been updated => ', data.uid, '===>> ', err);
        return {success: 'false'};
    });
    // return {text: 'OK'};
});



