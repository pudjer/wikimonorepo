export interface IPropFactory<T>{
  createNew(): Promise<T>
}