export function isEmpty(item: any) {
  if (typeof item === "string") return item.trim().length === 0;
  if (!item) return true;
  if (Array.isArray(item) && item.length === 0) return true;
  if (typeof item === "object") return Object.keys(item).length === 0;
  return false
}

export function flat<T>(arr: T[][]): T[] {
  let temp: T[] = []
  arr.forEach(item => {
    temp = [...temp, ...item]
  })
  return temp
}

export function get<T>(data: T, key: string): any {
  const fields: string[] = key.split('.');
  return fields.reduce((prev: any, subField: string) => prev[subField], data);
}

export function pick<T>(data: T, fields: (keyof T | string)[]): Partial<T> {
  return fields.reduce(
    (prev: Partial<T>, key) =>
      Object.assign(prev, {[key]: get(data, key as string)}),
    {},
  );
}
