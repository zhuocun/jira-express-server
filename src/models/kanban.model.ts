import IKanban from "../interfaces/kanban.js";
import mongoose from "mongoose";

export interface IKanbanModel extends IKanban, mongoose.Document {
}

const kanbanSchema = new mongoose.Schema<IKanbanModel>({
    kanbanName: {
        type: "string",
        required: true
    },
    projectId: {
        type: "string",
        required: true
    }
}, { timestamps: true });

const kanbanModel = mongoose.model<IKanbanModel>("Kanban", kanbanSchema);

export default kanbanModel;
