import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

let fs: FirebaseFirestore.Firestore = admin.firestore();

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const byebye = functions.https.onCall(
  (data: any, context: functions.https.CallableContext) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    return "OK";
  }
);

export const createNewUserTemplateOnSignUp = functions.auth
  .user()
  .onCreate(async (user: admin.auth.UserRecord) => {
    const userId = user.uid;
    const emailAddress = user.email;

    const userDataTemplate = {
      accountCreationDate: new Date(),
      userName: emailAddress,
    };

    await fs.doc(`Users/${userId}/`).set(userDataTemplate, { merge: true });
  });
