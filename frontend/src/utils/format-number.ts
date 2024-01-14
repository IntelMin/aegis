export const formatNumber = (input: number | string): string => {
  const num = typeof input === 'string' ? parseFloat(input) : input;

  if (isNaN(num)) {
    return 'Invalid number';
  }

  const format = (value: number, suffix: string) => {
    // Convert to string using toFixed, then remove trailing zeros and decimal point if not needed
    return Number(value.toFixed(2)).toString() + suffix;
  };

  if (num >= 1e9) {
    return format(num / 1e9, 'B');
  } else if (num >= 1e6) {
    return format(num / 1e6, 'M');
  } else if (num >= 1e3) {
    return format(num / 1e3, 'K');
  } else {
    return format(num, '');
  }
};
