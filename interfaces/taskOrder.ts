import IKanbanOrder from "./kanbanOrder.js";

interface ITaskOrder extends IKanbanOrder {
    fromKanbanId: string;
    referenceKanbanId: string;
}

export default ITaskOrder;
