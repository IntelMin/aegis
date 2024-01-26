export const truncateString = (number: string) => {
    if (Number(number) >= 1e12) {
        return (Number(number) / 1e12).toFixed(2) + 'B';
    } else {
        return parseFloat(
            parseFloat(number).toFixed(2)
        ).toLocaleString('en');
    }
}
