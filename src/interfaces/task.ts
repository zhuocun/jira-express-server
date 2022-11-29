interface ITask {
    kanbanId: string;
    coordinatorId: string;
    epic: string;
    taskName: string;
    type: string;
    note: string;
    storyPoints: number;
}

export default ITask;