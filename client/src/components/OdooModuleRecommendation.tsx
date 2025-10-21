import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Package, Users, Calendar, FileText, DollarSign, Truck, Settings, Mail, BarChart } from "lucide-react";

interface OdooModule {
  id: string;
  name: string;
  icon: any;
  description: string;
  benefits: string[];
  requiredFor: string[];
  recommended: boolean;
  priority: "essential" | "recommended" | "optional";
}

interface OdooModuleRecommendationProps {
  selectedCRMStages: string[];
  selectedProjectTypes: string[];
}

const ODOO_MODULES: OdooModule[] = [
  {
    id: "crm",
    name: "CRM",
    icon: Users,
    description: "Kundenbeziehungsmanagement - Leads, Opportunities, Pipeline",
    benefits: [
      "Zentrale Lead-Verwaltung",
      "Automatische Lead-Zuweisung",
      "Pipeline-Visualisierung",
      "E-Mail-Integration"
    ],
    requiredFor: ["lead", "qualification", "quote", "negotiation"],
    recommended: true,
    priority: "essential"
  },
  {
    id: "sales",
    name: "Verkauf",
    icon: DollarSign,
    description: "Angebote, Aufträge, Kundenverträge",
    benefits: [
      "Professionelle Angebote in Sekunden",
      "Vorlagen für wiederkehrende Angebote",
      "Automatische Auftragsbestätigung",
      "Upselling-Vorschläge"
    ],
    requiredFor: ["quote", "won"],
    recommended: true,
    priority: "essential"
  },
  {
    id: "project",
    name: "Projekt",
    icon: Package,
    description: "Projektmanagement mit Tasks, Stages, Gantt-Charts",
    benefits: [
      "Projekt-Templates für Sanitär/Heizung",
      "Aufgabenverwaltung",
      "Fortschrittsverfolgung",
      "Ressourcenplanung"
    ],
    requiredFor: ["sanitaer", "heizung"],
    recommended: true,
    priority: "essential"
  },
  {
    id: "timesheet",
    name: "Zeiterfassung",
    icon: Calendar,
    description: "Arbeitszeiterfassung pro Projekt und Aufgabe",
    benefits: [
      "Mobile Zeiterfassung für Monteure",
      "Automatische Abrechnung",
      "Überstunden-Tracking",
      "Projekt-Rentabilität"
    ],
    requiredFor: ["sanitaer", "heizung"],
    recommended: true,
    priority: "essential"
  },
  {
    id: "documents",
    name: "Dokumente",
    icon: FileText,
    description: "Zentrale Dokumentenverwaltung mit Workflows",
    benefits: [
      "Alle Dokumente an einem Ort",
      "Automatische Zuordnung zu Projekten",
      "Versionierung",
      "Digitale Unterschriften"
    ],
    requiredFor: [],
    recommended: true,
    priority: "recommended"
  },
  {
    id: "inventory",
    name: "Lager",
    icon: Truck,
    description: "Lagerverwaltung, Materialverbrauch, Bestellungen",
    benefits: [
      "Echtzeit-Lagerbestand",
      "Automatische Nachbestellung",
      "Materialverbrauch pro Projekt",
      "Lieferanten-Integration"
    ],
    requiredFor: [],
    recommended: false,
    priority: "optional"
  },
  {
    id: "accounting",
    name: "Buchhaltung",
    icon: BarChart,
    description: "Rechnungsstellung, Zahlungen, Finanzberichte",
    benefits: [
      "Automatische Rechnungserstellung",
      "DATEV-Export",
      "Zahlungserinnerungen",
      "Finanz-Dashboards"
    ],
    requiredFor: [],
    recommended: true,
    priority: "recommended"
  },
  {
    id: "helpdesk",
    name: "Helpdesk / Wartung",
    icon: Settings,
    description: "Ticket-System für Wartungsanfragen und Support",
    benefits: [
      "Kunden-Portal für Anfragen",
      "Wartungsverträge verwalten",
      "SLA-Tracking",
      "Automatische Erinnerungen"
    ],
    requiredFor: ["aftercare"],
    recommended: false,
    priority: "optional"
  },
  {
    id: "email_marketing",
    name: "E-Mail Marketing",
    icon: Mail,
    description: "Newsletter, Kampagnen, Automatisierung",
    benefits: [
      "Wartungserinnerungen automatisch",
      "Saisonale Kampagnen (Heizungs-Check)",
      "Kundensegmentierung",
      "A/B-Testing"
    ],
    requiredFor: ["aftercare"],
    recommended: false,
    priority: "optional"
  }
];

export default function OdooModuleRecommendation({ 
  selectedCRMStages, 
  selectedProjectTypes 
}: OdooModuleRecommendationProps) {
  
  const getRecommendedModules = () => {
    return ODOO_MODULES.map(module => {
      const isRequired = module.requiredFor.some(req => 
        selectedCRMStages.includes(req) || selectedProjectTypes.includes(req)
      );
      
      return {
        ...module,
        recommended: isRequired || module.recommended
      };
    }).sort((a, b) => {
      const priorityOrder = { essential: 0, recommended: 1, optional: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const recommendedModules = getRecommendedModules();
  const essentialModules = recommendedModules.filter(m => m.priority === "essential");
  const recommendedCount = recommendedModules.filter(m => m.priority === "recommended").length;
  const optionalCount = recommendedModules.filter(m => m.priority === "optional").length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "essential": return "bg-red-100 text-red-800 border-red-300";
      case "recommended": return "bg-blue-100 text-blue-800 border-blue-300";
      case "optional": return "bg-gray-100 text-gray-800 border-gray-300";
      default: return "";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "essential": return "Essentiell";
      case "recommended": return "Empfohlen";
      case "optional": return "Optional";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-accent bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6 text-accent" />
            Empfohlene Odoo-Module
          </CardTitle>
          <CardDescription>
            Basierend auf Ihren Anforderungen empfehlen wir folgende Module
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex-1">
              <p className="text-sm font-semibold text-red-800">
                {essentialModules.length} Essentiell
              </p>
              <p className="text-xs text-red-600">Grundlage der Implementierung</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex-1">
              <p className="text-sm font-semibold text-blue-800">
                {recommendedCount} Empfohlen
              </p>
              <p className="text-xs text-blue-600">Erhöht den Nutzen deutlich</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex-1">
              <p className="text-sm font-semibold text-gray-800">
                {optionalCount} Optional
              </p>
              <p className="text-xs text-gray-600">Kann später hinzugefügt werden</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 md:grid-cols-2">
            {recommendedModules.map((module) => {
              const Icon = module.icon;
              return (
                <Card 
                  key={module.id}
                  className={`border-2 ${
                    module.priority === "essential" 
                      ? "border-red-300 bg-red-50/50" 
                      : module.priority === "recommended"
                      ? "border-blue-300 bg-blue-50/50"
                      : "border-gray-200"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          module.priority === "essential" 
                            ? "bg-red-100" 
                            : module.priority === "recommended"
                            ? "bg-blue-100"
                            : "bg-gray-100"
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            module.priority === "essential" 
                              ? "text-red-600" 
                              : module.priority === "recommended"
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`} />
                        </div>
                        <div>
                          <CardTitle className="text-base">{module.name}</CardTitle>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(module.priority)}>
                        {getPriorityLabel(module.priority)}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs mt-2">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold mb-2">Vorteile:</p>
                      {module.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

