import { LeaderboardsTab } from './types';
import { useLeaderboardsService } from './useLeaderboardsService';

const {
  getAchievementScoreFriendsLeaderboard,
  getPlaytimeFriendsLeaderboard,
  getVersatilityScoreFriendsLeaderboard,
} = useLeaderboardsService();

export const useLeaderboardTabs = () => {
  const loaderMapping = new Map<
    LeaderboardsTab,
    (userId: string) => Promise<unknown>
  >([
    ['achievementScore', getAchievementScoreFriendsLeaderboard],
    ['playtime', getPlaytimeFriendsLeaderboard],
    ['versatility', getVersatilityScoreFriendsLeaderboard],
  ]);

  async function loadData<T = unknown>(
    tab: LeaderboardsTab,
    userId: string
  ): Promise<T | undefined> {
    const handler = loaderMapping.get(tab);
    if (!handler) return undefined;
    return (await handler(userId)) as T;
  }

  return { loadData };
};
