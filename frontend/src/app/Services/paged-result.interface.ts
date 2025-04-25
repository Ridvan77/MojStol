export interface PagedResult<TModel> {
  count: number;
  resultList: TModel[];
}
