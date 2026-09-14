export namespace CategoryGroup {
  export namespace Request {}
  export namespace Response {
    export type GetAll = Array<{
      id: number;
      name: string;
    }>;
  }
  export type Model = {
    id: number;
    name: string;
  };
}
