// https://github.com/LemmyNet/lemmy-js-client
// https://join-lemmy.org/api/classes/LemmyHttp.html
import {
  SortType,
  ListingType,
  SearchType,
  CommunityId,
  CommentSortType,
} from 'lemmy-js-client';

/*
  LEMMY
*/

export interface AtlasLemmyInstanceType {
  id: number;
  label: React.ReactNode;
  baseUrl: string;
  community_id: CommunityId;
  default?: boolean;
}

export interface AtlasLemmySearchType {
  value: SearchType;
  label: string;
}

export const searchTypes: Array<AtlasLemmySearchType> = [
  // { value: "All", label: "*" },
  { value: 'Comments', label: '💬' },
  { value: 'Posts', label: '🪧' },
  // { value: "Communities", label: "☭" },
  // { value: "Users", label: "👥" },
  // { value: "Url", label: "🌐" },
];

export interface AtlasLemmyListingType {
  value: ListingType;
  label: string;
}

export const listingTypes: Array<AtlasLemmyListingType> = [
  { value: 'All', label: '🌐' },
  { value: 'Local', label: '🏠' },
  // { value: "Subscribed", label: "📌" },
];

export interface AtlasLemmySortType {
  value: SortType;
  label: string;
}

export const sortTypes: Array<AtlasLemmySortType> = [
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

export interface AtlasLemmyCommentSortType {
  value: CommentSortType;
  label: string;
}

export const commentSortTypes: Array<AtlasLemmyCommentSortType> = [
  { value: 'New', label: '🆕' },
  { value: 'Hot', label: '🔥' },
  { value: 'Controversial', label: '⚔️' },
  { value: 'Old', label: '🕰️' },
  { value: 'Top', label: '🔝W' },
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

/*
  IMF
*/

export interface IMFIndicatorType {
  name: string;
  label: string;
  description: string;
  source: string;
  unit: string;
  dataset: string;
}
