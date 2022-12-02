interface ITask {
    kanbanId: string;
    coordinatorId: string;
    epic: string;
    taskName: string;
    type: string;
    note: string;
    projectId: string;
    storyPoints: number;
    index: number;
}

export default ITask;
