import { createMailSender } from "./alert-sender";

const DEFAULT_TRIGGER = (_1: unknown, _2: unknown) => true;
// eslint-disable-next-line require-await
const DEFAULT_ON_ERROR = async <I>(e: Error, inputData: I) => {
  console.log("InputData:", JSON.stringify(inputData, null, 2), "\nError:", e.toString());
};

export type AlertSender<I, O> = (inputData: I, outputData: O)=> Promise<unknown>;
type ProcessProps<I, O> = {
  action: (inputData: I)=> Promise<O>;
  showInfo?: (outputData: O)=> void;
  trigger?: (inputData: I, outputData: O)=> boolean;
  sendAlert: AlertSender<I, O>;
  onError?: (e: Error, inputData: I)=> Promise<void>;
};
export function newProcess<I, O>( { action,
  showInfo = console.log,
  trigger,
  sendAlert = createMailSender(()=>( {} )),
  onError = DEFAULT_ON_ERROR }: ProcessProps<I, O>): (inputData: I)=> Promise<O | void> {
  return (inputData: I) => {
    return action(inputData)
      .then(outputData =>{
        showInfo?.(outputData);

        return outputData;
      } )
      .then(async outputData=> {
        if ((trigger ?? DEFAULT_TRIGGER)(inputData, outputData)) {
          await sendAlert(inputData, outputData)
            .catch(e=>{
              console.error("Error sending alert:", e.toString());
            } );
        }

        return outputData;
      } )
      .catch(e=>{
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        onError(e, inputData);
      } );
  };
}
