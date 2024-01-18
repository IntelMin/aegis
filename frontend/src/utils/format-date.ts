export const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp);

    const year = date.getUTCFullYear().toString().slice(-2);
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');

    return `${day}-${month}-${year}`;
}
