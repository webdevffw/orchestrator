# Orchestrator

### Distribution
NPM Package

### Library
- Classes
- Interfaces
- Methods

### Usage
Import objects as dependencies
```
import { ActionController, IEventAction, IWorkerPhase } from 'orcarunner';

export const printString = (str: string, action: IEventAction): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log('\nPRINTING STRING:', str, '\n');
    resolve();
  });
}

export const demoWorkflow = (payload: any): IWorkerPhase[] => {
  const { args } = payload;

  return [
    {
      name: "",
      description: "",
      steps: [
        {
          name: "",
          fn: (action: IEventAction) => printString(args[0], action)
        }
      ]
    }
  ]
}

const activity = new ActionController({
  details: {
    title: "",
    logDir: "logs",
    logFile: "test-run.log",
    createdAt: "",
    updatedAt: "",
  },
  workflow: {
    payload: { args: [ "one", "two", "three" ] },
    starter: demoWorkflow
  }
});

activity.executeWorker();
```
