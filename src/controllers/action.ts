import { GlobalState } from "@state/jobs";
import { IDetails } from "@models/interfaces";
import { Workflow, JobDetails } from "@models/types";
import Job from "@lib/job";

export const runtime = "nodejs";

export class ActionController {
  protected processStructure: any;

  constructor(
    private details: IDetails,
    protected work: Workflow,
    protected state: GlobalState,
  ) {}

  executeWorker = (): JobDetails | undefined => {
    const job = new Job(this.details, this.work);

    try {
      const added = this.state.addJob(job).get(job.getId())
      added?.start();

      return added?.getDetails();
    } catch (error) {
      console.error("Error activating worker:", error);
      throw new Error("Failed to activate worker.");
    }
  }
}
