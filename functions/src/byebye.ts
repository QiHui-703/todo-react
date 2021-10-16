import * as functions from "firebase-functions";

export const byebye = functions.https.onCall(
  (data: any, context: functions.https.CallableContext) => {
    console.log(context.auth);
    functions.logger.info("Hello logs!", { structuredData: true });
    console.log("this is from the console log");
    return "OK";
  }
);
