import { useState } from "react";
import { Table, Field, Record } from "@/types/database";
import { EditableCell } from "./EditableCell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Trash2, 
  Filter, 
  SortAsc, 
  SortDesc,
  MoreHorizontal,
  Type,
  Hash,
  Calendar,
  Check,
  List,
  Mail,
  Link,
  Minus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DataTableProps {
  table: Table;
  onUpdateRecord: (recordId: string, fieldId: string, value: any) => void;
  onAddRecord: () => void;
  onDeleteRecord: (recordId: string) => void;
  onAddField: (field: Omit<Field, 'id'>) => void;
  onDeleteField: (fieldId: string) => void;
  onUpdateField: (fieldId: string, updates: Partial<Field>) => void;
}

export function DataTable({
  table,
  onUpdateRecord,
  onAddRecord,
  onDeleteRecord,
  onAddField,
  onDeleteField,
  onUpdateField
}: DataTableProps) {
  const [editingCell, setEditingCell] = useState<{ recordId: string; fieldId: string } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ fieldId: string; direction: 'asc' | 'desc' } | null>(null);
  const [filterConfig, setFilterConfig] = useState<{ fieldId: string; value: string }>({ fieldId: '', value: '' });
  const [frozenColumns, setFrozenColumns] = useState<number>(0);

  const fieldIcons = {
    text: Type,
    number: Hash,
    date: Calendar,
    checkbox: Check,
    select: List,
    email: Mail,
    url: Link
  };

  const sortedRecords = [...table.records].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a.data[sortConfig.fieldId];
    const bValue = b.data[sortConfig.fieldId];
    
    if (aValue === bValue) return 0;
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    const comparison = aValue < bValue ? -1 : 1;
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  const filteredRecords = sortedRecords.filter(record => {
    if (!filterConfig.fieldId || !filterConfig.value) return true;
    
    const value = record.data[filterConfig.fieldId];
    if (value === null || value === undefined) return false;
    
    return String(value).toLowerCase().includes(filterConfig.value.toLowerCase());
  });

  const handleSort = (fieldId: string) => {
    setSortConfig(prev => {
      if (prev?.fieldId === fieldId) {
        return prev.direction === 'asc' 
          ? { fieldId, direction: 'desc' }
          : null;
      }
      return { fieldId, direction: 'asc' };
    });
  };

  const handleAddField = (type: string) => {
    const fieldName = `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    onAddField({
      name: fieldName,
      type: type as any,
      options: type === 'select' ? [
        { id: '1', label: 'Option 1', color: '#3b82f6' },
        { id: '2', label: 'Option 2', color: '#10b981' },
        { id: '3', label: 'Option 3', color: '#f59e0b' }
      ] : undefined
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-foreground">{table.name}</h1>
          <Badge variant="secondary" className="text-xs px-2 py-1 bg-muted text-muted-foreground font-medium">
            {table.records.length} records
          </Badge>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Frozen Columns Adjuster */}
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
            <span className="text-xs text-muted-foreground font-medium">Freeze</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted/80 rounded-md"
                onClick={() => setFrozenColumns(Math.max(0, frozenColumns - 1))}
                disabled={frozenColumns === 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-xs font-medium text-foreground min-w-[1rem] text-center">{frozenColumns}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted/80 rounded-md"
                onClick={() => setFrozenColumns(Math.min(table.fields.length, frozenColumns + 1))}
                disabled={frozenColumns >= table.fields.length}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterConfig.fieldId} onValueChange={(value) => setFilterConfig(prev => ({ ...prev, fieldId: value }))}>
              <SelectTrigger className="w-36 h-8 border-0 bg-transparent shadow-none">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                {table.fields.map(field => (
                  <SelectItem key={field.id} value={field.id}>{field.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filterConfig.fieldId && (
              <Input
                placeholder="Filter value..."
                value={filterConfig.value}
                onChange={(e) => setFilterConfig(prev => ({ ...prev, value: e.target.value }))}
                className="w-36 h-8 border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
            )}
          </div>
          
          <Button onClick={onAddRecord} size="sm" className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-table-header sticky top-0 z-10 border-b border-table-border">
            <tr>
              <th className="w-14 px-3 py-3 border-r border-table-border/50 sticky left-0 bg-table-header z-20"></th>
              {table.fields.map((field, fieldIndex) => {
                const IconComponent = fieldIcons[field.type];
                const isSorted = sortConfig?.fieldId === field.id;
                const isFrozen = fieldIndex < frozenColumns;
                const leftOffset = isFrozen ? 56 + (fieldIndex * 160) : 'auto'; // 56px for row number column + 160px per frozen column
                
                return (
                  <th
                    key={field.id}
                    className={cn(
                      "min-w-40 px-3 py-3 text-left border-r border-table-border/50 last:border-r-0",
                      isFrozen && "sticky bg-table-header z-10"
                    )}
                    style={isFrozen ? { left: `${leftOffset}px` } : undefined}
                  >
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm text-foreground truncate">{field.name}</span>
                        {field.required && <span className="text-destructive text-xs">*</span>}
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-muted/80 rounded-md"
                          onClick={() => handleSort(field.id)}
                        >
                          {isSorted ? (
                            sortConfig.direction === 'asc' ? 
                            <SortAsc className="h-3.5 w-3.5" /> : 
                            <SortDesc className="h-3.5 w-3.5" />
                          ) : (
                            <SortAsc className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-muted/80 rounded-md">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border shadow-lg">
                            <DropdownMenuLabel className="text-xs text-muted-foreground">Field Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onDeleteField(field.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Field
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </th>
                );
              })}
              
              <th className="w-14 px-3 py-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-muted/80 rounded-md">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border shadow-lg">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Add Field</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleAddField('text')}>
                      <Type className="h-4 w-4 mr-2" />
                      Text
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddField('number')}>
                      <Hash className="h-4 w-4 mr-2" />
                      Number
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddField('date')}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Date
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddField('checkbox')}>
                      <Check className="h-4 w-4 mr-2" />
                      Checkbox
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddField('select')}>
                      <List className="h-4 w-4 mr-2" />
                      Select
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddField('email')}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddField('url')}>
                      <Link className="h-4 w-4 mr-2" />
                      URL
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </th>
            </tr>
          </thead>
          
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr
                key={record.id}
                className="hover:bg-table-hover border-b border-table-border/30 group transition-colors duration-150"
              >
                <td className="px-3 py-2 border-r border-table-border/50 text-center sticky left-0 bg-background z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">{index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive/10 rounded-md"
                      onClick={() => onDeleteRecord(record.id)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </td>
                
                {table.fields.map((field, fieldIndex) => {
                  const isFrozen = fieldIndex < frozenColumns;
                  const leftOffset = isFrozen ? 56 + (fieldIndex * 160) : 'auto';
                  
                   return (
                     <td
                       key={field.id}
                       className={cn(
                         "border-r border-table-border/50 last:border-r-0",
                         isFrozen && "sticky bg-background z-10"
                       )}
                       style={isFrozen ? { left: `${leftOffset}px` } : undefined}
                     >
                       <EditableCell
                         field={field}
                         value={record.data[field.id]}
                         onChange={(value) => onUpdateRecord(record.id, field.id, value)}
                         isEditing={editingCell?.recordId === record.id && editingCell?.fieldId === field.id}
                         onStartEdit={() => setEditingCell({ recordId: record.id, fieldId: field.id })}
                         onStopEdit={() => setEditingCell(null)}
                       />
                     </td>
                   );
                 })}
                
                <td className="px-3 py-2"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}