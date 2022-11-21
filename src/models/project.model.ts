import { IProject } from "../interfaces/project.js";
import mongoose from "mongoose";
import { baseModel } from "./base.model.js";

export interface IProjectModel extends IProject, mongoose.Document {

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
        ref: "User"
    },
    ...baseModel
});

const projectModel = mongoose.model<IProjectModel>("Project", projectSchema);

export default projectModel;
