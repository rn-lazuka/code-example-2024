import { combineFilters } from '@utils';

describe('common filters or utils for filtering', () => {
  it('should call each of filters passed to the combineFilters method and filter data by all filters', () => {
    const mockData = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
    const filter1 = jest.fn().mockImplementation((value) => value.id > 1);
    const filter2 = jest.fn().mockImplementation((value) => value.id < 3);
    const result = mockData.filter(combineFilters(filter1, filter2));

    expect(result.length).toEqual(1);
    expect(result[0]).toEqual({ id: 2 });
    expect(filter1).toHaveBeenCalled();
    expect(filter2).toHaveBeenCalled();
  });
});
