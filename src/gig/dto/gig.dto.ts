export interface GigDto {
  title: string;
  date: string;
  location: string;
  ticketsUrl: string;
}

export interface SubmitGigDto {
  gig: GigDto;
  isAdmin: boolean;
}

export interface GetGigsDto {
  page: number;
  size: number;
}
