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
    <div className={cn("w-64 border-r border-border bg-sidebar flex flex-col h-full", className)}>
      {/* Header */}
      <div className="px-4 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Database className="h-4 w-4 text-primary-foreground" />
          </div>
          <h2 className="font-semibold text-lg text-sidebar-foreground">CRM</h2>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Tables List */}
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {filteredTables.map((table) => (
            <button
              key={table.id}
              onClick={() => onTableSelect(table.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 group",
                activeTableId === table.id 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" 
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <div className="flex items-center gap-3">
                <Table className="h-4 w-4" />
                <span className="text-sm font-medium truncate">{table.name}</span>
              </div>
              <span className="text-xs bg-sidebar-accent text-sidebar-accent-foreground px-2 py-1 rounded-md font-medium">
                {table.recordCount}
              </span>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          onClick={onCreateTable}
          variant="outline"
          size="sm"
          className="w-full bg-sidebar-accent hover:bg-sidebar-accent/80 border-sidebar-border text-sidebar-accent-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Table
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
}