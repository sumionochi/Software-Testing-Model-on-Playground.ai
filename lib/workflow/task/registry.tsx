// registry.tsx

import { TaskDefinition, PlaygroundTaskType } from "@/schema/playgroundTask";
import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";
import { PageToHtmlTask } from "./PageToHTML";
import { ExtractTextFromElement } from "./ExtractTextFromElement";
import { LanguageDetectionTask } from "./LanguageDetection";
import { SummarizationTask } from "./Summarization";
import { TranslationTask } from "./Translation";
import { WriterTask } from "./Writer";
import { RewriterTask } from "./Rewriter";
import { PromptTask } from "./Prompt";

export const TaskRegistry: Record<PlaygroundTaskType, TaskDefinition> = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHtmlTask,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElement,
    LANGUAGE_DETECTION: LanguageDetectionTask,
    SUMMARIZATION: SummarizationTask,
    TRANSLATION: TranslationTask,
    WRITER: WriterTask,
    REWRITER: RewriterTask,
    PROMPT: PromptTask,
};
