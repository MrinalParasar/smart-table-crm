import { useState } from "react";
import { useDatabase } from "@/hooks/useDatabase";
import { CRMSidebar } from "@/components/CRMSidebar";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Database } from "lucide-react";

const Index = () => {
  const { database, updateRecord, addRecord, deleteRecord, addField, deleteField, updateField, createTable } = useDatabase();
  const [activeTableId, setActiveTableId] = useState(database.tables[0]?.id);
  const [newTableName, setNewTableName] = useState("");
  const [isCreateTableOpen, setIsCreateTableOpen] = useState(false);

  const activeTable = database.tables.find(table => table.id === activeTableId);

  const handleCreateTable = () => {
    if (newTableName.trim()) {
      const tableId = createTable(newTableName.trim());
      setActiveTableId(tableId);
      setNewTableName("");
      setIsCreateTableOpen(false);
    }
  };

  const tablesWithCounts = database.tables.map(table => ({
    id: table.id,
    name: table.name,
    recordCount: table.records.length
  }));

  if (!activeTable) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Database className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-semibold mb-2">No Tables Found</h1>
          <p className="text-muted-foreground mb-4">Create your first table to get started</p>
          <Dialog open={isCreateTableOpen} onOpenChange={setIsCreateTableOpen}>
            <DialogTrigger asChild>
              <Button>Create Table</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Table</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tableName">Table Name</Label>
                  <Input
                    id="tableName"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    placeholder="Enter table name..."
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateTable()}
                  />
                </div>
                <Button onClick={handleCreateTable} className="w-full">
                  Create Table
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      <CRMSidebar
        tables={tablesWithCounts}
        activeTableId={activeTableId}
        onTableSelect={setActiveTableId}
        onCreateTable={() => setIsCreateTableOpen(true)}
      />
      
      <div className="flex-1 flex flex-col">
        <DataTable
          table={activeTable}
          onUpdateRecord={(recordId, fieldId, value) => updateRecord(activeTableId!, recordId, fieldId, value)}
          onAddRecord={() => addRecord(activeTableId!)}
          onDeleteRecord={(recordId) => deleteRecord(activeTableId!, recordId)}
          onAddField={(field) => addField(activeTableId!, field)}
          onDeleteField={(fieldId) => deleteField(activeTableId!, fieldId)}
          onUpdateField={(fieldId, updates) => updateField(activeTableId!, fieldId, updates)}
        />
      </div>

      <Dialog open={isCreateTableOpen} onOpenChange={setIsCreateTableOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Table</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tableName">Table Name</Label>
              <Input
                id="tableName"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                placeholder="Enter table name..."
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTable()}
              />
            </div>
            <Button onClick={handleCreateTable} className="w-full">
              Create Table
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
