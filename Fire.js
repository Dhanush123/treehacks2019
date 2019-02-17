import uuid from 'uuid';

// import getUserInfo from './utils/getUserInfo';
// import shrinkImageAsync from './utils/shrinkImageAsync';
import uploadPhoto from './Utils';

import { ImageManipulator } from 'expo';

function reduceImageAsync(uri) {
    return ImageManipulator.manipulate(uri, [{ resize: { width: 500 } }], {
        compress: 0.5,
    });
}
const firebase = require('firebase');
// Required for side-effects
require('firebase/firestore');

const collectionName = 'snack-SJucFknGX';

class Fire {
    constructor() {
        if (!firebase.apps.length) {
            // firebase.initializeApp({});
            firebase.initializeApp({
                apiKey: "AIzaSyBC37iAUv624fbWFc1zUvB0cl2w2vwfZLI",
                authDomain: "treehacks2018-59cb6.firebaseapp.com",
                databaseURL: "https://treehacks2018-59cb6.firebaseio.com",
                projectId: "treehacks2018-59cb6",
                storageBucket: "treehacks2018-59cb6.appspot.com",
                messagingSenderId: "544377414822"
            });
        }
        // // Some nonsense...
        // firebase.firestore().settings({ timestampsInSnapshots: true });

        // // Listen for auth
        // firebase.auth().onAuthStateChanged(async user => {
        //   if (!user) {
        //     await firebase.auth().signInAnonymously();
        //   }
        // });
    }

    //   // Download Data
    //   getPaged = async ({ size, start }) => {
    //     let ref = this.collection.orderBy('timestamp', 'desc').limit(size);
    //     try {
    //       if (start) {
    //         ref = ref.startAfter(start);
    //       }

    //       const querySnapshot = await ref.get();
    //       const data = [];
    //       querySnapshot.forEach(function(doc) {
    //         if (doc.exists) {
    //           const post = doc.data() || {};

    //           // Reduce the name
    //           const user = post.user || {};

    //           const name = user.deviceName;
    //           const reduced = {
    //             key: doc.id,
    //             name: (name || 'Secret Duck').trim(),
    //             ...post,
    //           };
    //           data.push(reduced);
    //         }
    //       });

    //       const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    //       return { data, cursor: lastVisible };
    //     } catch ({ message }) {
    //       alert(message);
    //     }
    //   };

    // Upload Data

    uploadPhotoAsync = async uri => {
        const path = `image`;
        let naming = uuid.v4() + ".jpg";
        return uploadPhoto({ localUri: uri, uploadUri: naming });
    };

    post = async (uri) => {
        try {
            const { uri: reducedImage, width, height } = await reduceImageAsync(
                uri
            );
            const remoteUrl = await this.uploadPhotoAsync(reducedImage);
            return remoteUrl;
        } catch ({ message }) {
            alert(message);
        }
    };

    firebaseUpload = async (remoteUrl) => {
        const urlkey = remoteUrl.substring(remoteUrl.length - 5, remoteUrl.length - 1);
        firebase.database().ref("/images/" + urlkey).set({ url: remoteUrl }, function (error) {
            if (error) {
                alert(JSON.stringify(error));
            }
        });
    }

    //   // Helpers
    //   get collection() {
    //     return firebase.firestore().collection(collectionName);
    //   }

    //   get uid() {
    //     return (firebase.auth().currentUser || {}).uid;
    //   }
    //   get timestamp() {
    //     return Date.now();
    //   }
}

Fire.shared = new Fire();
export default Fire;