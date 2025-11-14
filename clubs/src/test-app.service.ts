import { ClubsService } from './clubs.service';

async function test() {
  const service = new ClubsService();

  console.log('All clubs:', await service.getClubs());

  console.log('Find one club:', await service.findOne('UCLA SWE'));
  console.log('Find one invalid club:', await service.findOne('test club'));

  const newClub = await service.create({ name: 'ACM Jr' });
  console.log('Created club:', newClub);

  console.log('All clubs after creation:', await service.getClubs());
}

test().catch(console.error);
