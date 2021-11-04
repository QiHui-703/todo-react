import * as functions from "firebase-functions";

export const byebye = functions.https.onCall(
  (data: any, context: functions.https.CallableContext) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    return "OK";
  }
);
