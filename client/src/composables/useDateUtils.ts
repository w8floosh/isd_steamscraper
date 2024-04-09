import { formatDuration, intervalToDuration } from 'date-fns';

export const useDateUtils = () => {
  const minutesToPlaytime = (playtime: number) => {
    if (playtime === 0) return 'never';
    const durations = intervalToDuration({
      start: 0,
      end: playtime * 60 * 1000,
    });

    return formatDuration(durations);
  };

  return { minutesToPlaytime };
};
