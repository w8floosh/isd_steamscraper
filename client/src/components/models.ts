export interface IAppMetadata {
  id: string;
  name: string;
  lastUpdate: Date;
}

export interface IAppData {
  meta: IAppMetadata;
  details: any;
  news: any[];
  players: number;
  achievements: number;
}

export interface IBreadcrumbs {
  name: string;
  icon: string;
}

export interface IDrawerOption {
  title: string;
  icon: string;
  caption?: string;
  endpoint?: string;
}