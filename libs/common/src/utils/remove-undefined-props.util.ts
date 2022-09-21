export function removeUndefinedProps(item: any): any {
  const filtered: any = {};
  for (const key of Object.keys(item)) {
    if (item[key]) filtered[key] = item[key];
  }
  return filtered;
}
