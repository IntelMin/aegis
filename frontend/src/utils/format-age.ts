export const formatAge = (
  timestamp: number,
  short: boolean = false
): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  const format = (value: number, unit: string) => {
    if (short) {
      return `${value}${unit.charAt(0)}`;
    }
    return `${value} ${unit}${value === 1 ? '' : 's'} ago`;
  };

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return format(interval, 'year');
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return format(interval, 'month');
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return format(interval, 'day');
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return format(interval, 'hour');
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return format(interval, 'minute');
  }
  return format(Math.floor(seconds), 'second');
};
