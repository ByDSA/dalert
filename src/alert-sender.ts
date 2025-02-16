import { sendMailError, sendMail } from "./mails";
import { AlertSender } from "./process";

export function onErrorSendMail<I>(inputData: I, e: Error) {
  return sendMailError(e, inputData);
}

export function createMailSender<I, O>(
  f: (i: I, o?: O)=> Partial<Parameters<typeof sendMail>[0]>,
): AlertSender<I, O> {
  return async (inputData: I, outputData?: O, errors?: Error[]): Promise<void> => {
    const props = f(inputData, outputData);
    let text = "Input data:"
        + JSON.stringify(inputData, null, 2);

    if (outputData) {
      text += "\nOutput data:"
        + JSON.stringify(outputData, null, 2);
    }

    if (errors && errors.length > 0) {
      text += "\nErrors:"
          + JSON.stringify(errors.map(e=>e.toString()), null, 2);
    }

    await sendMail( {
      subject: "Dalarm",
      html: "<pre>"
        + text
        + "</pre>",
      text,
      ...props,
    } );
  };
}
