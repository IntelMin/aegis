export const formatNumber = (input: number | string): string => {
  const num = typeof input === 'string' ? parseFloat(input) : input;

  if (isNaN(num)) {
    return 'Invalid number';
  }

  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  } else {
    return num.toFixed(2);
  }
};
