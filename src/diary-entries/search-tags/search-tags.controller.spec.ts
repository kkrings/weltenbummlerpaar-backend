import { Test, TestingModule } from '@nestjs/testing';
import { SearchTagsController } from './search-tags.controller';
import { SearchTagsService } from './search-tags.service';

describe('SearchTagsController', () => {
  const referenceSearchTags = ['some tag'];

  const mockService = {
    findMany: async () => await Promise.resolve(referenceSearchTags),
  };

  let controller: SearchTagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchTagsController],
      providers: [
        {
          provide: SearchTagsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SearchTagsController>(SearchTagsController);
  });

  describe('findSearchTags()', () => {
    const findSearchTagsSpy = jest.spyOn(mockService, 'findMany');

    let searchTags: string[];

    beforeEach(async () => {
      searchTags = await controller.findMany();
    });

    it('should return search tags', () => {
      expect(searchTags).toEqual(referenceSearchTags);
    });

    it('service should have been called', () => {
      expect(findSearchTagsSpy).toHaveBeenCalled();
    });
  });
});
