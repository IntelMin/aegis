export function formatCurrency(number: number) {
    let reversedNumber = String(number).split('').reverse().join('');
    let groups = reversedNumber.match(/.{1,3}/g);
    let formattedNumber = groups?.join(',').split('').reverse().join('');
    formattedNumber = '$' + formattedNumber;

    return formattedNumber;
}