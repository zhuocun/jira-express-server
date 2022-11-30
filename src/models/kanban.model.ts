import IKanban from "../interfaces/kanban.js";
import mongoose from "mongoose";

export interface IKanbanModel extends IKanban, mongoose.Document {
}

const kanbanSchema = new mongoose.Schema<IKanbanModel>({
    kanbanName: {
        type: String,
        required: true
    },
    projectId: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const kanbanModel = mongoose.model<IKanbanModel>("Kanban", kanbanSchema);

export default kanbanModel;
