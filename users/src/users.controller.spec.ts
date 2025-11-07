// users/src/users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './app.controller';
import { UsersService } from './users.service';
import { User } from '../entity/app.entity';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
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
});

