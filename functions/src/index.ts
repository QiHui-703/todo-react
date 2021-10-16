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
    console.log(context.auth);
    functions.logger.info("Hello logs!", { structuredData: true });
    console.log("this is from the console log");
    return "OK";
  }
);

export const createNewUserTemplateOnSignUp = functions.auth
  .user()
  .onCreate(async (user: admin.auth.UserRecord) => {
    console.log(`a new user was created, with user id: ${user.uid}`);
    const userId = user.uid;
    const emailAddress = user.email;

    const userDataTemplate = {
      accountCreationDate: new Date(),
      userName: emailAddress,
    };

    console.log(JSON.stringify(userDataTemplate));

    await fs.doc(`Users/${userId}/`).set(userDataTemplate, { merge: true });
  });
