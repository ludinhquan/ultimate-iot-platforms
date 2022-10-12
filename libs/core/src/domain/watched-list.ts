type Field = string | number
type MapItems<T> = Map<Field, T>

export abstract class WatchedList<T> {
  private items: MapItems<T>
  private new: MapItems<T> = new Map()
 
  get size() {
    return this.items.size
  }

  constructor (initialItems?: T[]) {
    this.items = this.toMap(initialItems ?? [])
  }

  abstract getUniqueField(item: T): Field
  abstract compareItems (a: T, b: T): boolean;

  private toMap(list: T[]){
    return new Map(list.map(item => [this.getUniqueField(item), item]))
  }

  private mapToArray(mapItems: MapItems<T>){
    return [...mapItems].map(item => item[1])
  }

  public getItems (): T[] {
    return this.mapToArray(this.items)
  }

  public getNewItems (): T[] {
    return this.mapToArray(this.new)
  }

  public add(item: T): void {
    this.items.set(this.getUniqueField(item), item)
    this.new.set(this.getUniqueField(item), item)
  }

  public remove(item: T): void {
    this.items.delete(this.getUniqueField(item))
  }

  public exists(field: Field): boolean {
    return this.items.has(field)
  }

  public get(field: Field): T | undefined {
    return this.items.get(field)
  }
}
