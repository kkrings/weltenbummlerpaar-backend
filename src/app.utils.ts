export const getSetFields = (dto: Record<string, any>): Record<string, any> =>
  Object.fromEntries(Object.entries(dto).filter((entry) => entry[1] != null));

export const asUnsetField = (field: any): null | undefined =>
  field === null ? null : undefined;
