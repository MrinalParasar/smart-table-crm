import { Plus, Database, Table, Settings, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface CRMSidebarProps {
  tables: Array<{ id: string; name: string; recordCount: number }>;
  activeTableId?: string;
  onTableSelect: (tableId: string) => void;
  onCreateTable: () => void;
  className?: string;
}

export function CRMSidebar({ 
  tables, 
  activeTableId, 
  onTableSelect, 
  onCreateTable,
  className 
}: CRMSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn("w-64 border-r bg-muted/20 flex flex-col h-full", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-3">
          <Database className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-sm">CRM Database</h2>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8"
          />
        </div>
      </div>

      {/* Tables List */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {filteredTables.map((table) => (
            <button
              key={table.id}
              onClick={() => onTableSelect(table.id)}
              className={cn(
                "w-full flex items-center justify-between p-2 rounded-md text-left hover:bg-accent transition-colors",
                activeTableId === table.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <Table className="h-4 w-4" />
                <span className="text-sm font-medium truncate">{table.name}</span>
              </div>
              <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                {table.recordCount}
              </span>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          onClick={onCreateTable}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Table
        </Button>
        
        <Separator className="my-3" />
        
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
}