import IColumn from "../interfaces/column.js";
import mongoose from "mongoose";

export interface IColumnModel extends IColumn, mongoose.Document {
}

const columnSchema = new mongoose.Schema<IColumnModel>({
    columnName: {
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

const columnModel = mongoose.model<IColumnModel>("Column", columnSchema);

export default columnModel;
