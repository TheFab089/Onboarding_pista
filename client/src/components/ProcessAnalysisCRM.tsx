import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb } from "lucide-react";

interface ProcessStep {
  id: string;
  name: string;
  description: string;
  benefit: string;
  icon: string;
}

interface ProcessAnalysisData {
  processId: string;
  currentState: string;
  painPoints: string;
  desiredState: string;
  priority: "low" | "medium" | "high";
}

interface ProcessAnalysisCRMProps {
  processes: ProcessStep[];
  projectTypes: string[];
  onComplete: (analyses: ProcessAnalysisData[], projectTypeData: any[]) => void;
  onBack: () => void;
}

const PROJECT_TYPE_QUESTIONS = {
  sanitaer: {
    name: "Sanitär-Projekte",
    icon: "🚿",
    questions: [
      { id: "typical_duration", label: "Typische Projektdauer", placeholder: "z.B. 2-5 Tage für Badumbau" },
      { id: "team_size", label: "Anzahl Mitarbeiter pro Projekt", placeholder: "z.B. 2 Monteure" },
      { id: "materials", label: "Hauptmaterialien", placeholder: "z.B. Fliesen, Sanitärkeramik, Armaturen" },
      { id: "challenges", label: "Häufige Herausforderungen", placeholder: "z.B. Altbau-Probleme, Lieferzeiten" }
    ]
  },
  heizung: {
    name: "Heizungs-Projekte",
    icon: "🔥",
    questions: [
      { id: "typical_duration", label: "Typische Projektdauer", placeholder: "z.B. 3-7 Tage für Heizungstausch" },
      { id: "team_size", label: "Anzahl Mitarbeiter pro Projekt", placeholder: "z.B. 2-3 Techniker" },
      { id: "systems", label: "Heizungssysteme", placeholder: "z.B. Wärmepumpe, Gas, Öl, Pellets" },
      { id: "challenges", label: "Häufige Herausforderungen", placeholder: "z.B. Förderanträge, Genehmigungen" }
    ]
  }
};

export default function ProcessAnalysisCRM({ 
  processes, 
  projectTypes,
  onComplete, 
  onBack 
}: ProcessAnalysisCRMProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [analyses, setAnalyses] = useState<ProcessAnalysisData[]>(
    processes.map(p => ({
      processId: p.id,
      currentState: "",
      painPoints: "",
      desiredState: "",
      priority: "medium" as const
    }))
  );

  const [projectTypeData, setProjectTypeData] = useState<any[]>(
    projectTypes.map(typeId => ({
      typeId,
      data: {}
    }))
  );

  const [showingProjectTypes, setShowingProjectTypes] = useState(false);
  const [currentProjectTypeIndex, setCurrentProjectTypeIndex] = useState(0);

  const currentProcess = processes[currentIndex];
  const currentAnalysis = analyses[currentIndex];
  const totalSteps = processes.length + projectTypes.length;
  const currentStep = showingProjectTypes 
    ? processes.length + currentProjectTypeIndex + 1
    : currentIndex + 1;

  const updateAnalysis = (field: keyof ProcessAnalysisData, value: string) => {
    const newAnalyses = [...analyses];
    newAnalyses[currentIndex] = {
      ...newAnalyses[currentIndex],
      [field]: value
    };
    setAnalyses(newAnalyses);
  };

  const updateProjectTypeData = (questionId: string, value: string) => {
    const newData = [...projectTypeData];
    newData[currentProjectTypeIndex] = {
      ...newData[currentProjectTypeIndex],
      data: {
        ...newData[currentProjectTypeIndex].data,
        [questionId]: value
      }
    };
    setProjectTypeData(newData);
  };

  const handleNext = () => {
    if (!showingProjectTypes) {
      if (currentIndex < processes.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (projectTypes.length > 0) {
        setShowingProjectTypes(true);
        setCurrentProjectTypeIndex(0);
      } else {
        onComplete(analyses, projectTypeData);
      }
    } else {
      if (currentProjectTypeIndex < projectTypes.length - 1) {
        setCurrentProjectTypeIndex(currentProjectTypeIndex + 1);
      } else {
        onComplete(analyses, projectTypeData);
      }
    }
  };

  const handlePrevious = () => {
    if (showingProjectTypes) {
      if (currentProjectTypeIndex > 0) {
        setCurrentProjectTypeIndex(currentProjectTypeIndex - 1);
      } else {
        setShowingProjectTypes(false);
        setCurrentIndex(processes.length - 1);
      }
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const canProceed = () => {
    if (showingProjectTypes) {
      return true; // Project type questions are optional
    }
    return currentAnalysis.currentState.trim().length > 0;
  };

  const progress = (currentStep / totalSteps) * 100;

  if (showingProjectTypes) {
    const typeId = projectTypes[currentProjectTypeIndex];
    const typeConfig = PROJECT_TYPE_QUESTIONS[typeId as keyof typeof PROJECT_TYPE_QUESTIONS];
    const currentData = projectTypeData[currentProjectTypeIndex];

    return (
      <div className="space-y-6">
        <div>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">
            Schritt {currentStep} von {totalSteps} - Projekt-Typ Details
          </p>
        </div>

        <Card className="border-2 border-accent">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{typeConfig.icon}</span>
              <div>
                <CardTitle className="text-2xl">{typeConfig.name}</CardTitle>
                <CardDescription>
                  Bitte geben Sie Details zu diesem Projekt-Typ an
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {typeConfig.questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <Label>{question.label}</Label>
                <Textarea
                  value={currentData.data[question.id] || ""}
                  onChange={(e) => updateProjectTypeData(question.id, e.target.value)}
                  placeholder={question.placeholder}
                  rows={2}
                />
              </div>
            ))}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  <strong>Tipp:</strong> Je detaillierter Ihre Angaben, desto besser können wir Odoo auf Ihre Bedürfnisse anpassen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>
          <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
            {currentProjectTypeIndex === projectTypes.length - 1 ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Analyse abschließen
              </>
            ) : (
              <>
                Weiter
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Progress value={progress} className="h-2 mb-2" />
        <p className="text-sm text-muted-foreground">
          Schritt {currentStep} von {totalSteps} - CRM-Phase analysieren
        </p>
      </div>

      <Card className="border-2 border-accent">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">CRM-Phase {currentIndex + 1}</Badge>
            <span className="text-3xl">{currentProcess.icon}</span>
          </div>
          <CardTitle className="text-2xl">{currentProcess.name}</CardTitle>
          <CardDescription>{currentProcess.description}</CardDescription>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
            <p className="text-sm text-green-800">
              <strong>Digitalisierungs-Nutzen:</strong> {currentProcess.benefit}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Wie läuft diese Phase aktuell ab? *
            </Label>
            <Textarea
              value={currentAnalysis.currentState}
              onChange={(e) => updateAnalysis("currentState", e.target.value)}
              placeholder="Beschreiben Sie den aktuellen Prozess..."
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              z.B. "Anfragen kommen per Telefon und E-Mail, werden in Excel erfasst"
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Was sind die größten Probleme/Zeitfresser?
            </Label>
            <Textarea
              value={currentAnalysis.painPoints}
              onChange={(e) => updateAnalysis("painPoints", e.target.value)}
              placeholder="Welche Schwierigkeiten gibt es?"
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              z.B. "Anfragen gehen verloren, keine Nachverfolgung, doppelte Dateneingabe"
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Wie sollte es idealerweise funktionieren?
            </Label>
            <Textarea
              value={currentAnalysis.desiredState}
              onChange={(e) => updateAnalysis("desiredState", e.target.value)}
              placeholder="Ihr Wunsch-Prozess..."
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              z.B. "Automatische Erfassung, Erinnerungen für Follow-ups, zentrale Übersicht"
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Priorität</Label>
            <Select
              value={currentAnalysis.priority}
              onValueChange={(value: "low" | "medium" | "high") => updateAnalysis("priority", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Niedrig - kann warten</SelectItem>
                <SelectItem value="medium">Mittel - wichtig</SelectItem>
                <SelectItem value="high">Hoch - sehr dringend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                <strong>Tipp:</strong> Seien Sie ehrlich bei den Problemen - nur so können wir die beste Lösung für Sie finden!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={currentIndex === 0 ? onBack : handlePrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {currentIndex === 0 ? "Zurück zur Auswahl" : "Vorherige Phase"}
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!canProceed()}
          className="bg-primary hover:bg-primary/90"
        >
          {currentIndex === processes.length - 1 && projectTypes.length === 0 ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Analyse abschließen
            </>
          ) : (
            <>
              Nächste Phase
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

