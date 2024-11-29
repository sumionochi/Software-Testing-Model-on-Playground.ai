export enum PlaygroundTaskType{
    LAUNCH_BROWSER = "LAUNCH_BROWSER",
}

export enum TaskParamType {
    STRING = "STRING",
}

export interface TaskParam {
    name: string;
    type: TaskParamType;
    helperText?: string;
    required?: boolean;
    hideHandle?: boolean;
    value?: string;
    [key: string]: any;
  }
  
export interface ParamProps {
param: TaskParam;
value: string;
updateNodeParamValue: (newValue: string) => void;
}
  