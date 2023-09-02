export default interface IFilters {
  startPrice: number;
  finishPrice: number;
  colors: Set<unknown>;
  madein?: string;
}
