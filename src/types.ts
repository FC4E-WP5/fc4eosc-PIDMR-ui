// Types for supported PIDS view
export type ApiResponse = {
  size: unknown;
  size_of_page: number;
  number_of_page: number;
  total_elements: number;
  total_pages: number;
  content: Provider[];
  links: ApiResponseLink[];
};

export type ProfileResponse = {
  id: string;
  roles: string[];
};

export type ApiResponseLink = {
  href: string;
  rel: string;
};

export type Provider = {
  id: number;
  type: string;
  name: string;
  description: string;
  relies_on_dois: boolean;
  resolution_modes: ResolutionMode[];
  regexes: string[];
  status?: string;
  examples: string[];
  user_id: string | null;
  validator: string | null;
  resource_path_in_metadata?: MetadataPath[];
  image_url_path?: string;
};

export type ResolutionMode = {
  name: string;
  mode: string;
  endpoints: Endpoint[];
};

export type Endpoint = {
  link: string;
  provider: string;
};

export type MetadataPath = {
  provider: string;
  path: string;
};

export type ProviderInput = {
  type: string;
  name: string;
  description: string;
  relies_on_dois: boolean;
  resolution_modes: ResolutionMode[];
  regexes: string[];
  examples: string[];
  resource_path_in_metadata?: MetadataPath[];
  image_base_64?: string;
  image_url_path?: string;
};

export type RoleChangeRequest = {
  id: number;
  user_id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  description: string;
  requested_on: string;
  updated_on: string;
  updated_by: string;
  status: string;
};

export interface UserList {
  id: string;
  roles: string[];
  name: string;
  surname: string;
  email: string;
}

export interface PaginationProps {
  isClientSide: boolean;
  currentPage: number;
  pageSize: number;
  data: ApiResponse | null;
  totalItems: number;
  totalPages: number;
  searchTerm: string;
}
