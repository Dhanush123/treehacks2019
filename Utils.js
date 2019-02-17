import firebase from 'firebase';
function uploadPhoto({ localUri, uploadUri }) {
    return new Promise(async (res, rej) => {
        let blob;
        try {
            console.log(localUri);
            console.log(uploadUri);
            const response = await fetch(localUri);
            blob = await response.blob();
        } catch (error) {
            console.log("upload error", error);
            rej(error);
            return;
        }

        const ref = firebase.storage().ref(uploadUri);
        const unsubscribe = ref.put(blob).on(
            'state_changed',
            state => { },
            err => {
                console.log("firebase unsub err", err);
                unsubscribe();
                rej(err);
            },
            async () => {
                unsubscribe();
                const url = await ref.getDownloadURL();
                res(url);
            },
        );
    });
}

export default uploadPhoto;