// users/src/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ClubsClientService } from './clubs-client.service';
import { Club } from '../entity/app.entity';

describe('UsersService', () => {
  let service: UsersService;
  let clubsClientService: ClubsClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: ClubsClientService,
          useValue: {
            getClubByName: jest.fn(),
            getClubById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    clubsClientService = module.get<ClubsClientService>(ClubsClientService);
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const result = await service.getUsers();
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Camilla');
      expect(result[1].name).toBe('Khang');
    });
  });

  describe('findOne', () => {
    it('should return a user by name', async () => {
      const user = await service.findOne('Camilla');
      expect(user.name).toBe('Camilla');
      expect(user.id).toBe(1);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      await expect(service.findOne('Nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneById', () => {
    it('should return a user by id', async () => {
      const user = await service.findOneById(1);
      expect(user.id).toBe(1);
      expect(user.name).toBe('Camilla');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      await expect(service.findOneById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = { name: 'Alice' };
      const createdUser = await service.create(newUser);
      expect(createdUser.name).toBe('Alice');
      expect(createdUser.id).toBe(3);
    });
  });

  describe('joinClub', () => {
    it('should successfully join a user to a club', async () => {
      const userId = 1;
      const clubName = 'ACM';
      const club: Club = { id: 1, name: 'ACM' };

      const getClubByNameSpy = jest
        .spyOn(clubsClientService, 'getClubByName')
        .mockResolvedValue(club);

      const membership = await service.joinClub(userId, clubName);

      expect(membership).toEqual({
        userId: 1,
        clubId: 1,
        clubName: 'ACM',
      });
      expect(getClubByNameSpy).toHaveBeenCalledWith(clubName);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = 999;
      const clubName = 'ACM';

      await expect(service.joinClub(userId, clubName)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.joinClub(userId, clubName)).rejects.toThrow(
        'User with id "999" does not exist',
      );
    });

    it('should throw HttpException if club does not exist', async () => {
      const userId = 1;
      const clubName = 'Nonexistent Club';

      jest
        .spyOn(clubsClientService, 'getClubByName')
        .mockRejectedValue(
          new NotFoundException(
            'Club with name "Nonexistent Club" does not exist',
          ),
        );

      await expect(service.joinClub(userId, clubName)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if user is already a member', async () => {
      const userId = 1;
      const clubName = 'ACM';
      const club: Club = { id: 1, name: 'ACM' };

      jest.spyOn(clubsClientService, 'getClubByName').mockResolvedValue(club);

      // First join should succeed
      await service.joinClub(userId, clubName);

      // Second join should fail
      await expect(service.joinClub(userId, clubName)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.joinClub(userId, clubName)).rejects.toThrow(
        'already a member',
      );
    });

    it('should allow user to join multiple different clubs', async () => {
      const userId = 1;
      const club1: Club = { id: 1, name: 'ACM' };
      const club2: Club = { id: 2, name: 'UCLA SWE' };

      jest
        .spyOn(clubsClientService, 'getClubByName')
        .mockResolvedValueOnce(club1)
        .mockResolvedValueOnce(club2);

      const membership1 = await service.joinClub(userId, 'ACM');
      const membership2 = await service.joinClub(userId, 'UCLA SWE');

      expect(membership1.clubName).toBe('ACM');
      expect(membership2.clubName).toBe('UCLA SWE');
    });
  });

  describe('getUserClubs', () => {
    it('should return all clubs a user has joined', async () => {
      const userId = 1;
      const club: Club = { id: 1, name: 'ACM' };

      jest.spyOn(clubsClientService, 'getClubByName').mockResolvedValue(club);

      // Join a club first
      await service.joinClub(userId, 'ACM');

      const memberships = await service.getUserClubs(userId);
      expect(memberships).toHaveLength(1);
      expect(memberships[0].clubName).toBe('ACM');
    });

    it('should return empty array if user has no clubs', async () => {
      const userId = 1;
      const memberships = await service.getUserClubs(userId);
      expect(memberships).toEqual([]);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = 999;

      await expect(service.getUserClubs(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
