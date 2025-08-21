export type callBackFunction = (event?: Event | any) => void;

// Action as hook
export type Action = {
  target: string;
  targetNode?: string;
  trigger: any;
  cb: callBackFunction;
  id?: string;
  delay?: number; // in ms
};

export const ActionComponent = () => {
  return <></>;
};
