import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus, Trash2, Users } from "lucide-react";

interface Role {
  id: string;
  name: string;
  count: number;
  permissions: {
    crm: boolean;
    sales: boolean;
    project: boolean;
    timesheet: boolean;
    documents: boolean;
    inventory: boolean;
    accounting: boolean;
    admin: boolean;
  };
}

interface RolesPermissionsProps {
  onRolesChange: (roles: Role[]) => void;
}

const DEFAULT_ROLES: Role[] = [
  {
    id: "admin",
    name: "Geschäftsführung",
    count: 1,
    permissions: {
      crm: true,
      sales: true,
      project: true,
      timesheet: true,
      documents: true,
      inventory: true,
      accounting: true,
      admin: true
    }
  },
  {
    id: "office",
    name: "Büro / Verwaltung",
    count: 2,
    permissions: {
      crm: true,
      sales: true,
      project: true,
      timesheet: false,
      documents: true,
      inventory: true,
      accounting: false,
      admin: false
    }
  },
  {
    id: "technician",
    name: "Monteure / Techniker",
    count: 5,
    permissions: {
      crm: false,
      sales: false,
      project: true,
      timesheet: true,
      documents: true,
      inventory: true,
      accounting: false,
      admin: false
    }
  }
];

const PERMISSION_LABELS = {
  crm: "CRM (Leads, Kunden)",
  sales: "Verkauf (Angebote, Aufträge)",
  project: "Projekte verwalten",
  timesheet: "Zeiterfassung",
  documents: "Dokumente",
  inventory: "Lager / Material",
  accounting: "Buchhaltung / Finanzen",
  admin: "Administrator-Rechte"
};

export default function RolesPermissions({ onRolesChange }: RolesPermissionsProps) {
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);

  const addRole = () => {
    const newRole: Role = {
      id: `role_${Date.now()}`,
      name: "Neue Rolle",
      count: 1,
      permissions: {
        crm: false,
        sales: false,
        project: false,
        timesheet: false,
        documents: false,
        inventory: false,
        accounting: false,
        admin: false
      }
    };
    const updated = [...roles, newRole];
    setRoles(updated);
    onRolesChange(updated);
  };

  const removeRole = (id: string) => {
    const updated = roles.filter(r => r.id !== id);
    setRoles(updated);
    onRolesChange(updated);
  };

  const updateRole = (id: string, field: string, value: any) => {
    const updated = roles.map(role =>
      role.id === id ? { ...role, [field]: value } : role
    );
    setRoles(updated);
    onRolesChange(updated);
  };

  const togglePermission = (roleId: string, permission: keyof Role['permissions']) => {
    const updated = roles.map(role =>
      role.id === roleId
        ? {
            ...role,
            permissions: {
              ...role.permissions,
              [permission]: !role.permissions[permission]
            }
          }
        : role
    );
    setRoles(updated);
    onRolesChange(updated);
  };

  const totalUsers = roles.reduce((sum, role) => sum + role.count, 0);

  return (
    <div className="space-y-6">
      <Card className="border-2 border-accent bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-accent" />
            Rollen & Berechtigungen
          </CardTitle>
          <CardDescription>
            Definieren Sie Benutzerrollen und deren Zugriffsrechte in Odoo
          </CardDescription>
          <div className="pt-3">
            <Badge variant="secondary" className="text-sm">
              <Users className="h-3 w-3 mr-1" />
              {totalUsers} Benutzer insgesamt
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {roles.map((role) => (
            <Card key={role.id} className="border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Input
                      value={role.name}
                      onChange={(e) => updateRole(role.id, "name", e.target.value)}
                      className="font-semibold max-w-xs"
                    />
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Anzahl:</Label>
                      <Input
                        type="number"
                        min="0"
                        value={role.count}
                        onChange={(e) => updateRole(role.id, "count", parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                    </div>
                  </div>
                  {!["admin", "office", "technician"].includes(role.id) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRole(role.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
                    <div
                      key={key}
                      className={`flex items-center space-x-2 p-2 rounded border ${
                        role.permissions[key as keyof Role['permissions']]
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <Checkbox
                        id={`${role.id}-${key}`}
                        checked={role.permissions[key as keyof Role['permissions']]}
                        onCheckedChange={() => togglePermission(role.id, key as keyof Role['permissions'])}
                      />
                      <label
                        htmlFor={`${role.id}-${key}`}
                        className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={addRole}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Weitere Rolle hinzufügen
          </Button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-800">
              <strong>Hinweis:</strong> Berechtigungen können nach Go-Live jederzeit angepasst werden. 
              Wir empfehlen, mit restriktiven Rechten zu starten und bei Bedarf zu erweitern.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

