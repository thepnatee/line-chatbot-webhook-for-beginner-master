import * as admin from 'firebase-admin'
const serviceAccount = require("../config.json");
admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "vvvvvvvvvvvvvvvv"
});

export default admin.firestore()

