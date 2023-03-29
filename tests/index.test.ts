import {expect, test} from '@jest/globals';
import {
  mean,
  randint,
  randfloat,
  zip,
  populate,
  fitness,
  select,
  breed,
  mutate,
  main,
  Weights,
} from '../src/index';

describe('mean tests', () => {
  test('mean of 1, 2, 3 is 2', () => {
    expect(mean([1, 2, 3])).toBe(2);
  });

  test('mean of -1,-2, -3 is -2', () => {
    expect(mean([-1, -2, -3])).toBe(-2);
  });
});

describe('radint tests', () => {
  test('returns a number between 1 and 10', () => {
    const result = randint(1, 10);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
  });

  test('returns the 1 if min and max are 1', () => {
    const result = randint(1, 1);
    expect(result).toBe(1);
  });

  test('returns an integer', () => {
    const result = randint(1, 10);
    expect(result).toBe(Math.floor(result));
  });
});

describe('randfloat tets', () => {
  test('returns a number between 1.5 and 10.5', () => {
    const result = randfloat(1.5, 10.5);
    expect(result).toBeGreaterThanOrEqual(1.5);
    expect(result).toBeLessThanOrEqual(10.5);
  });

  test('returns the 1 if min and max are 1', () => {
    const result = randfloat(1, 1);
    expect(result).toBe(1);
  });
});

describe('zip tests', () => {
  test('zips two arrays correctly', () => {
    const a = [1, 2, 3];
    const b = [4, 5, 6];
    expect(zip(a, b)).toEqual([
      [1, 4],
      [2, 5],
      [3, 6],
    ]);
  });
});

describe('populate tests', () => {
  test('returns an array with the correct length', () => {
    const numRats = 20;
    const result = populate(numRats, 1, 3, 2);
    expect(result).toHaveLength(numRats);
  });

  test('returns an array with the correct range', () => {
    const numRats = 20;
    const result = populate(numRats, 200, 600, 300);
    result.map(num => {
      expect(num).toBeGreaterThanOrEqual(200);
      expect(num).toBeLessThanOrEqual(600);
    });
  });
});

describe('fitness tests', () => {
  test('returns a value greater than 1 when the mean is greater than goal', () => {
    const population = [1, 2, 3, 4, 5];
    const goal = 2;
    const result = fitness(population, goal);
    expect(result).toBeGreaterThan(1);
  });

  test('returns a value less than 1 when the mean is less than goal', () => {
    const population = [1, 2, 3, 4, 5];
    const goal = 4;
    const result = fitness(population, goal);
    expect(result).toBeLessThan(1);
  });

  test('returns 1 when the mean equals goal', () => {
    const population = [1, 2, 3, 4, 5];
    const goal = 3;
    const result = fitness(population, goal);
    expect(result).toEqual(1);
  });
});

describe('select tests', () => {
  test('correctly selects members when given an even population', () => {
    const result = select([3, 10, 1, 6, 5, 7, 9, 8, 7, 2], 4);
    expect(result).toEqual([
      [9, 10],
      [5, 6],
    ]);
  });

  test('correctly selects members when given an odd population', () => {
    const result = select([3, 1, 5, 4, 2], 4);
    expect(result).toEqual([
      [4, 5],
      [1, 2],
    ]);
  });
});

describe('breed tests', () => {
  test('returns an array of numbers within the range of the parents', () => {
    const males = [1, 2, 3];
    const females = [4, 5, 6];
    const result = breed(males, females, 2);
    result.map(num => {
      expect(num).toBeGreaterThanOrEqual(Math.min(...males, ...females));
      expect(num).toBeLessThanOrEqual(Math.max(...males, ...females));
    });
  });
});

describe('mutate tests', () => {
  test('should only mutate values within the 0.5 and 1.2 range', () => {
    const children = [1, 2, 3, 4, 5];
    const result = mutate(children, 1, 0.5, 1.2);
    result.map(num => {
      expect(num).toBeGreaterThanOrEqual(Math.min(children[0] * 0.5));
      expect(num).toBeLessThanOrEqual(children[4] * 1.2);
    });
  });
});

describe('main tests', () => {
  test('should be between 250 and 450 gerations', () => {
    const weights: Weights = {
      num_rats: 20,
      GOAL: 50000,
      INITIAL_MIN_WT: 200,
      INITIAL_MAX_WT: 600,
      INITIAL_MODE_WT: 300,
      MUTATE_ODDS: 0.01,
      MUTATE_MIN: 0.5,
      MUTATE_MAX: 1.2,
      LITTER_SIZE: 8,
      LITTERS_PER_YEAR: 10,
      GENERATION_LIMIT: 500,
    };
    const results = main(weights);
    expect(results['number of generations']).toBeGreaterThanOrEqual(250);
    expect(results['number of generations']).toBeLessThanOrEqual(450);
  });
});
