// users/src/clubs-client.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { ClubsClientService } from './clubs-client.service';
import { Club } from '../entity/app.entity';

describe('ClubsClientService', () => {
  let service: ClubsClientService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ClubsClientService],
    }).compile();

    service = module.get<ClubsClientService>(ClubsClientService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('getClubByName', () => {
    it('should successfully get a club by name from Clubs Service', async () => {
      const club: Club = { id: 1, name: 'ACM' };
      const mockResponse = {
        data: club,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const getSpy = jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of(mockResponse as any));

      const result = await service.getClubByName('ACM');
      expect(result).toEqual(club);
      expect(getSpy).toHaveBeenCalledWith('http://localhost:3001/clubs/ACM');
    });

    it('should throw HttpException when club does not exist (404)', async () => {
      const error = {
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { message: 'Club not found' },
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => error));

      await expect(service.getClubByName('Nonexistent')).rejects.toThrow(
        HttpException,
      );
      await expect(service.getClubByName('Nonexistent')).rejects.toThrow(
        'Club with name "Nonexistent" does not exist',
      );
    });

    it('should throw HttpException when Clubs Service is unavailable', async () => {
      const error = {
        response: {
          status: 500,
          statusText: 'Internal Server Error',
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => error));

      await expect(service.getClubByName('ACM')).rejects.toThrow(HttpException);
      await expect(service.getClubByName('ACM')).rejects.toThrow(
        'Failed to communicate with Clubs Service',
      );
    });

    it('should handle network errors', async () => {
      const error = new Error('Network error');

      jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => error));

      await expect(service.getClubByName('ACM')).rejects.toThrow(HttpException);
      await expect(service.getClubByName('ACM')).rejects.toThrow(
        'Failed to communicate with Clubs Service',
      );
    });
  });

  describe('getClubById', () => {
    it('should successfully get a club by id from Clubs Service', async () => {
      const clubs: Club[] = [
        { id: 1, name: 'ACM' },
        { id: 2, name: 'UCLA SWE' },
      ];
      const mockResponse = {
        data: clubs,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      const getSpy = jest
        .spyOn(httpService, 'get')
        .mockReturnValue(of(mockResponse as any));

      const result = await service.getClubById(1);
      expect(result).toEqual(clubs[0]);
      expect(getSpy).toHaveBeenCalledWith('http://localhost:3001/clubs');
    });

    it('should throw HttpException when club with id does not exist', async () => {
      const clubs: Club[] = [
        { id: 1, name: 'ACM' },
        { id: 2, name: 'UCLA SWE' },
      ];
      const mockResponse = {
        data: clubs,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse as any));

      await expect(service.getClubById(999)).rejects.toThrow(HttpException);
      await expect(service.getClubById(999)).rejects.toThrow(
        'Club with id "999" does not exist',
      );
    });

    it('should throw HttpException when Clubs Service request fails', async () => {
      const error = {
        response: {
          status: 500,
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => error));

      await expect(service.getClubById(1)).rejects.toThrow(HttpException);
      await expect(service.getClubById(1)).rejects.toThrow(
        'Failed to communicate with Clubs Service',
      );
    });
  });
});
