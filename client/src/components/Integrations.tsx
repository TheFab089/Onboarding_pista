import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plug, Mail, Globe, FileText, CreditCard, Cloud, Database, Calendar } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: any;
  enabled: boolean;
  config?: {
    provider?: string;
    apiKey?: string;
    accountId?: string;
    notes?: string;
  };
}

interface IntegrationsProps {
  onIntegrationsChange: (integrations: Integration[]) => void;
}

const AVAILABLE_INTEGRATIONS: Integration[] = [
  {
    id: "email",
    name: "E-Mail Integration",
    category: "Kommunikation",
    description: "Gmail, Outlook, IMAP - E-Mails direkt in Odoo",
    icon: Mail,
    enabled: false,
    config: { provider: "" }
  },
  {
    id: "website",
    name: "Website / Kontaktformular",
    category: "Kommunikation",
    description: "Leads aus Website-Formularen automatisch erfassen",
    icon: Globe,
    enabled: false,
    config: { notes: "" }
  },
  {
    id: "datev",
    name: "DATEV",
    category: "Buchhaltung",
    description: "Export für Steuerberater (DATEV-Format)",
    icon: FileText,
    enabled: false,
    config: { accountId: "" }
  },
  {
    id: "lexoffice",
    name: "Lexoffice / sevDesk",
    category: "Buchhaltung",
    description: "Synchronisation mit Cloud-Buchhaltung",
    icon: Cloud,
    enabled: false,
    config: { provider: "", apiKey: "" }
  },
  {
    id: "payment",
    name: "Zahlungsanbieter",
    category: "Finanzen",
    description: "PayPal, Stripe, SEPA-Lastschrift",
    icon: CreditCard,
    enabled: false,
    config: { provider: "" }
  },
  {
    id: "supplier_portal",
    name: "Lieferanten-Portale",
    category: "Einkauf",
    description: "Direktbestellung bei Großhändlern (z.B. SHK-Portale)",
    icon: Database,
    enabled: false,
    config: { notes: "" }
  },
  {
    id: "google_calendar",
    name: "Google Calendar / Outlook",
    category: "Produktivität",
    description: "Termine synchronisieren",
    icon: Calendar,
    enabled: false,
    config: { provider: "" }
  }
];

export default function Integrations({ onIntegrationsChange }: IntegrationsProps) {
  const [integrations, setIntegrations] = useState<Integration[]>(AVAILABLE_INTEGRATIONS);

  const toggleIntegration = (id: string) => {
    const updated = integrations.map(int =>
      int.id === id ? { ...int, enabled: !int.enabled } : int
    );
    setIntegrations(updated);
    onIntegrationsChange(updated);
  };

  const updateConfig = (id: string, field: string, value: string) => {
    const updated = integrations.map(int =>
      int.id === id
        ? { ...int, config: { ...int.config, [field]: value } }
        : int
    );
    setIntegrations(updated);
    onIntegrationsChange(updated);
  };

  const categories = Array.from(new Set(integrations.map(i => i.category)));
  const enabledCount = integrations.filter(i => i.enabled).length;

  return (
    <div className="space-y-6">
      <Card className="border-2 border-accent bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-6 w-6 text-accent" />
            Integrationen & Schnittstellen
          </CardTitle>
          <CardDescription>
            Verbinden Sie Odoo mit Ihren bestehenden Systemen
          </CardDescription>
          <div className="pt-3">
            <Badge variant="secondary" className="text-sm">
              {enabledCount} von {integrations.length} Integrationen gewählt
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map(category => {
            const categoryIntegrations = integrations.filter(i => i.category === category);
            const categoryEnabled = categoryIntegrations.filter(i => i.enabled).length;

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{category}</h3>
                  <Badge variant="outline">
                    {categoryEnabled}/{categoryIntegrations.length}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {categoryIntegrations.map(integration => {
                    const Icon = integration.icon;
                    return (
                      <Card
                        key={integration.id}
                        className={`border-2 transition-all ${
                          integration.enabled
                            ? "border-blue-300 bg-blue-50/50"
                            : "border-gray-200 hover:border-accent/50"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={integration.enabled}
                              onCheckedChange={() => toggleIntegration(integration.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4 text-accent" />
                                  <h4 className="font-semibold">{integration.name}</h4>
                                </div>
                                {integration.enabled && (
                                  <Badge className="bg-blue-100 text-blue-800">
                                    Aktiv
                                  </Badge>
                                )}
                              </div>

                              <p className="text-sm text-muted-foreground mb-3">
                                {integration.description}
                              </p>

                              {integration.enabled && integration.config && (
                                <div className="space-y-2 pt-3 border-t">
                                  <p className="text-xs font-semibold mb-2">Konfiguration:</p>

                                  {integration.config.provider !== undefined && (
                                    <div>
                                      <Label className="text-xs">Anbieter</Label>
                                      <Input
                                        value={integration.config.provider}
                                        onChange={(e) => updateConfig(integration.id, "provider", e.target.value)}
                                        placeholder="z.B. Gmail, Outlook, PayPal..."
                                        className="h-8 text-xs"
                                      />
                                    </div>
                                  )}

                                  {integration.config.apiKey !== undefined && (
                                    <div>
                                      <Label className="text-xs">API-Key / Zugangsdaten</Label>
                                      <Input
                                        type="password"
                                        value={integration.config.apiKey}
                                        onChange={(e) => updateConfig(integration.id, "apiKey", e.target.value)}
                                        placeholder="Wird später konfiguriert"
                                        className="h-8 text-xs"
                                      />
                                    </div>
                                  )}

                                  {integration.config.accountId !== undefined && (
                                    <div>
                                      <Label className="text-xs">Konto-ID / Mandant</Label>
                                      <Input
                                        value={integration.config.accountId}
                                        onChange={(e) => updateConfig(integration.id, "accountId", e.target.value)}
                                        placeholder="z.B. Beraternummer"
                                        className="h-8 text-xs"
                                      />
                                    </div>
                                  )}

                                  {integration.config.notes !== undefined && (
                                    <div>
                                      <Label className="text-xs">Notizen / Details</Label>
                                      <Input
                                        value={integration.config.notes}
                                        onChange={(e) => updateConfig(integration.id, "notes", e.target.value)}
                                        placeholder="Weitere Informationen..."
                                        className="h-8 text-xs"
                                      />
                                    </div>
                                  )}
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

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-yellow-800">
              <strong>Hinweis:</strong> Zugangsdaten und API-Keys werden sicher während der Implementierung konfiguriert. 
              Hier genügt zunächst die Angabe, welche Integrationen gewünscht sind.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

