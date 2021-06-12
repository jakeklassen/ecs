/**
 * Rewrite of https://github.com/mattkrick/fast-bitset/blob/master/app/BitSet.js
 */
// Matt Krick, matt.krick@gmail.com, MIT License

// each bin holds bits 0 - 30, totaling 31 (sign takes up last bit)
export const BITS_PER_INT = 31;

// used for ffs of a word in O(1) time. LUTs get a bad wrap, they are fast.
export const multiplyDeBruijnBitPosition = [
  0, 1, 28, 2, 29, 14, 24, 3, 30, 22, 20, 15, 25, 17, 4, 8, 31, 27, 13, 23, 21,
  19, 16, 7, 26, 12, 18, 6, 11, 5, 10, 9,
];

export class BitSet {
  private readonly arr: Uint32Array;
  private readonly MAX_BIT: number = 0;

  /**
   * Create a new bitset. Accepts either the maximum number of bits, or a dehydrated bitset
   * @param {number|string} nBitsOrKey - Number of bits in the set or dehydrated bitset.
   * For speed and space concerns, the initial number of bits cannot be increased.
   * @constructor
   */
  constructor(nBitsOrKey: number | string) {
    let wordCount;
    let arrVals;
    let front;
    let leadingZeros;
    let i;

    if (typeof nBitsOrKey === 'number') {
      nBitsOrKey = nBitsOrKey || BITS_PER_INT; // default to 1 word
      wordCount = Math.ceil(nBitsOrKey / BITS_PER_INT);
      this.arr = new Uint32Array(wordCount);
      this.MAX_BIT = nBitsOrKey - 1;
    } else {
      arrVals = JSON.parse('[' + nBitsOrKey + ']');
      this.MAX_BIT = arrVals.pop();
      leadingZeros = arrVals.pop();

      if (leadingZeros > 0) {
        front = [];
        for (i = 0; i < leadingZeros; i++) {
          front[i] = 0;
        }

        for (i = 0; i < arrVals.length; i++) {
          front[leadingZeros + i] = arrVals[i];
        }
        arrVals = front;
      }

      wordCount = Math.ceil((this.MAX_BIT + 1) / BITS_PER_INT);

      this.arr = new Uint32Array(wordCount);
      this.arr.set(arrVals);
    }
  }

  /**
   * Check whether a bit at a specific index is set
   * @param {number} idx the position of a single bit to check
   * @returns {boolean} true if bit is set, else false
   */
  public get(idx: number): boolean {
    const word = this.getWord(idx);

    return word === -1
      ? false
      : ((this.arr[word] >> idx % BITS_PER_INT) & 1) === 1;
  }

  /**
   * Set a single bit
   * @param {number} idx the position of a single bit to set
   * @returns {boolean} true if set was successful, else false
   */
  public set(idx: number): boolean {
    const word = this.getWord(idx);

    if (word === -1) {
      return false;
    }

    this.arr[word] |= 1 << idx % BITS_PER_INT;

    return true;
  }

  /**
   * Set a range of bits
   * @param {number} from the starting index of the range to set
   * @param {number} to the ending index of the range to set
   * @returns {boolean} true if set was successful, else false
   */
  public setRange(from: number, to: number): boolean {
    return this.doRange(from, to, setFunc);
  }

  /**
   * Unset a single bit
   * @param {number} idx the position of a single bit to unset
   * @returns {boolean} true if set was successful, else false
   */
  public unset(idx: number): boolean {
    const word = this.getWord(idx);

    if (word === -1) {
      return false;
    }

    this.arr[word] &= ~(1 << idx % BITS_PER_INT);

    return true;
  }

  /**
   * Toggle a single bit
   * @param {number} idx the position of a single bit to toggle
   * @returns {boolean} true if set was successful, else false
   */
  public toggle(idx: number): boolean {
    const word = this.getWord(idx);

    if (word === -1) {
      return false;
    }

    this.arr[word] ^= 1 << idx % BITS_PER_INT;

    return true;
  }

  /**
   * Toggle a range of bits
   * @param {number} from the starting index of the range to toggle
   * @param {number} to the ending index of the range to toggle
   * @returns {boolean} true if set was successful, else false
   */
  public toggleRange(from: number, to: number): boolean {
    return this.doRange(from, to, toggleFunc);
  }

  /**
   *
   * Clear an entire bitset
   * @returns {boolean} true
   */
  public clear(): boolean {
    for (let i = 0; i < this.arr.length; i++) {
      this.arr[i] = 0;
    }

    return true;
  }

  /**
   * Clone a bitset
   * @returns {BitSet} an copy (by value) of the calling bitset
   */
  public clone(): BitSet {
    return new BitSet(this.dehydrate());
  }

  /**
   *
   * Turn the bitset into a comma separated string that skips leading & trailing 0 words.
   * Ends with the number of leading 0s and MAX_BIT.
   * Useful if you need the bitset to be an object key (eg dynamic programming).
   * Can rehydrate by passing the result into the constructor
   * @returns {string} representation of the bitset
   */
  public dehydrate(): string {
    let i;
    let lastUsedWord = 0;
    let s;
    let leadingZeros = 0;

    for (i = 0; i < this.arr.length; i++) {
      if (this.arr[i] !== 0) {
        break;
      }

      leadingZeros++;
    }

    for (i = this.arr.length - 1; i >= leadingZeros; i--) {
      if (this.arr[i] !== 0) {
        lastUsedWord = i;
        break;
      }
    }

    s = '';

    for (i = leadingZeros; i <= lastUsedWord; i++) {
      s += this.arr[i] + ',';
    }

    s += leadingZeros + ',' + this.MAX_BIT; // leading 0s, stop numbers

    return s;
  }

  /**
   *
   * Perform a bitwise AND on 2 bitsets or 1 bitset and 1 index.
   * Both bitsets must have the same number of words, no length check is performed to prevent and overflow.
   * @param {BitSet | Number} bsOrIdx a bitset or single index to check (useful for LP, DP problems)
   * @returns {BitSet} a new bitset that is the bitwise AND of the two
   */
  public and(bsOrIdx: BitSet | number): BitSet {
    return this.op(bsOrIdx, and);
  }

  /**
   *
   * Perform a bitwise OR on 2 bitsets or 1 bitset and 1 index.
   * Both bitsets must have the same number of words, no length check is performed to prevent and overflow.
   * @param {BitSet | Number} bsOrIdx a bitset or single index to check (useful for LP, DP problems)
   * @returns {BitSet} a new bitset that is the bitwise OR of the two
   */
  public or(bsOrIdx: BitSet | number): BitSet {
    return this.op(bsOrIdx, or);
  }

  /**
   *
   * Perform a bitwise XOR on 2 bitsets or 1 bitset and 1 index.
   * Both bitsets must have the same number of words, no length check is performed to prevent and overflow.
   * @param {BitSet | Number} bsOrIdx a bitset or single index to check (useful for LP, DP problems)
   * @returns {BitSet} a new bitset that is the bitwise XOR of the two
   */
  public xor(bsOrIdx: BitSet | number): BitSet {
    return this.op(bsOrIdx, xor);
  }

  /**
   * Run a custom function on every set bit. Faster than iterating over the entire bitset with a `get()`
   * Source code includes a nice pattern to follow if you need to break the for-loop early
   * @param {Function} func the function to pass the next set bit to
   */
  // tslint:disable-next-line: ban-types
  public forEach(func: (n: number) => void): void {
    for (let i = this.ffs(); i !== -1; i = this.nextSetBit(i + 1)) {
      func(i);
    }
  }

  /**
   * Circular shift bitset by an offset
   * @param {Number} number of positions that the bitset that will be shifted to the right.
   * Using a negative number will result in a left shift.
   * @returns {Bitset} a new bitset that is rotated by the offset
   */

  public circularShift(offset: number): BitSet {
    offset = -offset;

    // TODO: Investigate fixing this
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const S = this; // source BitSet (this)
    const MASK_SIGN = 0x7fffffff;
    const BITS = S.MAX_BIT + 1;
    const WORDS = S.arr.length;
    const BITS_LAST_WORD = BITS_PER_INT - (WORDS * BITS_PER_INT - BITS);

    const T = new BitSet(BITS); // target BitSet (the shifted bitset)

    let t = 0; // (s)ource and (t)arget word indices
    let j = 0; // current bit indices for source (i) and target (j) words
    let z = 0; // bit index for entire sequence.

    offset = (BITS + (offset % BITS)) % BITS; // positive, within length
    let s = ~~(offset / BITS_PER_INT) % WORDS;
    let i = offset % BITS_PER_INT;

    while (z < BITS) {
      const sourceWordLength = s === WORDS - 1 ? BITS_LAST_WORD : BITS_PER_INT;
      let bits = S.arr[s];

      if (i > 0) {
        bits = bits >>> i;
      }

      if (j > 0) {
        bits = bits << j;
      }

      T.arr[t] = T.arr[t] | bits;

      const bitsAdded = Math.min(BITS_PER_INT - j, sourceWordLength - i);
      z += bitsAdded;
      j += bitsAdded;

      if (j >= BITS_PER_INT) {
        T.arr[t] = T.arr[t] & MASK_SIGN;
        j = 0;
        t++;
      }

      i += bitsAdded;

      if (i >= sourceWordLength) {
        i = 0;
        s++;
      }

      if (s >= WORDS) {
        s -= WORDS;
      }
    }

    T.arr[WORDS - 1] =
      T.arr[WORDS - 1] & (MASK_SIGN >>> (BITS_PER_INT - BITS_LAST_WORD));

    return T;
  }

  /**
   * Get the cardinality (count of set bits) for the entire bitset
   * @returns {number} cardinality
   */
  public getCardinality(): number {
    let setCount = 0;

    for (let i = this.arr.length - 1; i >= 0; i--) {
      let j = this.arr[i];
      j = j - ((j >> 1) & 0x55555555);
      j = (j & 0x33333333) + ((j >> 2) & 0x33333333);
      setCount += (((j + (j >> 4)) & 0x0f0f0f0f) * 0x01010101) >> 24;
    }

    return setCount;
  }

  /**
   * Get the indices of all set bits. Useful for debugging, uses `forEach` internally
   * @returns {Array} Indices of all set bits
   */
  public getIndices(): number[] {
    const indices: number[] = [];

    this.forEach((i: number) => {
      indices.push(i);
    });

    return indices;
  }

  /**
   * Checks if one bitset is subset of another. Same thing can be done using _and_ operation and equality check,
   * but then new BitSet would be created, and if one is only interested in yes/no information it would be a waste
   * of memory and additional GC strain.
   * @param {BitSet} bs a bitset to check
   * @returns {Boolean} `true` if provided bitset is a subset of this bitset, `false` otherwise
   */
  public isSubsetOf(bs: BitSet): boolean {
    const arr1 = this.arr;
    const arr2 = bs.arr;
    const len = arr1.length;

    for (let i = 0; i < len; i++) {
      if ((arr1[i] & arr2[i]) !== arr1[i]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Quickly determine if a bitset is empty
   * @returns {boolean} true if the entire bitset is empty, else false
   */
  public isEmpty(): boolean {
    let i;

    const arr = this.arr;

    for (i = 0; i < arr.length; i++) {
      if (arr[i]) {
        return false;
      }
    }

    return true;
  }

  /**
   *
   * Quickly determine if both bitsets are equal (faster than checking if the XOR of the two is === 0).
   * Both bitsets must have the same number of words, no length check is performed to prevent and overflow.
   * @param {BitSet} bs
   * @returns {boolean} true if the entire bitset is empty, else false
   */
  public isEqual(bs: BitSet): boolean {
    let i;

    for (i = 0; i < this.arr.length; i++) {
      if (this.arr[i] !== bs.arr[i]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get a string representation of the entire bitset, including leading 0s (useful for debugging)
   * @returns {string} a base 2 representation of the entire bitset
   */
  public toString(): string {
    let i;
    let str;
    let fullString = '';

    for (i = this.arr.length - 1; i >= 0; i--) {
      str = this.arr[i].toString(2);
      fullString += ('0000000000000000000000000000000' + str).slice(
        -BITS_PER_INT,
      );
    }

    return fullString;
  }

  /**
   * Find first set bit (useful for processing queues, breadth-first tree searches, etc.)
   * @param {number} startWord the word to start with (only used internally by nextSetBit)
   * @returns {number} the index of the first set bit in the bitset, or -1 if not found
   */
  public ffs(startWord = 0): number {
    let setVal;
    let i;
    let fs = -1;

    for (i = startWord; i < this.arr.length; i++) {
      setVal = this.arr[i];

      if (setVal === 0) {
        continue;
      }

      fs = lsb(setVal) + i * BITS_PER_INT;

      break;
    }

    return fs <= this.MAX_BIT ? fs : -1;
  }

  /**
   * Find first zero (unset bit)
   * @param {number} startWord the word to start with (only used internally by nextUnsetBit)
   * @returns {number} the index of the first unset bit in the bitset, or -1 if not found
   */
  public ffz(startWord: number): number {
    let i;
    let setVal;
    let fz = -1;

    startWord = startWord || 0;

    for (i = startWord; i < this.arr.length; i++) {
      setVal = this.arr[i];
      if (setVal === 0x7fffffff) {
        continue;
      }

      setVal ^= 0x7fffffff;
      fz = lsb(setVal) + i * BITS_PER_INT;

      break;
    }

    return fz <= this.MAX_BIT ? fz : -1;
  }

  /**
   *
   * Find last set bit
   * @param {number} startWord the word to start with (only used internally by previousSetBit)
   * @returns {number} the index of the last set bit in the bitset, or -1 if not found
   */
  public fls(startWord: number = this.arr.length - 1): number {
    let i;
    let setVal;
    let ls = -1;

    for (i = startWord; i >= 0; i--) {
      setVal = this.arr[i];

      if (setVal === 0) {
        continue;
      }

      ls = msb(setVal) + i * BITS_PER_INT;

      break;
    }

    return ls;
  }

  /**
   *
   * Find last zero (unset bit)
   * @param {number} startWord the word to start with (only used internally by previousUnsetBit)
   * @returns {number} the index of the last unset bit in the bitset, or -1 if not found
   */
  public flz(startWord: number): number {
    let i;
    let setVal;
    let ls = -1;

    if (startWord === undefined) {
      startWord = this.arr.length - 1;
    }

    for (i = startWord; i >= 0; i--) {
      setVal = this.arr[i];

      if (i === this.arr.length - 1) {
        const wordIdx = this.MAX_BIT % BITS_PER_INT;
        const unusedBitCount = BITS_PER_INT - wordIdx - 1;
        setVal |= ((1 << unusedBitCount) - 1) << (wordIdx + 1);
      }

      if (setVal === 0x7fffffff) {
        continue;
      }

      setVal ^= 0x7fffffff;
      ls = msb(setVal) + i * BITS_PER_INT;

      break;
    }

    return ls;
  }

  /**
   * Find first set bit, starting at a given index
   * @param {number} idx the starting index for the next set bit
   * @returns {number} the index of the next set bit >= idx, or -1 if not found
   */
  public nextSetBit(idx: number): number {
    const startWord = this.getWord(idx);

    if (startWord === -1) {
      return -1;
    }

    const wordIdx = idx % BITS_PER_INT;
    const len = BITS_PER_INT - wordIdx;
    const mask = ((1 << len) - 1) << wordIdx;
    const reducedWord = this.arr[startWord] & mask;

    if (reducedWord > 0) {
      return lsb(reducedWord) + startWord * BITS_PER_INT;
    }

    return this.ffs(startWord + 1);
  }

  /**
   * Find first unset bit, starting at a given index
   * @param {number} idx the starting index for the next unset bit
   * @returns {number} the index of the next unset bit >= idx, or -1 if not found
   */
  public nextUnsetBit(idx: number): number {
    const startWord = this.getWord(idx);

    if (startWord === -1) {
      return -1;
    }

    const mask = (1 << idx % BITS_PER_INT) - 1;
    const reducedWord = this.arr[startWord] | mask;

    if (reducedWord === 0x7fffffff) {
      return this.ffz(startWord + 1);
    }

    return lsb(0x7fffffff ^ reducedWord) + startWord * BITS_PER_INT;
  }

  /**
   * Find last set bit, up to a given index
   * @param {number} idx the starting index for the next unset bit (going in reverse)
   * @returns {number} the index of the next unset bit <= idx, or -1 if not found
   */
  public previousSetBit(idx: number): number {
    const startWord = this.getWord(idx);

    if (startWord === -1) {
      return -1;
    }

    const mask = 0x7fffffff >>> (BITS_PER_INT - (idx % BITS_PER_INT) - 1);
    const reducedWord = this.arr[startWord] & mask;

    if (reducedWord > 0) {
      return msb(reducedWord) + startWord * BITS_PER_INT;
    }

    return this.fls(startWord - 1);
  }

  /**
   * Find last unset bit, up to a given index
   * @param {number} idx the starting index for the next unset bit (going in reverse)
   * @returns {number} the index of the next unset bit <= idx, or -1 if not found
   */
  public previousUnsetBit(idx: number): number {
    const startWord = this.getWord(idx);

    if (startWord === -1) {
      return -1;
    }

    const wordIdx = idx % BITS_PER_INT;
    const mask = ((1 << (BITS_PER_INT - wordIdx - 1)) - 1) << (wordIdx + 1);
    const reducedWord = this.arr[startWord] | mask;

    if (reducedWord === 0x7fffffff) {
      return this.flz(startWord - 1);
    }

    return msb(0x7fffffff ^ reducedWord) + startWord * BITS_PER_INT;
  }

  /**
   *
   * @param {number} idx position of bit in bitset
   * @returns {number} the word where the index is located, or -1 if out of range
   * @private
   */
  private getWord(idx: number): number {
    return idx < 0 || idx > this.MAX_BIT ? -1 : ~~(idx / BITS_PER_INT);
  }

  /**
   * Shared function for setting, unsetting, or toggling a range of bits
   * @param {number} from the starting index of the range to set
   * @param {number} to the ending index of the range to set
   * @param {Function} func function to run (set, unset, or toggle)
   * @returns {boolean} true if set was successful, else false
   * @private
   */
  // tslint:disable-next-line: ban-types
  private doRange(
    from: number,
    to: number,
    func: (...args: any[]) => any,
  ): boolean {
    let i;
    let curStart;
    let curEnd;
    let len;

    if (to < from) {
      to ^= from;
      from ^= to;
      to ^= from;
    }
    const startWord = this.getWord(from);
    const endWord = this.getWord(to);

    if (startWord === -1 || endWord === -1) {
      return false;
    }

    for (i = startWord; i <= endWord; i++) {
      curStart = i === startWord ? from % BITS_PER_INT : 0;
      curEnd = i === endWord ? to % BITS_PER_INT : BITS_PER_INT - 1;
      len = curEnd - curStart + 1;
      this.arr[i] = func(this.arr[i], len, curStart);
    }

    return true;
  }

  /**
   * Both bitsets must have the same number of words, no length check is performed to prevent and overflow.
   * @param {BitSet | Number} bsOrIdx a bitset or single index to check (useful for LP, DP problems)
   * @param {Function} func the operation to perform (and, or, xor)
   * @returns {BitSet} a new bitset that is the bitwise operation of the two
   * @private
   */
  // tslint:disable-next-line: ban-types
  private op(bsOrIdx: BitSet | number, func: (...args: any[]) => any): BitSet {
    let i;
    let arr2;
    let len;
    let newBS;
    let word;

    const arr1 = this.arr;

    if (typeof bsOrIdx === 'number') {
      word = this.getWord(bsOrIdx);
      newBS = this.clone();

      if (word !== -1) {
        newBS.arr[word] = func(arr1[word], 1 << bsOrIdx % BITS_PER_INT);
      }
    } else {
      arr2 = bsOrIdx.arr;
      len = arr1.length;
      newBS = new BitSet(this.MAX_BIT + 1);

      for (i = 0; i < len; i++) {
        newBS.arr[i] = func(arr1[i], arr2[i]);
      }
    }

    return newBS;
  }
}

/**
 *
 * Returns the least signifcant bit, or 0 if none set, so a prior check to see if the word > 0 is required
 * @param {number} word the current array
 * @returns {number} the index of the least significant bit in the current array
 */
export function lsb(word: number): number {
  return multiplyDeBruijnBitPosition[((word & -word) * 0x077cb531) >>> 27];
}

/**
 * Returns the least signifcant bit, or 0 if none set, so a prior check to see if the word > 0 is required
 * @param word the current array
 * @returns {number} the index of the most significant bit in the current array
 */
export function msb(word: number): number {
  word |= word >> 1;
  word |= word >> 2;
  word |= word >> 4;
  word |= word >> 8;
  word |= word >> 16;
  word = (word >> 1) + 1;

  return multiplyDeBruijnBitPosition[(word * 0x077cb531) >>> 27];
}

export function toggleFunc(
  word: number,
  len: number,
  curStart: number,
): number {
  const mask = ((1 << len) - 1) << curStart;
  return word ^ mask;
}

export function setFunc(word: number, len: number, curStart: number): number {
  const mask = ((1 << len) - 1) << curStart;
  return word | mask;
}

export function unsetFunc(word: number, len: number, curStart: number): number {
  const mask = 0x7fffffff ^ (((1 << len) - 1) << curStart);
  return word & mask;
}

export function and(word1: number, word2: number): number {
  return word1 & word2;
}

export function or(word1: number, word2: number): number {
  return word1 | word2;
}

export function xor(word1: number, word2: number): number {
  return word1 ^ word2;
}
