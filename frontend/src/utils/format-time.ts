export const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);

    const hours = date.getUTCHours() % 12 || 12;
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const period = date.getUTCHours() >= 12 ? 'PM' : 'AM';

    return `${hours}:${minutes} ${period}`;
}