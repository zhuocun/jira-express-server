import ETableName from "../constants/eTableName.js";
import type ITask from "../interfaces/task.js";
import mongoose from "mongoose";

interface ITaskModel extends ITask, mongoose.Document {
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
    columnId: {
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
    },
    index: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const taskModel = mongoose.model<ITaskModel>(ETableName.TASK, taskSchema);

export default taskModel;
