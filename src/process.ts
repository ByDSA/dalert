import { createMailSender } from "./alert-sender";

const DEFAULT_TRIGGER = (_1: unknown, _2: unknown) => true;

export type AlertSender<I, O> = (inputData: I, outputData?: O, errors?: Error[])=> Promise<unknown>;
type ProcessProps<I, O> = {
  action: (inputData: I)=> Promise<O>;
  showInfo?: (outputData: O)=> void;
  trigger?: (inputData: I, outputData: O)=> boolean;
  sendAlert: AlertSender<I, O>;
  onError?: (e: Error, inputData: I)=> Promise<void>;
  retry?: {
    maxTries: number;
  };
};
export function newProcess<I, O>( { action,
  showInfo = console.log,
  trigger,
  sendAlert = createMailSender(()=>( {} )),
  onError,
  retry }: ProcessProps<I, O>): (inputData: I)=> Promise<O | null> {
  return async (inputData: I) => {
    let outputData: O | null = null;
    const maxTries = retry?.maxTries ?? 3;
    let error: unknown | undefined;

    for (let i = 0; i < maxTries; i++) {
      try {
        outputData = await action(inputData);
      } catch (e) {
        error = e;
      }
    }

    try {
      if (error)
        throw error;

      if (!outputData)
        throw new Error("Output data is null or undefined");

      showInfo?.(outputData);

      if ((trigger ?? DEFAULT_TRIGGER)(inputData, outputData)) {
        await sendAlert(inputData, outputData)
          .catch(e=>{
            console.error("Error sending alert:", e.toString());
          } );
      }
    } catch (e: unknown) {
      if (onError)
        await onError(e as Error, inputData);
      else {
        console.log("InputData:", JSON.stringify(inputData, null, 2));
        console.error((e as Error).toString());
        await sendAlert(inputData, undefined, [e as Error])
          .catch(e2=>{
            console.error("Error sending alert:", e2.toString());
          } );
      }
    };

    return outputData;
  };
}
