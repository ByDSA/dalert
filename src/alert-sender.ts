import { sendMailError, sendMail } from "./mails";
import { AlertSender } from "./process";

export function onErrorSendMail<I>(inputData: I, e: Error) {
  return sendMailError(e, inputData);
}

export function createMailSender<I, O>(
  f: (i: I, o: O)=> Partial<Parameters<typeof sendMail>[0]>,
): AlertSender<I, O> {
  return async (inputData: I, outputData: O): Promise<void> => {
    const props = f(inputData, outputData);

    await sendMail( {
      subject: "Dalarm",
      html: "<pre>"
        + JSON.stringify(outputData, null, 2)
        + "</pre>",
      ...props,
    } );
  };
}
