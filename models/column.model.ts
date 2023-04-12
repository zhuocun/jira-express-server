import ETableName from "../constants/eTableName.js";
import type IColumn from "../interfaces/column.js";
import mongoose from "mongoose";

interface IColumnModel extends IColumn, mongoose.Document {
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

const columnModel = mongoose.model<IColumnModel>(ETableName.COLUMN, columnSchema);

export default columnModel;
