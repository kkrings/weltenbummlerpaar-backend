export interface ApiTags {
  welcome: string;
  authentication: string;
  diaryEntries: string;
  searchTags: string;
  images: string;
}

export interface AppConstants {
  apiTitle: string;
  apiDescription: string;
  apiTags: ApiTags;
}

export const appConstants: AppConstants = {
  apiTitle: 'Weltenbummlerpaar REST API',
  apiDescription: 'REST API of the Weltenbummlerpaar travel diary application',
  apiTags: {
    welcome: 'Welcome',
    authentication: 'Authentication',
    diaryEntries: 'Diary entries',
    searchTags: 'Diary entry search tags',
    images: 'Diary entry images',
  },
};
