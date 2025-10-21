import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, CheckCircle2, Target, FileText, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProcessStep {
  id: string;
  name: string;
  description: string;
  benefit: string;
  icon: string;
  isCustom?: boolean;
}

interface ProcessDiagramCRMProps {
  onConfirm: (selectedProcesses: ProcessStep[], projectTypes: string[]) => void;
}

interface CustomProjectType {
  id: string;
  name: string;
  icon: string;
  description: string;
  stages: { name: string; description: string }[];
  isCustom?: boolean;
}

const CRM_STAGES: ProcessStep[] = [
  {
    id: "lead",
    name: "Lead / Anfrage",
    description: "Erste Kontaktaufnahme durch potenzielle Kunden",
    benefit: "Automatische Lead-Erfassung aus Website, Telefon, E-Mail",
    icon: "📞"
  },
  {
    id: "qualification",
    name: "Qualifizierung",
    description: "Bewertung der Anfrage und Kundenbedürfnisse",
    benefit: "Scoring-System zur Priorisierung vielversprechender Leads",
    icon: "🎯"
  },
  {
    id: "quote",
    name: "Angebotserstellung",
    description: "Erstellung und Versand von Angeboten",
    benefit: "Vorlagen für schnelle, professionelle Angebote",
    icon: "📄"
  },
  {
    id: "negotiation",
    name: "Verhandlung",
    description: "Abstimmung von Details und Konditionen",
    benefit: "Nachverfolgung aller Kommunikation an einem Ort",
    icon: "🤝"
  },
  {
    id: "won",
    name: "Auftrag gewonnen",
    description: "Kunde hat zugesagt, Projekt startet",
    benefit: "Automatische Projekterstellung aus gewonnenem Deal",
    icon: "✅"
  },
  {
    id: "aftercare",
    name: "Nachbetreuung",
    description: "Follow-up, Kundenzufriedenheit, Wartungsverträge",
    benefit: "Erinnerungen für Wartungen und Cross-Selling",
    icon: "🔄"
  }
];

const PROJECT_TYPES: CustomProjectType[] = [
  {
    id: "sanitaer",
    name: "Sanitär-Projekte",
    icon: "🚿",
    description: "Badumbau, Reparaturen, Installationen",
    isCustom: false,
    stages: [
      { name: "Bestandsaufnahme", description: "Vor-Ort-Termin, Maße nehmen" },
      { name: "Planung", description: "Materialauswahl, Zeitplanung" },
      { name: "Material bestellen", description: "Lieferantenbestellung" },
      { name: "Ausführung", description: "Montage, Installation" },
      { name: "Abnahme", description: "Kunde prüft Ergebnis" },
      { name: "Abrechnung", description: "Rechnung erstellen" }
    ]
  },
  {
    id: "heizung",
    name: "Heizungs-Projekte",
    icon: "🔥",
    description: "Heizungstausch, Wartung, Modernisierung",
    isCustom: false,
    stages: [
      { name: "Beratung", description: "Heizlastberechnung, System-Empfehlung" },
      { name: "Angebot", description: "Detailliertes Angebot mit Förderung" },
      { name: "Genehmigung", description: "Förderantrag, Bauamt" },
      { name: "Beschaffung", description: "Heizung bestellen" },
      { name: "Installation", description: "Alte Heizung raus, neue rein" },
      { name: "Inbetriebnahme", description: "System einstellen, Einweisung" },
      { name: "Dokumentation", description: "Übergabe Unterlagen, Rechnung" }
    ]
  }
];

export default function ProcessDiagramCRM({ onConfirm }: ProcessDiagramCRMProps) {
  const [selectedCRM, setSelectedCRM] = useState<string[]>(CRM_STAGES.map(s => s.id));
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  const [customCRMPhases, setCustomCRMPhases] = useState<ProcessStep[]>([]);
  const [customProjectTypes, setCustomProjectTypes] = useState<CustomProjectType[]>([]);
  const [newCRMName, setNewCRMName] = useState("");
  const [newCRMDesc, setNewCRMDesc] = useState("");
  const [newCRMBenefit, setNewCRMBenefit] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectIcon, setNewProjectIcon] = useState("📋");
  const [showAddCRM, setShowAddCRM] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);

  const addCustomCRMPhase = () => {
    if (newCRMName.trim()) {
      const newPhase: ProcessStep = {
        id: `custom-crm-${Date.now()}`,
        name: newCRMName,
        description: newCRMDesc,
        benefit: newCRMBenefit,
        icon: "⭐",
        isCustom: true
      };
      setCustomCRMPhases([...customCRMPhases, newPhase]);
      setSelectedCRM([...selectedCRM, newPhase.id]);
      setNewCRMName("");
      setNewCRMDesc("");
      setNewCRMBenefit("");
      setShowAddCRM(false);
    }
  };

  const removeCustomCRMPhase = (id: string) => {
    setCustomCRMPhases(customCRMPhases.filter(p => p.id !== id));
    setSelectedCRM(selectedCRM.filter(x => x !== id));
  };

  const addCustomProjectType = () => {
    if (newProjectName.trim()) {
      const newType: CustomProjectType = {
        id: `custom-project-${Date.now()}`,
        name: newProjectName,
        icon: newProjectIcon,
        description: newProjectDesc,
        stages: [
          { name: "Planung", description: "Projektplanung" },
          { name: "Durchführung", description: "Umsetzung" },
          { name: "Abschluss", description: "Projektabschluss" }
        ],
        isCustom: true
      };
      setCustomProjectTypes([...customProjectTypes, newType]);
      setSelectedProjectTypes([...selectedProjectTypes, newType.id]);
      setNewProjectName("");
      setNewProjectDesc("");
      setNewProjectIcon("📋");
      setShowAddProject(false);
    }
  };

  const removeCustomProjectType = (id: string) => {
    setCustomProjectTypes(customProjectTypes.filter(p => p.id !== id));
    setSelectedProjectTypes(selectedProjectTypes.filter(x => x !== id));
  };

  const toggleCRM = (id: string) => {
    setSelectedCRM(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleProjectType = (id: string) => {
    setSelectedProjectTypes(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selectedProcesses = [
      ...CRM_STAGES.filter(stage => selectedCRM.includes(stage.id)),
      ...customCRMPhases.filter(phase => selectedCRM.includes(phase.id))
    ];
    onConfirm(selectedProcesses, selectedProjectTypes);
  };

  const allCRMPhases = [...CRM_STAGES, ...customCRMPhases];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-accent" />
            CRM-Phasen auswählen
          </CardTitle>
          <CardDescription>
            Welche Phasen durchläuft ein Kunde von der ersten Anfrage bis zum Auftrag?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allCRMPhases.map((stage, index) => (
              <div key={stage.id}>
                <Card
                  className={`cursor-pointer transition-all border-2 ${
                    selectedCRM.includes(stage.id)
                      ? "border-accent bg-accent/5"
                      : "border-gray-200 hover:border-accent/50"
                  }`}
                  onClick={() => toggleCRM(stage.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{stage.icon}</span>
                        <Checkbox
                          checked={selectedCRM.includes(stage.id)}
                          onCheckedChange={() => toggleCRM(stage.id)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        {stage.isCustom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCustomCRMPhase(stage.id);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        <Badge variant="outline" className="text-xs">
                          Phase {index + 1}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="font-semibold mb-1">{stage.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {stage.description}
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded p-2 mt-2">
                      <p className="text-xs text-green-800">
                        <strong>Nutzen:</strong> {stage.benefit}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                {index < allCRMPhases.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {showAddCRM && (
              <Card className="border-2 border-dashed border-accent col-span-full">
                <CardContent className="p-4 space-y-3">
                  <div>
                    <label className="text-sm font-medium">Phase Name *</label>
                    <Input
                      placeholder="z.B. Beschwerde-Management"
                      value={newCRMName}
                      onChange={(e) => setNewCRMName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Beschreibung</label>
                    <Textarea
                      placeholder="Beschreiben Sie diese Phase..."
                      value={newCRMDesc}
                      onChange={(e) => setNewCRMDesc(e.target.value)}
                      className="mt-1 text-xs"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nutzen / Benefit</label>
                    <Textarea
                      placeholder="Was ist der Vorteil dieser Phase?"
                      value={newCRMBenefit}
                      onChange={(e) => setNewCRMBenefit(e.target.value)}
                      className="mt-1 text-xs"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addCustomCRMPhase} size="sm" className="flex-1">
                      <Plus className="h-4 w-4 mr-1" />
                      Hinzufügen
                    </Button>
                    <Button onClick={() => setShowAddCRM(false)} size="sm" variant="outline" className="flex-1">
                      Abbrechen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {!showAddCRM && (
              <Button
                onClick={() => setShowAddCRM(true)}
                variant="outline"
                className="w-full border-dashed border-2 col-span-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Eigene Phase hinzufügen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-accent" />
            Projekt-Typen auswählen
          </CardTitle>
          <CardDescription>
            Welche Arten von Projekten führen Sie durch? Jeder Typ hat eigene Phasen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {[...PROJECT_TYPES, ...customProjectTypes].map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all border-2 ${
                  selectedProjectTypes.includes(type.id)
                    ? "border-accent bg-accent/5"
                    : "border-gray-200 hover:border-accent/50"
                }`}
                onClick={() => toggleProjectType(type.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{type.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{type.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {type.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {type.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCustomProjectType(type.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      <Checkbox
                        checked={selectedProjectTypes.includes(type.id)}
                        onCheckedChange={() => toggleProjectType(type.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold mb-2">Typische Phasen:</p>
                    {type.stages.map((stage, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                          {idx + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{stage.name}</p>
                          <p className="text-muted-foreground">{stage.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {showAddProject && (
              <Card className="border-2 border-dashed border-accent col-span-full">
                <CardContent className="p-4 space-y-3">
                  <div>
                    <label className="text-sm font-medium">Projekt-Typ Name *</label>
                    <Input
                      placeholder="z.B. Wartungsarbeiten"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Icon (Emoji)</label>
                    <Input
                      placeholder="z.B. 🔧"
                      value={newProjectIcon}
                      onChange={(e) => setNewProjectIcon(e.target.value)}
                      className="mt-1 text-2xl"
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Beschreibung</label>
                    <Textarea
                      placeholder="Beschreiben Sie diesen Projekt-Typ..."
                      value={newProjectDesc}
                      onChange={(e) => setNewProjectDesc(e.target.value)}
                      className="mt-1 text-xs"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addCustomProjectType} size="sm" className="flex-1">
                      <Plus className="h-4 w-4 mr-1" />
                      Hinzufügen
                    </Button>
                    <Button onClick={() => setShowAddProject(false)} size="sm" variant="outline" className="flex-1">
                      Abbrechen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {!showAddProject && (
              <Button
                onClick={() => setShowAddProject(true)}
                variant="outline"
                className="w-full border-dashed border-2 col-span-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Eigenen Projekt-Typ hinzufügen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleConfirm}
          disabled={selectedCRM.length === 0 && selectedProjectTypes.length === 0}
          className="bg-primary hover:bg-primary/90"
          size="lg"
        >
          <CheckCircle2 className="mr-2 h-5 w-5" />
          Auswahl bestätigen und fortfahren
        </Button>
      </div>
    </div>
  );
}

