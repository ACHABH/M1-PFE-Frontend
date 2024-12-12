export type StrictOmit<T, K extends keyof T> = Omit<T, K>;

export type StrictPick<T, K extends keyof T> = Pick<T, K>;

export type Prettier<T> = T extends object
  ? {
      [P in keyof T]: T[P];
    } & {}
  : T extends (infer O)[]
    ? Prettier<O>[]
    : never;
