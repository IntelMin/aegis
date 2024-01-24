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
export const credits_chart = [
    { credits: 100, amount: 0.5, package: "Starter" },
    { credits: 230, amount: 1, package: "Seasoned" },
    { credits: 600, amount: 2, package: "Veteran" },
];