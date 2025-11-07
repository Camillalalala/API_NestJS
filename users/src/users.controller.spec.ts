// users/src/users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from './app.controller';
import { UsersService } from './users.service';
import { ClubsClientService } from './clubs-client.service';
import { User, Membership } from '../entity/app.entity';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [UsersController],
      providers: [UsersService, ClubsClientService],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const result: User[] = [
        { id: 1, name: 'Camilla' },
        { id: 2, name: 'Khang' },
      ];
      jest.spyOn(usersService, 'getUsers').mockResolvedValue(result);

      expect(await usersController.getUsers()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const user: User = { id: 1, name: 'Camilla' };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      expect(await usersController.findOne('Camilla')).toEqual(user);
    });

    it('should throw if user does not exist', async () => {
      jest.spyOn(usersService, 'findOne').mockImplementation(() => {
        throw new Error('User Nonexistent does not exist');
      });

      await expect(usersController.findOne('Nonexistent')).rejects.toThrow(
        'User Nonexistent does not exist',
      );
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const newUser = { name: 'Alice' };
      const createdUser: User = { id: 3, name: 'Alice' };

      jest.spyOn(usersService, 'create').mockResolvedValue(createdUser);

      expect(await usersController.create(newUser)).toEqual(createdUser);
    });
  });

  describe('joinClub', () => {
    it('should allow a user to join a club', async () => {
      const userId = 1;
      const clubName = 'ACM';
      const membership: Membership = {
        userId: 1,
        clubId: 1,
        clubName: 'ACM',
      };

      const joinClubSpy = jest
        .spyOn(usersService, 'joinClub')
        .mockResolvedValue(membership);

      const result = await usersController.joinClub(userId, { clubName });
      expect(result).toEqual(membership);
      expect(joinClubSpy).toHaveBeenCalledWith(userId, clubName);
    });

    it('should throw if user does not exist', async () => {
      const userId = 999;
      const clubName = 'ACM';

      jest
        .spyOn(usersService, 'joinClub')
        .mockRejectedValue(new Error('User with id "999" does not exist'));

      await expect(
        usersController.joinClub(userId, { clubName }),
      ).rejects.toThrow('User with id "999" does not exist');
    });

    it('should throw if club does not exist', async () => {
      const userId = 1;
      const clubName = 'Nonexistent Club';

      jest
        .spyOn(usersService, 'joinClub')
        .mockRejectedValue(
          new Error('Club with name "Nonexistent Club" does not exist'),
        );

      await expect(
        usersController.joinClub(userId, { clubName }),
      ).rejects.toThrow('Club with name "Nonexistent Club" does not exist');
    });
  });

  describe('getUserClubs', () => {
    it('should return all clubs a user has joined', async () => {
      const userId = 1;
      const memberships: Membership[] = [
        { userId: 1, clubId: 1, clubName: 'ACM' },
        { userId: 1, clubId: 2, clubName: 'UCLA SWE' },
      ];

      const getUserClubsSpy = jest
        .spyOn(usersService, 'getUserClubs')
        .mockResolvedValue(memberships);

      const result = await usersController.getUserClubs(userId);
      expect(result).toEqual(memberships);
      expect(getUserClubsSpy).toHaveBeenCalledWith(userId);
    });

    it('should return empty array if user has no clubs', async () => {
      const userId = 2;
      const memberships: Membership[] = [];

      jest.spyOn(usersService, 'getUserClubs').mockResolvedValue(memberships);

      const result = await usersController.getUserClubs(userId);
      expect(result).toEqual([]);
    });

    it('should throw if user does not exist', async () => {
      const userId = 999;

      jest
        .spyOn(usersService, 'getUserClubs')
        .mockRejectedValue(new Error('User with id "999" does not exist'));

      await expect(usersController.getUserClubs(userId)).rejects.toThrow(
        'User with id "999" does not exist',
      );
    });
  });
});
