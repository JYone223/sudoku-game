export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinAndSeconds = `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds
  ).padStart(2, '0')}`;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${formattedMinAndSeconds}`;
  }

  return formattedMinAndSeconds;
};
