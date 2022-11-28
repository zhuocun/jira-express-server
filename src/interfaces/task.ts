interface ITask {
    taskName: string;
    coordinatorId: string;
    projectId: string;
    epic: string;
    kanbanId: string;
    type: string;
    note: string;
    storyPoints: number;
}

export default ITask;
