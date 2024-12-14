// playgroundTask.ts

import { LucideProps } from "lucide-react";

export enum PlaygroundTaskType {
    LAUNCH_BROWSER = "LAUNCH_BROWSER",
    PAGE_TO_HTML = "PAGE_TO_HTML",
    EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT",
    LANGUAGE_DETECTION = "LANGUAGE_DETECTION",
    SUMMARIZATION = "SUMMARIZATION",
    TRANSLATION = "TRANSLATION",
    WRITER = "WRITER",
    REWRITER = "REWRITER",
    PROMPT = "PROMPT",
    SOFTWARE_TESTING_MODEL = "SOFTWARE_TESTING_MODEL"
}

export enum TaskParamType {
    STRING = "STRING",
    BROWSER_INSTANCE = "BROWSER_INSTANCE",
}

export interface TaskParam {
    name: string;
    type: TaskParamType;
    helperText?: string;
    required?: boolean;
    hideHandle?: boolean;
    variant?: string;
    value?: string;
    [key: string]: any;
}

export interface TaskDefinition {
    type: PlaygroundTaskType;
    label: string;
    icon: (props: LucideProps) => JSX.Element;
    isEntryPoint: boolean;
    inputs: TaskParam[];
    outputs: TaskParam[];
    execute?: (inputs: Record<string, any>) => Promise<Record<string, any>>;
}

export interface ParamProps {
    param: TaskParam;
    value: string;
    updateNodeParamValue: (newValue: string) => void;
    disabled?: boolean;
}
