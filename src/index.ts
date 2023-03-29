// Use genetic algorithm to simulate breeding race of super rats.

import triangular = require('@stdlib/random-base-triangular');
import shuffle = require('lodash/shuffle');

let num_rats = 20; // number of adult breeding rats in each generation

// CONSTANTS (weights in grams)
const GOAL = 50000;
const INITIAL_MIN_WT = 200;
const INITIAL_MAX_WT = 600;
const INITIAL_MODE_WT = 300;
const MUTATE_ODDS = 0.01;
const MUTATE_MIN = 0.5;
const MUTATE_MAX = 1.2;
const LITTER_SIZE = 8;
const LITTERS_PER_YEAR = 10;
const GENERATION_LIMIT = 500;

type results = {
  'initial population weights': number[];
  'initial population fitness': number;
  'number to retain': number;
  'average weight per generation': number[];
  'number of generations': number;
  'number of years': number;
};

const mean = (arr: number[]): number => {
  return arr.reduce((a, b) => a + b) / arr.length;
};

const randint = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randfloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const zip = (a: any[], b: any[]): any[][] => {
  return a.map((e, i) => [e, b[i]]);
};

const populate = (
  numRats: number,
  min_wt: number,
  max_wt: number,
  mode_wt: number
): number[] => {
  return Array.from({length: numRats}, () =>
    triangular(min_wt, max_wt, mode_wt)
  );
};

const fitness = (population: number[], goal: number): number => {
  const ave = mean(population);
  return ave / goal;
};

const select = (
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

const breed = (
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

const mutate = (
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

const main = (): results => {
  if (num_rats % 2 !== 0) {
    num_rats += 1;
  }

  let generations = 0;
  let parents = populate(
    num_rats,
    INITIAL_MIN_WT,
    INITIAL_MAX_WT,
    INITIAL_MODE_WT
  );
  let popl_fitness = fitness(parents, GOAL);
  const ave_wt = [];

  let results = {
    'initial population weights': parents,
    'initial population fitness': popl_fitness,
    'number to retain': num_rats,
    'average weight per generation': [0],
    'number of generations': 0,
    'number of years': 0,
  };

  while (popl_fitness < 1 && generations < GENERATION_LIMIT) {
    let [selected_males, selected_females] = select(parents, num_rats);
    let children = breed(selected_males, selected_females, LITTER_SIZE);
    children = mutate(children, MUTATE_ODDS, MUTATE_MIN, MUTATE_MAX);
    parents = selected_males.concat(selected_females, children);
    popl_fitness = fitness(parents, GOAL);
    ave_wt.push(Math.floor(mean(parents)));
    generations += 1;

    console.log(
      `Generation ${generations} fitness = ${popl_fitness.toFixed(4)}`
    );
  }

  results['average weight per generation'] = ave_wt;
  results['number of generations'] = generations;
  results['number of years'] = Math.floor(generations / LITTERS_PER_YEAR);

  return results;
};

const startTime = Date.now();
const result = main();
const endTime = Date.now();
console.log(result);
console.log(
  `\nRuntime for this program was ${(endTime - startTime) / 1000} seconds`
);
