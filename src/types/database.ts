export type FieldType = 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'email' | 'url';

export interface SelectOption {
  id: string;
  label: string;
  color: string;
}

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  options?: SelectOption[];
  required?: boolean;
}

export interface Record {
  id: string;
  data: { [fieldId: string]: any };
  createdAt: Date;
  updatedAt: Date;
}

export interface Table {
  id: string;
  name: string;
  fields: Field[];
  records: Record[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Database {
  id: string;
  name: string;
  tables: Table[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ViewConfig {
  id: string;
  name: string;
  type: 'table' | 'kanban' | 'calendar';
  tableId: string;
  filters: Filter[];
  sorts: Sort[];
}

export interface Filter {
  fieldId: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'isEmpty' | 'isNotEmpty';
  value: any;
}

export interface Sort {
  fieldId: string;
  direction: 'asc' | 'desc';
}