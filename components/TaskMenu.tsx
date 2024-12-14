import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";
import { PlaygroundTaskType } from "@/schema/playgroundTask";
import { Button } from "./ui/button";

export default function TaskMenu() {
  return (
    <aside className="w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["extraction", "ai", "translation", "testing"]}
      >
        {/* AI Tasks Category */}
        <AccordionItem value="ai">
          <AccordionTrigger className="font-bold">AI Tasks</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <TaskMenuBtn taskType={PlaygroundTaskType.SUMMARIZATION} />
            <TaskMenuBtn taskType={PlaygroundTaskType.WRITER} />
            <TaskMenuBtn taskType={PlaygroundTaskType.REWRITER} />
            <TaskMenuBtn taskType={PlaygroundTaskType.PROMPT} />
          </AccordionContent>
        </AccordionItem>

        {/* Translation Tasks Category */}
        <AccordionItem value="translation">
          <AccordionTrigger className="font-bold">Translation</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <TaskMenuBtn taskType={PlaygroundTaskType.TRANSLATION} />
            <TaskMenuBtn taskType={PlaygroundTaskType.LANGUAGE_DETECTION} />
          </AccordionContent>
        </AccordionItem>

        {/* Special Models Category */}
        <AccordionItem value="testing">
          <AccordionTrigger className="font-bold">Special Models</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            {/* Existing special model */}
            <TaskMenuBtn taskType={PlaygroundTaskType.SOFTWARE_TESTING_MODEL} />

            {/* Coming Soon Models */}
            <ComingSoonItem
              label="DeFi and Finance"
              description="Insights about decentralized finance protocols, trading strategies, and onchain activities."
            />
            <ComingSoonItem
              label="DePIN"
              description="Decentralized physical network data integration for real-world infrastructure optimization."
            />
            <ComingSoonItem
              label="On-Chain"
              description="Comprehensively maps on-chain transactions, enabling intelligent blockchain-based predictions."
            />
            <ComingSoonItem
              label="Tokenomics"
              description="Understands token economics and incentive mechanisms for resilient tokenized ecosystems."
            />
            <ComingSoonItem
              label="Sports"
              description="Analyzes sports data, historical scores, and provides real-time insights and forecasts."
            />
            <ComingSoonItem
              label="Language"
              description="Trained on multilingual grammar and syntax, enabling real-time translation and linguistic understanding."
            />
            <ComingSoonItem
              label="Cybersecurity"
              description="Trained on cyberattacks and threat intelligence, aiding in proactive security measures."
            />
            <ComingSoonItem
              label="Robotics"
              description="Integrates autonomous driving and robotics engineering to optimize robotic systems."
            />
            <ComingSoonItem
              label="Mathematics"
              description="Solves mathematical problems, exploring linear algebra, probability, calculus, and beyond."
            />
            <ComingSoonItem
              label="Web3 Alpha Model"
              description="Knowledge of community engagement, market analysis, and growth tactics for Web3."
            />
            <ComingSoonItem
              label="Research"
              description="Trained on academic studies, empowering AI for research synthesis, hypothesis testing, and methodologies."
            />
            <ComingSoonItem
              label="Social Media"
              description="Understands user personas, trends, and marketing strategies for higher engagement."
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}

function TaskMenuBtn({ taskType }: { taskType: PlaygroundTaskType }) {
  const task = TaskRegistry[taskType];

  const onDragStart = (event: React.DragEvent, type: PlaygroundTaskType) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Button
      variant="secondary"
      className="flex justify-between items-center gap-2 border w-full"
      draggable
      onDragStart={(event) => onDragStart(event, taskType)}
    >
      <div className="flex gap-2">
        <task.icon size={20} />
        <span>{task.label}</span>
      </div>
    </Button>
  );
}

function ComingSoonItem({ label, description }: { label: string; description: string }) {
  return (
    <div className="flex flex-col border p-2 rounded opacity-50 cursor-not-allowed">
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{label}</span>
        </div>
        <span className="text-sm text-gray-500">Coming Soon</span>
      </div>
      <p className="text-xs text-gray-600 mt-1">{description}</p>
    </div>
  );
}
