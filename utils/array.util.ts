export const remove = (arr: string[], item: string): string[] => {
    arr.forEach((value, index) => {
        if (value === item) {
            arr.splice(index, 1);
        }
    });
    return arr;
};

function partition(
    arr: Array<{ index: number }>,
    low: number,
    high: number
): number {
    const pivot: number = arr[high].index;
    let i: number = low - 1;

    for (let j = low; j <= high - 1; j++) {
        if (arr[j].index <= pivot) {
            i++;
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    const tempN = arr[high];
    arr[high] = arr[i + 1];
    arr[i + 1] = tempN;

    return i + 1;
}

export function quickSort(
    arr: Array<{ index: number }>,
    low = 0,
    high = arr.length - 1
): void {
    if (low < high) {
        const pi: number = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
