interface NonEmpty<T> {
  value: T;
  tail: LinkedList<T>;
}

export type LinkedList<T> = NonEmpty<T>|null;

/** Whether a linked list is empty. */
export function isEmptyList(l: LinkedList): l is null {
  return l === null;
}

/** Get current value. */
export function getHead<T>(l: NonEmpty<T>): T {
  return l.value;
}

/** Get tail list. */
export function getTail<T>(l: NonEmpty<T>): LinkedList<T> {
  return l.tail;
}

/** Make a linked list from an array. */
export function makeList<T>(a: T[]): LinkedList<T> {
  let l: LinkedList<T> = null;
  for (const v: T of a) {
    const prev = l;
    l = {
      value: v,
      tail: prev,
    };
  }
  return l;
}
