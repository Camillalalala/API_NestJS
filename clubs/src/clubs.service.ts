import { Injectable, NotFoundException } from '@nestjs/common';
import { Club, createClub, updateClub } from '../entity/app.entity';

@Injectable()
export class ClubsService {
  //Using in-memory array to simulate database but irl, actual DB is used and async would be necessary
  private clubs: Club[] = [
    { id: 1, name: 'ACM' },
    { id: 2, name: 'UCLA SWE' },
  ];
  async getClubs(): Promise<Club[]> {
    return await Promise.resolve(this.clubs);
  }

  async findOne(name: string): Promise<Club> {
    const club = this.clubs.find((c) => c.name === name);
    if (!club) {
      throw new NotFoundException(`Club with name "${name}" does not exist`);
    }
    return await Promise.resolve(club);
  }

  async create(createClub: createClub): Promise<Club> {
    const newClub = { ...createClub, id: this.clubs.length + 1 };
    this.clubs.push(newClub);
    return await Promise.resolve(newClub);
  }

  async update(id: number, update: updateClub): Promise<Club> {
    const index = this.clubs.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Club with id "${id}" does not exist`);
    }
    const existing = this.clubs[index];
    const updated: Club = { ...existing, ...update };
    this.clubs[index] = updated;
    return await Promise.resolve(updated);
  }
}
