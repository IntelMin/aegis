export const formatNumber = (
  input: number | string,
  decimals: number = 2
): string => {
  const num = typeof input === 'string' ? parseFloat(input) : input;

  if (isNaN(num)) {
    return 'Invalid number';
  }

  const format = (value: number, suffix: string) => {
    return Number(value.toFixed(decimals)).toString() + suffix;
  };

  if (num >= 1e15) {
    return format(num / 1e15, 'Q');
  } else if (num >= 1e12) {
    return format(num / 1e12, 'T');
  } else if (num >= 1e9) {
    return format(num / 1e9, 'B');
  } else if (num >= 1e6) {
    return format(num / 1e6, 'M');
  } else if (num >= 1e3) {
    return format(num / 1e3, 'K');
  } else {
    return format(num, '');
  }
};
