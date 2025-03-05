/** Non-empty type. Subset of LinkedList. */
export interface NonEmpty<T> {
  value: T;
  tail: LinkedList<T>;
}

/** Linked list type. */
export type LinkedList<T> = NonEmpty<T>|null;

/** Whether a linked list is empty. */
export function isEmptyList(l: LinkedList<unknown>): l is null {
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
export function makeList<T>(array: T[]): LinkedList<T> {
  let prevTail: LinkedList<T> = null;
  while (array.length > 0) {
    // array.pop() is inferred as T|undefined, but we know it exists because
    // array.length is > 0.
    const value = array.pop() as T;
    const tail = prevTail;
    prevTail = {value, tail};
  }
  return prevTail;
}
