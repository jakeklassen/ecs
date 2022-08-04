// https://stackoverflow.com/a/65963590
type PathTree<T> = {
  [P in keyof T]-?: T[P] extends object ? [P] | [P, ...Path<T[P]>] : [P];
};

type LeafPathTree<T> = {
  [P in keyof T]-?: T[P] extends object ? [P, ...LeafPath<T[P]>] : [P];
};

type Path<T> = PathTree<T>[keyof PathTree<T>];
type LeafPath<T> = LeafPathTree<T>[keyof LeafPathTree<T>];

type Join<T extends (string | number)[], D extends string = '.'> = T extends {
  length: 1;
}
  ? `${T[0]}`
  : T extends { length: 2 }
  ? `${T[0]}${D}${T[1]}`
  : T extends { length: 3 }
  ? `${T[0]}${D}${T[1]}${D}${T[2]}`
  : T extends { length: 4 }
  ? `${T[0]}${D}${T[1]}${D}${T[2]}${D}${T[3]}`
  : T extends { length: 5 }
  ? `${T[0]}${D}${T[1]}${D}${T[2]}${D}${T[3]}${D}${T[4]}`
  : T extends { length: 6 }
  ? `${T[0]}${D}${T[1]}${D}${T[2]}${D}${T[3]}${D}${T[4]}${D}${T[5]}`
  : T extends { length: 7 }
  ? `${T[0]}${D}${T[1]}${D}${T[2]}${D}${T[3]}${D}${T[4]}${D}${T[5]}${D}${T[6]}`
  : T extends { length: 8 }
  ? `${T[0]}${D}${T[1]}${D}${T[2]}${D}${T[3]}${D}${T[4]}${D}${T[5]}${D}${T[6]}${D}${T[7]}`
  : T extends { length: 9 }
  ? `${T[0]}${D}${T[1]}${D}${T[2]}${D}${T[3]}${D}${T[4]}${D}${T[5]}${D}${T[6]}${D}${T[7]}${D}${T[8]}`
  : `${T[0]}${D}${T[1]}${D}${T[2]}${D}${T[3]}${D}${T[4]}${D}${T[5]}${D}${T[6]}${D}${T[7]}${D}${T[8]}${D}${T[9]}`;

export type DottedPaths<T> = LeafPath<T> extends (string | number)[]
  ? Join<LeafPath<T>>
  : never;
