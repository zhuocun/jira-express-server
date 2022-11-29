import ITask from "../interfaces/task.js";
import mongoose from "mongoose";

export interface ITaskModel extends ITask, mongoose.Document {

}

const taskSchema = new mongoose.Schema<ITaskModel>({
    taskName: {
        type: String,
        required: true
    },
    coordinatorId: {
        type: String,
        required: true
    },
    epic: {
        type: String,
        required: true
    },
    kanbanId: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    projectId: {
        type: String,
        required: true
    },
    storyPoints: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const taskModel = mongoose.model<ITaskModel>("Task", taskSchema);

export default taskModel;
