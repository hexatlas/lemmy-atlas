// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import {
  SortType,
  ListingType,
  SearchType,
  CommunityId,
} from 'lemmy-js-client';

/*
  LEMMY
*/

export interface LemmyInstance {
  id: number;
  label: React.ReactNode;
  baseUrl: string;
  community_id: CommunityId;
  default?: boolean;
}

export const lemmyInstances: Array<LemmyInstance> = [
  {
    id: 0,
    label: 'hexbear.net',
    baseUrl: 'https://hexbear.net/',
    community_id: 6, // !news@hexbear.net
    default: true,
  },
  {
    id: 1,
    label: 'lemmy.ml',
    baseUrl: 'https://lemmy.ml/',
    community_id: 14788, // !worldnews@lemmy.ml
    default: false,
  },
  {
    id: 2,
    label: 'lemmygrad.ml',
    baseUrl: 'https://lemmygrad.ml/',
    community_id: 109, // !worldnews@lemmygrad.ml
    default: false,
  },
];

export const searchTypes: Array<{ value: SearchType; label: string }> = [
  // { value: "All", label: "*" },
  { value: 'Comments', label: '💬' },
  { value: 'Posts', label: '🪧' },
  // { value: "Communities", label: "☭" },
  // { value: "Users", label: "👥" },
  // { value: "Url", label: "🌐" },
];

export const listingTypes: Array<{ value: ListingType; label: string }> = [
  { value: 'All', label: '🌐' },
  { value: 'Local', label: '🏠' },
  // { value: "Subscribed", label: "📌" },
];

export const sortTypes: Array<{ value: SortType; label: string }> = [
  { value: 'Active', label: '🚀' },
  { value: 'New', label: '🆕' },
  { value: 'Hot', label: '🔥' },
  { value: 'Controversial', label: '⚔️' },
  { value: 'TopDay', label: '🔝D' },
  { value: 'TopWeek', label: '🔝W' },
  { value: 'TopMonth', label: '🔝M' },
  { value: 'TopYear', label: '🔝Y' },
  { value: 'TopAll', label: '🔝A' },
  { value: 'MostComments', label: '💬🔝' },
  { value: 'NewComments', label: '💬🆕' },
  { value: 'TopHour', label: '🔝🕐1' },
  { value: 'TopSixHour', label: '🔝🕕6' },
  { value: 'TopTwelveHour', label: '🔝🕛12' },
  { value: 'TopThreeMonths', label: '🔝3M' },
  { value: 'TopSixMonths', label: '🔝6M' },
  { value: 'TopNineMonths', label: '🔝9M' },
  { value: 'Old', label: '🕰️' },
  { value: 'Scaled', label: '⚖️' },
];

// ToDo: Implement DataSources

export interface DataSource {
  id: number;
  label: React.ReactNode;
  baseUrl: string;
  default?: boolean;
}

export const dataSources: Array<DataSource> = [
  {
    id: 0,
    label: 'imf.org',
    baseUrl: 'https://www.imf.org/external/datamapper/api/v1/',
    default: true,
  },
  {
    id: 1,
    label: 'ilostat.ilo.org',
    baseUrl: 'https://ilostat.ilo.org/resources/sdmx-tools/',
    default: false,
  },
  {
    id: 2,
    label: 'wto.org',
    baseUrl: 'https://apiportal.wto.org/apis/',
    default: false,
  },
  {
    id: 3,
    label: 'comtradeplus.un.org',
    baseUrl: 'https://comtradeplus.un.org/',
    default: false,
  },
];
