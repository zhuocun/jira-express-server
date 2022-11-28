interface ITask {
    taskName: string;
    coordinatorId: string;
    projectId: string;
    epicId: string;
    kanbanId: string;
    type: string;
    note: string;
}

export default ITask;
