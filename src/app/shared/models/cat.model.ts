export interface CatInfo {
  name: string;
  age: string;
  description: string;
}

export interface CatApiResponse {
  id: string;
  info: CatInfo;
  imageUrl?: string;
}

export interface CatApiListResponse {
  data: CatApiResponse[];
}

export interface Cat {
  id: string;
  name: string;
  age: string;
  description: string;
  imageUrl?: string;
}

export interface CreateCatRequest {
  name: string;
  age: string;
  description: string;
}
