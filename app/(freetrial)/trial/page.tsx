import FlowPlaygroundEditor from '@/components/FlowPlaygroundEditor';
import FlowPlaygroundEditorTrial from '@/components/FlowPlaygroundEditorTrial';
import PlaygroundEditorTrial from '@/components/PlaygroundEditorTrial';
import React from 'react';

type Props = {};

const Trial = (props: Props) => {
  const trialWorkflow = {
    id: 'trial-id',
    name: 'Trial Workflow',
    userId: 'trial-user',
    description: 'This is a trial workflow.',
    definition: JSON.stringify({
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    }),
    status: 'trial',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <div className='w-full h-screen'>
      <PlaygroundEditorTrial workflow={trialWorkflow} />
    </div>
  );
};

export default Trial;
