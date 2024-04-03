import { UserGamesTab, UserTab } from './types';
import { useUserService } from './useUserService';
import { useStatsService } from './useStatsService';

const {
  getFriendsList,
  getOwnedGames,
  getPlayerAchievements,
  getRecentlyPlayed,
} = useUserService();

const { getFavoriteGenresAndCategories, getForgottenGames } = useStatsService();

export const useUserTabs = () => {
  const loaderMapping = new Map<
    UserTab | UserGamesTab,
    (userId: number, ...args: any[]) => Promise<any>
  >([
    ['allGames', getOwnedGames],
    ['recentGames', getRecentlyPlayed],
    ['forgottenGames', getForgottenGames],
    ['friends', getFriendsList],
    ['achievements', getPlayerAchievements],
    ['favorites', getFavoriteGenresAndCategories],
  ]);

  async function loadData<T = unknown>(
    tab: UserTab | UserGamesTab,
    userId: number,
    ...args: any[]
  ): Promise<T | undefined> {
    const handler = loaderMapping.get(tab);
    if (!handler) return undefined;
    if (args) return (await handler(userId, ...args)) as T;
    else return (await handler(userId)) as T;
  }

  return { loadData };
};
