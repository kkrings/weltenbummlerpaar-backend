export const onlyDefined = (dto: Record<string, any>): Record<string, any> =>
  Object.fromEntries(Object.entries(dto).filter((entry) => entry[1] != null));
