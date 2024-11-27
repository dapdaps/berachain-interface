export type ComponentPropsType = {
  dexConfig: any;
};
export type ColumnType = {
  width: string;
  direction?: string;
  key: string;
  label: string;
  type: string;
  sort?: boolean;
  isFilter?: boolean;
  list?: any;
  align?: string;
  render: (data: any, index: number) => JSX.Element;
};
export type ColunmListType = ColumnType[];
