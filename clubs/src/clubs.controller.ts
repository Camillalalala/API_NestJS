// clubs/src/clubs.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { MembersService } from './members/members.service';
import type { createClub, updateClub } from '../entity/app.entity';

@Controller('clubs')
export class ClubsController {
  //Dependency Injection: automatically creates instance of AppService and injects it into app
  constructor(
    private readonly clubsService: ClubsService,
    private readonly membersService: MembersService,
  ) {}

  @Get()
  async getClubs() {
    const clubs = await this.clubsService.getClubs();
    return clubs;
  }
  @Get(':name')
  async findOne(@Param('name') name: string) {
    const single = await this.clubsService.findOne(name);
    return single;
  }

  @Post()
  async create(@Body() createClub: createClub) {
    return await this.clubsService.create(createClub);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateClub: updateClub) {
    // convert id to number and delegate to service
    return this.clubsService.update(Number(id), updateClub);
  }

  @Delete('event-reference/:eventId')
  async removeEventReference(
    @Param('eventId', ParseIntPipe) eventId: number,
  ): Promise<{ removed: boolean; eventId: number }> {
    const result: { removed: boolean; eventId: number } =
      await this.clubsService.removeEventReference(eventId);
    return { removed: result.removed, eventId: result.eventId };
  }

  @Post(':clubId/events')
  async createEventForClub(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() body: { title: string },
  ): Promise<{ id: number; clubId: number; title: string }> {
    return this.clubsService.createEventForClub(clubId, { title: body.title });
  }

  @Get('roles/:clubId/:userId')
  getUserRole(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): { clubId: number; userId: number; role: string } {
    return this.clubsService.getUserRole(clubId, userId);
  }
}
