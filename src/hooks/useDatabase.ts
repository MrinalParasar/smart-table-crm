import { useState, useEffect } from 'react';
import { Database, Table, Field, Record } from '@/types/database';

// Mock data generator
const generateMockData = (): Database => {
  const tables: Table[] = [
    {
      id: '1',
      name: 'Contacts',
      fields: [
        { id: '1', name: 'Name', type: 'text', required: true },
        { id: '2', name: 'Email', type: 'email', required: true },
        { id: '3', name: 'Phone', type: 'text' },
        { id: '4', name: 'Company', type: 'text' },
        { id: '5', name: 'Status', type: 'select', options: [
          { id: '1', label: 'Lead', color: '#3b82f6' },
          { id: '2', label: 'Customer', color: '#10b981' },
          { id: '3', label: 'Inactive', color: '#6b7280' }
        ]},
        { id: '6', name: 'Last Contact', type: 'date' },
        { id: '7', name: 'Priority', type: 'checkbox' }
      ],
      records: [
        {
          id: '1',
          data: {
            '1': 'John Doe',
            '2': 'john@example.com',
            '3': '+1 555-0123',
            '4': 'Acme Corp',
            '5': '2',
            '6': new Date('2024-01-15').toISOString(),
            '7': true
          },
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '2',
          data: {
            '1': 'Jane Smith',
            '2': 'jane@example.com',
            '3': '+1 555-0124',
            '4': 'TechStart Inc',
            '5': '1',
            '6': new Date('2024-01-20').toISOString(),
            '7': false
          },
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-20')
        },
        {
          id: '3',
          data: {
            '1': 'Mike Johnson',
            '2': 'mike@company.com',
            '3': '+1 555-0125',
            '4': 'Global Solutions',
            '5': '2',
            '6': new Date('2024-01-18').toISOString(),
            '7': true
          },
          createdAt: new Date('2024-01-03'),
          updatedAt: new Date('2024-01-18')
        }
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '2',
      name: 'Projects',
      fields: [
        { id: '1', name: 'Project Name', type: 'text', required: true },
        { id: '2', name: 'Description', type: 'text' },
        { id: '3', name: 'Budget', type: 'number' },
        { id: '4', name: 'Start Date', type: 'date' },
        { id: '5', name: 'End Date', type: 'date' },
        { id: '6', name: 'Status', type: 'select', options: [
          { id: '1', label: 'Planning', color: '#f59e0b' },
          { id: '2', label: 'In Progress', color: '#3b82f6' },
          { id: '3', label: 'Completed', color: '#10b981' },
          { id: '4', label: 'On Hold', color: '#ef4444' }
        ]},
        { id: '7', name: 'Active', type: 'checkbox' }
      ],
      records: [
        {
          id: '1',
          data: {
            '1': 'Website Redesign',
            '2': 'Complete overhaul of company website',
            '3': 50000,
            '4': new Date('2024-02-01').toISOString(),
            '5': new Date('2024-04-01').toISOString(),
            '6': '2',
            '7': true
          },
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-25')
        },
        {
          id: '2',
          data: {
            '1': 'Mobile App Development',
            '2': 'iOS and Android app for customer portal',
            '3': 120000,
            '4': new Date('2024-03-01').toISOString(),
            '5': new Date('2024-08-01').toISOString(),
            '6': '1',
            '7': true
          },
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-25')
        }
      ],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-25')
    },
    {
      id: '3',
      name: 'Tasks',
      fields: [
        { id: '1', name: 'Task', type: 'text', required: true },
        { id: '2', name: 'Assignee', type: 'text' },
        { id: '3', name: 'Due Date', type: 'date' },
        { id: '4', name: 'Priority', type: 'select', options: [
          { id: '1', label: 'Low', color: '#10b981' },
          { id: '2', label: 'Medium', color: '#f59e0b' },
          { id: '3', label: 'High', color: '#ef4444' }
        ]},
        { id: '5', name: 'Completed', type: 'checkbox' }
      ],
      records: [
        {
          id: '1',
          data: {
            '1': 'Update user documentation',
            '2': 'Alice Johnson',
            '3': new Date('2024-02-15').toISOString(),
            '4': '2',
            '5': false
          },
          createdAt: new Date('2024-01-25'),
          updatedAt: new Date('2024-01-25')
        },
        {
          id: '2',
          data: {
            '1': 'Fix login bug',
            '2': 'Bob Smith',
            '3': new Date('2024-02-10').toISOString(),
            '4': '3',
            '5': true
          },
          createdAt: new Date('2024-01-24'),
          updatedAt: new Date('2024-01-26')
        },
        {
          id: '3',
          data: {
            '1': 'Review code changes',
            '2': 'Charlie Brown',
            '3': new Date('2024-02-12').toISOString(),
            '4': '1',
            '5': false
          },
          createdAt: new Date('2024-01-26'),
          updatedAt: new Date('2024-01-26')
        }
      ],
      createdAt: new Date('2024-01-24'),
      updatedAt: new Date('2024-01-26')
    }
  ];

  return {
    id: '1',
    name: 'My CRM Database',
    tables,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-26')
  };
};

export function useDatabase() {
  const [database, setDatabase] = useState<Database>(() => {
    const saved = localStorage.getItem('crm-database');
    return saved ? JSON.parse(saved) : generateMockData();
  });

  useEffect(() => {
    localStorage.setItem('crm-database', JSON.stringify(database));
  }, [database]);

  const updateRecord = (tableId: string, recordId: string, fieldId: string, value: any) => {
    setDatabase(prev => ({
      ...prev,
      tables: prev.tables.map(table =>
        table.id === tableId
          ? {
              ...table,
              records: table.records.map(record =>
                record.id === recordId
                  ? {
                      ...record,
                      data: { ...record.data, [fieldId]: value },
                      updatedAt: new Date()
                    }
                  : record
              ),
              updatedAt: new Date()
            }
          : table
      ),
      updatedAt: new Date()
    }));
  };

  const addRecord = (tableId: string) => {
    const table = database.tables.find(t => t.id === tableId);
    if (!table) return;

    const newRecord: Record = {
      id: Date.now().toString(),
      data: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setDatabase(prev => ({
      ...prev,
      tables: prev.tables.map(t =>
        t.id === tableId
          ? {
              ...t,
              records: [...t.records, newRecord],
              updatedAt: new Date()
            }
          : t
      ),
      updatedAt: new Date()
    }));
  };

  const deleteRecord = (tableId: string, recordId: string) => {
    setDatabase(prev => ({
      ...prev,
      tables: prev.tables.map(table =>
        table.id === tableId
          ? {
              ...table,
              records: table.records.filter(record => record.id !== recordId),
              updatedAt: new Date()
            }
          : table
      ),
      updatedAt: new Date()
    }));
  };

  const addField = (tableId: string, field: Omit<Field, 'id'>) => {
    const newField: Field = {
      ...field,
      id: Date.now().toString()
    };

    setDatabase(prev => ({
      ...prev,
      tables: prev.tables.map(table =>
        table.id === tableId
          ? {
              ...table,
              fields: [...table.fields, newField],
              updatedAt: new Date()
            }
          : table
      ),
      updatedAt: new Date()
    }));
  };

  const deleteField = (tableId: string, fieldId: string) => {
    setDatabase(prev => ({
      ...prev,
      tables: prev.tables.map(table =>
        table.id === tableId
          ? {
              ...table,
              fields: table.fields.filter(field => field.id !== fieldId),
              records: table.records.map(record => {
                const newData = { ...record.data };
                delete newData[fieldId];
                return { ...record, data: newData };
              }),
              updatedAt: new Date()
            }
          : table
      ),
      updatedAt: new Date()
    }));
  };

  const updateField = (tableId: string, fieldId: string, updates: Partial<Field>) => {
    setDatabase(prev => ({
      ...prev,
      tables: prev.tables.map(table =>
        table.id === tableId
          ? {
              ...table,
              fields: table.fields.map(field =>
                field.id === fieldId ? { ...field, ...updates } : field
              ),
              updatedAt: new Date()
            }
          : table
      ),
      updatedAt: new Date()
    }));
  };

  const createTable = (name: string) => {
    const newTable: Table = {
      id: Date.now().toString(),
      name,
      fields: [
        { id: '1', name: 'Name', type: 'text', required: true }
      ],
      records: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setDatabase(prev => ({
      ...prev,
      tables: [...prev.tables, newTable],
      updatedAt: new Date()
    }));

    return newTable.id;
  };

  return {
    database,
    updateRecord,
    addRecord,
    deleteRecord,
    addField,
    deleteField,
    updateField,
    createTable
  };
}