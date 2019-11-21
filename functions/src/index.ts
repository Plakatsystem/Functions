import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const updateDepartment = functions.firestore.document('departments/{depId}').onUpdate(( change, context ) => {
    // admin.firestore().collection('users').add({tester: 'ff'}).then(( result ) => {
    //     console.log('success' + result + ':::::: ' + change.after.data());
    // }).catch(( err ) => {
    //     console.log(err)
    // });

    // @ts-ignore
    if ( change.before.data().name !== change.after.data().name ) {
        const userRef = admin.firestore().collection('users');
        userRef.get().then(( snapshot ) => {
            snapshot.forEach(doc => {
                // @ts-ignore
                if ( doc.data().department === change.before.data().name ) {
                    // @ts-ignore
                    admin.firestore().collection('users').doc(doc.id).update({department: change.after.data().name}).then(( res ) => {
                        console.log(res);
                    }).catch(( err ) => {
                        console.log(err)
                    });
                }
            })
        }).catch(err => {
            console.log('Error getting documents', err);
        });
    }


});
