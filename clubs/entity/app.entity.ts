// clubs/src/entity/app.entity.ts

export interface Club {
  id: number;
  name: string;
}

export interface createClub {
  name: string;
}

export interface updateClub {
  name?: string;
}
