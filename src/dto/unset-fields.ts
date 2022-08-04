type IsUnsetField<Field, TField> = TField extends null ? Field : never;

export type UnsetFields<Dto> = {
  [Field in keyof Dto as IsUnsetField<Field, Dto[Field]>]: null;
};
