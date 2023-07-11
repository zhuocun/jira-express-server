const handleError = (error: any, res: string): Error => {
    if (error instanceof Error) {
        return new Error(error.message);
    } else {
        return new Error(res);
    }
};

export default handleError;
