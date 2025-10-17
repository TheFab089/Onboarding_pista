import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";

interface ProcessStep {
  id: string;
  name: string;
  description: string;
  benefit: string;
  icon: string;
}

const DEFAULT_PROCESSES: ProcessStep[] = [
  {
    id: "customer-inquiry",
    name: "Kundenanfrage",
    description: "Kunde kontaktiert Sie per Telefon, E-Mail oder persönlich",
    benefit: "Schnellere Reaktionszeit durch digitale Erfassung",
    icon: "📞"
  },
  {
    id: "quote-creation",
    name: "Angebotserstellung",
    description: "Erstellung eines Kostenvoranschlags für den Kunden",
    benefit: "Automatisierte Kalkulation spart bis zu 60% Zeit",
    icon: "📝"
  },
  {
    id: "order-confirmation",
    name: "Auftragsbestätigung",
    description: "Kunde akzeptiert Angebot und Auftrag wird bestätigt",
    benefit: "Digitale Signatur ermöglicht sofortigen Start",
    icon: "✅"
  },
  {
    id: "scheduling",
    name: "Terminplanung",
    description: "Einsatzplanung und Ressourcenzuteilung",
    benefit: "Optimierte Routenplanung reduziert Fahrtzeiten um 30%",
    icon: "📅"
  },
  {
    id: "execution",
    name: "Durchführung",
    description: "Ausführung der Sanitär- oder Heizungsarbeiten vor Ort",
    benefit: "Mobile Dokumentation mit Fotos direkt vom Einsatzort",
    icon: "🔧"
  },
  {
    id: "documentation",
    name: "Dokumentation",
    description: "Erfassung der durchgeführten Arbeiten und Materialien",
    benefit: "Automatische Übernahme in Rechnung und Archiv",
    icon: "📋"
  },
  {
    id: "invoicing",
    name: "Rechnungsstellung",
    description: "Erstellung und Versand der Rechnung an den Kunden",
    benefit: "Automatisierte Rechnungserstellung aus Auftragsdaten",
    icon: "💶"
  },
  {
    id: "payment",
    name: "Zahlungseingang",
    description: "Überwachung und Buchung des Zahlungseingangs",
    benefit: "Automatisches Mahnwesen bei Zahlungsverzug",
    icon: "💳"
  }
];

interface ProcessDiagramProps {
  onProcessesConfirmed: (processes: ProcessStep[]) => void;
}

export default function ProcessDiagram({ onProcessesConfirmed }: ProcessDiagramProps) {
  const [selectedProcesses, setSelectedProcesses] = useState<Set<string>>(
    new Set(DEFAULT_PROCESSES.map(p => p.id))
  );
  const [currentStep, setCurrentStep] = useState(0);

  const toggleProcess = (id: string) => {
    const newSelected = new Set(selectedProcesses);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProcesses(newSelected);
  };

  const handleConfirm = () => {
    const confirmed = DEFAULT_PROCESSES.filter(p => selectedProcesses.has(p.id));
    onProcessesConfirmed(confirmed);
  };

  const selectedCount = selectedProcesses.size;

  return (
    <div className="space-y-6">
      <Card className="border-2 border-accent/20 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Ihr typischer Geschäftsprozess
          </CardTitle>
          <CardDescription className="text-base">
            Wir haben einen typischen Prozessablauf für Sanitär- und Heizungsbetriebe vorbereitet. 
            Wählen Sie die Schritte aus, die auf Ihr Unternehmen zutreffen, oder passen Sie sie an.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">Ausgewählte Prozessschritte:</p>
              <Badge variant={selectedCount > 0 ? "default" : "secondary"}>
                {selectedCount} von {DEFAULT_PROCESSES.length}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Klicken Sie auf die Schritte unten, um sie auszuwählen oder abzuwählen.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        {/* Process Flow Visualization */}
        <div className="space-y-4">
          {DEFAULT_PROCESSES.map((process, index) => {
            const isSelected = selectedProcesses.has(process.id);
            const isActive = index === currentStep;
            
            return (
              <div key={process.id} className="relative">
                {/* Connecting Line */}
                {index < DEFAULT_PROCESSES.length - 1 && (
                  <div 
                    className={`absolute left-6 top-16 w-0.5 h-12 ${
                      isSelected ? 'bg-accent' : 'bg-gray-300'
                    }`}
                    style={{ zIndex: 0 }}
                  />
                )}
                
                <Card 
                  className={`cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'border-2 border-accent shadow-md hover:shadow-lg' 
                      : 'border-2 border-gray-200 opacity-60 hover:opacity-80'
                  } ${isActive ? 'ring-2 ring-accent/50' : ''}`}
                  onClick={() => toggleProcess(process.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Step Number & Icon */}
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                          isSelected ? 'bg-accent/10' : 'bg-gray-100'
                        }`}>
                          {process.icon}
                        </div>
                        <Badge variant={isSelected ? "default" : "outline"} className="text-xs">
                          {index + 1}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-lg">{process.name}</h3>
                          {isSelected ? (
                            <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {process.description}
                        </p>
                        
                        {isSelected && (
                          <div className="bg-accent/10 border-l-4 border-accent p-3 rounded">
                            <p className="text-sm font-semibold text-accent mb-1">
                              💡 Digitalisierungs-Nutzen:
                            </p>
                            <p className="text-sm">
                              {process.benefit}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Arrow for selected items */}
                      {isSelected && index < DEFAULT_PROCESSES.length - 1 && (
                        <div className="flex-shrink-0 text-accent">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Card */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle>Zusammenfassung</CardTitle>
          <CardDescription>
            Sie haben {selectedCount} Prozessschritte ausgewählt. Diese bilden die Grundlage für Ihre Digitalisierungsstrategie.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Warum ist das wichtig?</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>Wir identifizieren Engpässe und Optimierungspotenziale in Ihrem Workflow</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>Jeder Prozessschritt wird auf Digitalisierungsmöglichkeiten analysiert</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>Sie erhalten konkrete Empfehlungen für Zeit- und Kosteneinsparungen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>Wir priorisieren Quick Wins für schnelle Erfolge</span>
                </li>
              </ul>
            </div>

            <Button 
              onClick={handleConfirm}
              className="w-full bg-accent hover:bg-accent/90"
              disabled={selectedCount === 0}
              size="lg"
            >
              {selectedCount === 0 
                ? "Bitte wählen Sie mindestens einen Prozess aus" 
                : `${selectedCount} Prozess${selectedCount > 1 ? 'e' : ''} bestätigen und weiter`
              }
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

