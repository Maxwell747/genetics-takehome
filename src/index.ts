// Use genetic algorithm to simulate breeding race of super rats.

import triangular = require('@stdlib/random-base-triangular');

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

const population = (
  numRats: number,
  min_wt: number,
  max_wt: number,
  mode_wt: number
): number[] => {
  return [];
};

const fitness = (population: number, goal: number): number => {
  return 0;
};

const select = (population: number, to_retain: number): number[] => {
  return [];
};

const breed = (
  males: number[],
  females: number[],
  litter_size: number
): number[] => {
  return [];
};

const mutate = (
  children: number[],
  mutate_odd: number,
  mutate_min: number,
  mutate_max: number
): number[] => {
  return [];
};

const main = () => {
  if (num_rats % 2 !== 0) {
    num_rats += 1;
  }
};

const startTime = Date.now();
main();
const endTime = Date.now();
console.log(`\nRuntime for this program was ${endTime - startTime}`);
