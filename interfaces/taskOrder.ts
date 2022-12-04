import IColumnOrder from "./columnOrder.js";

interface ITaskOrder extends IColumnOrder {
    fromColumnId: string;
    referenceColumnId: string;
}

export default ITaskOrder;
