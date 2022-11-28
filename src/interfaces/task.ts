interface ITask {
    taskName: string;
    coordinatorId: string;
    projectId: string;
    epic: string;
    kanbanId: string;
    type: string;
    note: string;
}

export default ITask;
