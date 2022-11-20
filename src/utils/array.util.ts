export const remove = (arr: string[], item: string) => {
    arr.forEach((value, index) => {
        if (value === item) {
            arr.splice(index, 1);
        }
    });
    return arr;
};
