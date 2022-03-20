export type Resolver<T> = (root: any, args: T, context: any, info: any) => any;

export type Resolvers<T> = {
  [key: string]: {
    [key: string]: Resolver<T>;
  };
};
