const handleSQLParams = <P>(
    reqBody: P
): {
    keys: string[]
    values: any[]
} => {
    const keys = Object.keys(reqBody as Record<string, any>).map(
        (key) => `"${key}"`
    );
    const values = Object.values(reqBody as Record<string, any>);
    return { keys, values };
};

export { handleSQLParams };
