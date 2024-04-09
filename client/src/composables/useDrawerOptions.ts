import { IDrawerOption } from 'src/components/models';

export const useDrawerOptions = () => {
  const publicDrawerOptions: IDrawerOption[] = [
    {
      title: 'Homepage',
      icon: 'home',
      endpoint: '/',
    },
  ];

  const restrictedDrawerOptions: IDrawerOption[] = [
    {
      title: 'Stats',
      caption: 'See your personal stats',
      icon: 'query_stats',
      endpoint: '/me',
    },
    {
      title: 'App data',
      caption: 'Get all details and news about a game/app',
      icon: 'sports_esports',
      endpoint: '/apps',
    },
    {
      title: 'Friends',
      caption: 'Show your friend list',
      icon: 'group',
      endpoint: '/friends',
    },
    {
      title: 'Leaderboards',
      caption: 'Who is the best among you and your friends?',
      icon: 'leaderboard',
      endpoint: '/leaderboards',
    },
  ];

  return {
    publicOptions: publicDrawerOptions,
    restrictedOptions: restrictedDrawerOptions,
  };
};

export default useDrawerOptions;
