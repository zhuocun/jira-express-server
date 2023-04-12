import ETableName from "../constants/eTableName.js";
import type IProject from "../interfaces/project.js";
import mongoose from "mongoose";

interface IProjectModel extends IProject, mongoose.Document {
}

const projectSchema = new mongoose.Schema<IProjectModel>({
    projectName: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    managerId: {
        type: String,
        required: true
    }
}, { timestamps: true });

const projectModel = mongoose.model<IProjectModel>(ETableName.PROJECT, projectSchema);

export default projectModel;
