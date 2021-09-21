import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConstants } from './app.constants';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  describe('welcome', () => {
    it('welcome message should have been returned', () => {
      expect(controller.welcome()).toEqual(appConstants.apiDescription);
    });
  });
});
