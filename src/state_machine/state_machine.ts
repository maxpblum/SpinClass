import {x} from './state_machine_dep.js';

function logWord(word: string) {
  console.log(word);
}

logWord(x as unknown as string);
