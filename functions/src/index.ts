import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const updateDepartment = functions.firestore.document('departments/{depId}').onUpdate(( change, context ) => {
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


export const deleteDepartment = functions.firestore.document('departments/{depId}').onDelete(( change, context ) => {
    const userRef = admin.firestore().collection('users');
    userRef.get().then(( snapshot ) => {
        snapshot.forEach(doc => {
            console.log('Delete department', '=>', change.data(), change.id);
            // @ts-ignore
            if ( doc.data().department === change.data().name ) {
                // Delete user from Auth
                admin.auth().deleteUser(doc.id)
                    .then(function () {
                        console.log('Successfully deleted user from AUTH');
                        // Delete user from database
                        admin.firestore().collection('users').doc(doc.id).delete().then(( res ) => {
                            console.log('Successfully deleted user from database', doc.id);
                        }).catch(( err ) => {
                            console.log(err);
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

