// Use genetic algorithm to simulate breeding race of super rats.

import triangular = require('@stdlib/random-base-triangular');
import shuffle = require('lodash/shuffle');

// weights in grams
export interface Weights {
  num_rats: number; // number of adult breeding rats in each generation
  readonly GOAL: number;
  readonly INITIAL_MIN_WT: number;
  readonly INITIAL_MAX_WT: number;
  readonly INITIAL_MODE_WT: number;
  readonly MUTATE_ODDS: number;
  readonly MUTATE_MIN: number;
  readonly MUTATE_MAX: number;
  readonly LITTER_SIZE: number;
  readonly LITTERS_PER_YEAR: number;
  readonly GENERATION_LIMIT: number;
}

export interface Results {
  'initial population weights': number[];
  'initial population fitness': number;
  'number to retain': number;
  'average weight per generation': number[];
  'number of generations': number;
  'number of years': number;
}

export const mean = (arr: number[]): number => {
  return arr.reduce((a, b) => a + b) / arr.length;
};

export const randint = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const randfloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const zip = (a: number[], b: number[]): number[][] => {
  return a.map((e, i) => [e, b[i]]);
};

export const populate = (
  numRats: number,
  min_wt: number,
  max_wt: number,
  mode_wt: number
): number[] => {
  return Array.from({length: numRats}, () =>
    triangular(min_wt, max_wt, mode_wt)
  );
};

export const fitness = (population: number[], goal: number): number => {
  const ave = mean(population);
  return ave / goal;
};

export const select = (
  population: number[],
  to_retain: number
): [number[], number[]] => {
  const sorted_population = population.sort((a, b) => a - b);
  const to_retain_by_sex = Math.floor(to_retain / 2);
  const members_per_sex = Math.floor(sorted_population.length / 2);
  const females = sorted_population.slice(0, members_per_sex);
  const males = sorted_population.slice(members_per_sex);
  const selected_females = females.slice(-to_retain_by_sex);
  const selected_males = males.slice(-to_retain_by_sex);
  return [selected_males, selected_females];
};

export const breed = (
  males: number[],
  females: number[],
  litter_size: number
): number[] => {
  const shuffledMales = shuffle(males);
  const shuffledFemales = shuffle(females);
  const zipped = zip(shuffledMales, shuffledFemales);
  const bred = zipped.flatMap(([male, female]) =>
    Array.from({length: litter_size}, () => randint(female, male))
  );
  return bred;
};

export const mutate = (
  children: number[],
  mutate_odds: number,
  mutate_min: number,
  mutate_max: number
): number[] => {
  const childs = children.map(rat =>
    mutate_odds >= Math.random()
      ? Math.round(rat * randfloat(mutate_min, mutate_max))
      : rat
  );
  return childs;
};

export const main = (weights: Weights): Results => {
  if (weights.num_rats % 2 !== 0) {
    weights.num_rats += 1;
  }

  let generations = 0;
  let parents = populate(
    weights.num_rats,
    weights.INITIAL_MIN_WT,
    weights.INITIAL_MAX_WT,
    weights.INITIAL_MODE_WT
  );
  let popl_fitness = fitness(parents, weights.GOAL);
  const ave_wt = [];

  const results = {
    'initial population weights': parents,
    'initial population fitness': popl_fitness,
    'number to retain': weights.num_rats,
    'average weight per generation': [0],
    'number of generations': 0,
    'number of years': 0,
  };

  while (popl_fitness < 1 && generations < weights.GENERATION_LIMIT) {
    const [selected_males, selected_females] = select(
      parents,
      weights.num_rats
    );
    let children = breed(selected_males, selected_females, weights.LITTER_SIZE);
    children = mutate(
      children,
      weights.MUTATE_ODDS,
      weights.MUTATE_MIN,
      weights.MUTATE_MAX
    );
    parents = selected_males.concat(selected_females, children);
    popl_fitness = fitness(parents, weights.GOAL);
    ave_wt.push(Math.floor(mean(parents)));
    generations += 1;

    console.log(
      `Generation ${generations} fitness = ${popl_fitness.toFixed(4)}`
    );
  }

  results['average weight per generation'] = ave_wt;
  results['number of generations'] = generations;
  results['number of years'] = Math.floor(
    generations / weights.LITTERS_PER_YEAR
  );

  return results;
};

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

const startTime = Date.now();
const result = main(weights);
const endTime = Date.now();

console.log(result);
console.log(
  `\nRuntime for this program was ${(endTime - startTime) / 1000} seconds`
);
