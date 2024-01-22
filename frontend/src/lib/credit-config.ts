export type CreditConfigType = {
    detailed: number;
    report: number;
    quick: number;
    code: number;
};
export type CreditType = keyof CreditConfigType;

export const creditConfig = {
    detailed: 14,
    report: 100,
    quick: 0,
    code: 12,
};
