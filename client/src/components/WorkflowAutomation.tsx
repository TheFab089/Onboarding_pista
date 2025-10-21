import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Zap, Mail, Bell, Calendar, FileText, Users, Package } from "lucide-react";

interface Automation {
  id: string;
  category: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  icon: any;
  enabled: boolean;
  config?: any;
}

interface WorkflowAutomationProps {
  onAutomationsChange: (automations: Automation[]) => void;
}

const AUTOMATION_TEMPLATES: Automation[] = [
  {
    id: "lead_assignment",
    category: "CRM",
    name: "Automatische Lead-Zuweisung",
    description: "Neue Leads werden automatisch dem zuständigen Mitarbeiter zugewiesen",
    trigger: "Neuer Lead erstellt",
    action: "Zuweisung basierend auf Region/Produkttyp",
    icon: Users,
    enabled: false,
    config: { assignmentRule: "round_robin" }
  },
  {
    id: "quote_email",
    category: "Verkauf",
    name: "Angebot per E-Mail versenden",
    description: "Nach Angebotserstellung automatisch E-Mail an Kunde",
    trigger: "Angebot erstellt",
    action: "E-Mail mit PDF-Anhang senden",
    icon: Mail,
    enabled: false,
    config: { emailTemplate: "standard" }
  },
  {
    id: "quote_followup",
    category: "Verkauf",
    name: "Angebots-Nachfassung",
    description: "Erinnerung wenn Angebot nach X Tagen nicht beantwortet",
    trigger: "Angebot älter als X Tage",
    action: "E-Mail-Erinnerung + Aufgabe für Vertrieb",
    icon: Bell,
    enabled: false,
    config: { days: 7 }
  },
  {
    id: "project_creation",
    category: "Projekt",
    name: "Automatische Projekterstellung",
    description: "Bei gewonnenem Auftrag wird automatisch Projekt angelegt",
    trigger: "Opportunity gewonnen",
    action: "Projekt mit Template erstellen",
    icon: Package,
    enabled: false,
    config: { template: "sanitaer" }
  },
  {
    id: "project_notification",
    category: "Projekt",
    name: "Team-Benachrichtigung",
    description: "Monteure werden über neue Projekte informiert",
    trigger: "Projekt gestartet",
    action: "E-Mail/Push an zugewiesene Mitarbeiter",
    icon: Bell,
    enabled: false
  },
  {
    id: "timesheet_reminder",
    category: "Zeiterfassung",
    name: "Zeiterfassungs-Erinnerung",
    description: "Tägliche Erinnerung fehlende Zeiten einzutragen",
    trigger: "Täglich 17:00 Uhr",
    action: "Benachrichtigung an Mitarbeiter",
    icon: Calendar,
    enabled: false,
    config: { time: "17:00" }
  },
  {
    id: "invoice_auto",
    category: "Buchhaltung",
    name: "Automatische Rechnungserstellung",
    description: "Rechnung wird automatisch erstellt bei Projektabschluss",
    trigger: "Projekt auf 'Abgeschlossen' gesetzt",
    action: "Rechnung generieren und versenden",
    icon: FileText,
    enabled: false
  },
  {
    id: "payment_reminder",
    category: "Buchhaltung",
    name: "Zahlungserinnerung",
    description: "Automatische Mahnung bei überfälliger Rechnung",
    trigger: "Rechnung X Tage überfällig",
    action: "Erinnerungs-E-Mail senden",
    icon: Mail,
    enabled: false,
    config: { days: 14 }
  },
  {
    id: "maintenance_reminder",
    category: "Nachbetreuung",
    name: "Wartungserinnerung",
    description: "Jährliche Erinnerung für Heizungswartung",
    trigger: "12 Monate nach Installation",
    action: "E-Mail an Kunde + Lead erstellen",
    icon: Calendar,
    enabled: false,
    config: { interval: 12 }
  },
  {
    id: "customer_satisfaction",
    category: "Nachbetreuung",
    name: "Kundenzufriedenheits-Umfrage",
    description: "Umfrage nach Projektabschluss",
    trigger: "7 Tage nach Projektabschluss",
    action: "Umfrage-Link per E-Mail",
    icon: Mail,
    enabled: false,
    config: { days: 7 }
  }
];

export default function WorkflowAutomation({ onAutomationsChange }: WorkflowAutomationProps) {
  const [automations, setAutomations] = useState<Automation[]>(AUTOMATION_TEMPLATES);

  const toggleAutomation = (id: string) => {
    const updated = automations.map(auto => 
      auto.id === id ? { ...auto, enabled: !auto.enabled } : auto
    );
    setAutomations(updated);
    onAutomationsChange(updated);
  };

  const updateConfig = (id: string, key: string, value: any) => {
    const updated = automations.map(auto =>
      auto.id === id 
        ? { ...auto, config: { ...auto.config, [key]: value } }
        : auto
    );
    setAutomations(updated);
    onAutomationsChange(updated);
  };

  const categories = Array.from(new Set(automations.map(a => a.category)));
  const enabledCount = automations.filter(a => a.enabled).length;

  return (
    <div className="space-y-6">
      <Card className="border-2 border-accent bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-accent" />
            Workflow-Automatisierung
          </CardTitle>
          <CardDescription>
            Wählen Sie Automatisierungen, die Ihren Arbeitsalltag erleichtern
          </CardDescription>
          <div className="pt-3">
            <Badge variant="secondary" className="text-sm">
              {enabledCount} von {automations.length} Automatisierungen aktiviert
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map(category => {
            const categoryAutomations = automations.filter(a => a.category === category);
            const categoryEnabled = categoryAutomations.filter(a => a.enabled).length;

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{category}</h3>
                  <Badge variant="outline">
                    {categoryEnabled}/{categoryAutomations.length}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {categoryAutomations.map(automation => {
                    const Icon = automation.icon;
                    return (
                      <Card 
                        key={automation.id}
                        className={`border-2 transition-all ${
                          automation.enabled 
                            ? "border-green-300 bg-green-50/50" 
                            : "border-gray-200 hover:border-accent/50"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={automation.enabled}
                              onCheckedChange={() => toggleAutomation(automation.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4 text-accent" />
                                  <h4 className="font-semibold">{automation.name}</h4>
                                </div>
                                {automation.enabled && (
                                  <Badge className="bg-green-100 text-green-800">
                                    Aktiv
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3">
                                {automation.description}
                              </p>
                              
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 text-xs">
                                <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                  <p className="font-semibold text-blue-800 mb-1">Auslöser:</p>
                                  <p className="text-blue-600">{automation.trigger}</p>
                                </div>
                                <div className="bg-purple-50 border border-purple-200 rounded p-2">
                                  <p className="font-semibold text-purple-800 mb-1">Aktion:</p>
                                  <p className="text-purple-600">{automation.action}</p>
                                </div>
                              </div>

                              {automation.enabled && automation.config && (
                                <div className="mt-3 pt-3 border-t">
                                  <p className="text-xs font-semibold mb-2">Einstellungen:</p>
                                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                    {automation.config.days !== undefined && (
                                      <div>
                                        <Label className="text-xs">Tage</Label>
                                        <Input
                                          type="number"
                                          value={automation.config.days}
                                          onChange={(e) => updateConfig(automation.id, "days", parseInt(e.target.value))}
                                          className="h-8 text-xs"
                                        />
                                      </div>
                                    )}
                                    {automation.config.assignmentRule && (
                                      <div>
                                        <Label className="text-xs">Zuweisung</Label>
                                        <Select
                                          value={automation.config.assignmentRule}
                                          onValueChange={(v) => updateConfig(automation.id, "assignmentRule", v)}
                                        >
                                          <SelectTrigger className="h-8 text-xs">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="round_robin">Reihum</SelectItem>
                                            <SelectItem value="region">Nach Region</SelectItem>
                                            <SelectItem value="workload">Nach Auslastung</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

