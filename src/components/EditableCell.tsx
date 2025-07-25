import { useState, useEffect, useRef } from "react";
import { Field } from "@/types/database";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Calendar, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface EditableCellProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
  className?: string;
}

export function EditableCell({
  field,
  value,
  onChange,
  isEditing,
  onStartEdit,
  onStopEdit,
  className
}: EditableCellProps) {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(localValue);
    onStopEdit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setLocalValue(value);
      onStopEdit();
    }
  };

  const renderDisplay = () => {
    switch (field.type) {
      case 'checkbox':
        return (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={value}
              onCheckedChange={onChange}
              className="h-4 w-4"
            />
          </div>
        );

      case 'select':
        const option = field.options?.find(opt => opt.id === value);
        return option ? (
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border"
            style={{ 
              backgroundColor: option.color + '15', 
              color: option.color,
              borderColor: option.color + '30'
            }}
          >
            {option.label}
          </span>
        ) : (
          <span className="text-muted-foreground text-sm">Select...</span>
        );

      case 'date':
        return value ? (
          <span className="text-sm text-foreground">
            {format(new Date(value), 'MMM dd, yyyy')}
          </span>
        ) : (
          <span className="text-muted-foreground text-sm">Empty</span>
        );

      case 'number':
        return value ? (
          <span className="text-sm text-foreground font-mono">
            {value.toLocaleString()}
          </span>
        ) : (
          <span className="text-muted-foreground text-sm">Empty</span>
        );

      default:
        return value ? (
          <span className="text-sm text-foreground">{value}</span>
        ) : (
          <span className="text-muted-foreground text-sm">Empty</span>
        );
    }
  };

  const renderEditor = () => {
    switch (field.type) {
      case 'select':
        return (
          <Select value={localValue} onValueChange={(val) => {
            onChange(val);
            onStopEdit();
          }}>
            <SelectTrigger className="w-full border-0 h-8 focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  <span
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                    style={{ backgroundColor: option.color + '20', color: option.color }}
                  >
                    {option.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Popover open={isEditing} onOpenChange={(open) => !open && onStopEdit()}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-left font-normal h-8 px-2 border-0"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {localValue ? format(new Date(localValue), 'MMM dd, yyyy') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={localValue ? new Date(localValue) : undefined}
                onSelect={(date) => {
                  onChange(date?.toISOString());
                  onStopEdit();
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'number':
        return (
          <Input
            ref={inputRef}
            type="number"
            value={localValue || ''}
            onChange={(e) => setLocalValue(e.target.value ? Number(e.target.value) : null)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="border-0 h-8 focus-visible:ring-0 p-2"
          />
        );

      default:
        return (
          <Input
            ref={inputRef}
            value={localValue || ''}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="border-0 h-8 focus-visible:ring-0 p-2"
          />
        );
    }
  };

  if (field.type === 'checkbox') {
    return (
      <div className={cn("flex items-center justify-center h-8", className)}>
        {renderDisplay()}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-10 flex items-center px-3 py-2 cursor-pointer hover:bg-table-hover/60 transition-colors duration-150 group",
        isEditing && "bg-background border border-ring rounded-md shadow-sm",
        className
      )}
      onClick={() => !isEditing && onStartEdit()}
    >
      {isEditing ? renderEditor() : renderDisplay()}
    </div>
  );
}