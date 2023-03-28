const filterRequest = (
    object: Record<string, unknown>
): Record<string, unknown> => {
    Object.keys(object).forEach((key) => {
        const value = object[key];
        if (isVoid(value)) {
            const { [key]: deleted, ...rest } = object;
            object = rest;
        }
    });
    return object;
};

const isVoid = (value: unknown): boolean => {
    return (
        value === undefined ||
        value === null ||
        value === "" ||
        (typeof value === "number" ? isNaN(value) : false)
    );
};

export default filterRequest;
