import app from 'firebase/app';
import 'firebase/storage';
import { firebaseConfig } from '../firebaseConfig';

class Firebase {

    public get app() {
        return app;
    }

    public get storage() {
        return app.storage();
    }

    private static getFileNameFromURL(url: string) {
        const fileName = url.split('/')[url.split('/').length - 1];

        return fileName.split('?')[0];
    }

    constructor() {
        app.initializeApp(firebaseConfig);
    }

    public async uploadImage(image: File, fileName: string, folder?: string) {
        const storageRef = this.storage.ref();
        const name = fileName + '-' + new Date().toJSON();
        const imageRef = storageRef.child(`${folder ? folder + '/' : ''}${name}`);

        const snapshot = await imageRef.put(image);

        return snapshot.ref.getDownloadURL();
    }

    public async deleteImage(imageUrl: string) {
        const storageRef = this.storage.ref();
        const fileName = Firebase.getFileNameFromURL(imageUrl);
        const imageRef = storageRef.child(decodeURIComponent(fileName));

        await imageRef.delete();
    }
}

const firebase = new Firebase();

export { firebase as Firebase };
