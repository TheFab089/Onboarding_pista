import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

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

interface ProcessAnalysisProps {
  processes: ProcessStep[];
  onComplete: (analyses: ProcessAnalysisData[]) => void;
  onBack: () => void;
}

export default function ProcessAnalysis({ processes, onComplete, onBack }: ProcessAnalysisProps) {
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

  const currentProcess = processes[currentIndex];
  const currentAnalysis = analyses[currentIndex];
  const progress = ((currentIndex + 1) / processes.length) * 100;

  const updateCurrentAnalysis = (field: keyof ProcessAnalysisData, value: string) => {
    const newAnalyses = [...analyses];
    newAnalyses[currentIndex] = {
      ...newAnalyses[currentIndex],
      [field]: value
    };
    setAnalyses(newAnalyses);
  };

  const handleNext = () => {
    if (currentIndex < processes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(analyses);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const isCurrentStepValid = currentAnalysis.currentState.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="border-2 border-accent/20 bg-accent/5">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Prozessanalyse</h3>
                <p className="text-sm text-muted-foreground">
                  Schritt {currentIndex + 1} von {processes.length}
                </p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {currentProcess.icon}
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Current Process Card */}
      <Card className="border-2 border-accent">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-2xl flex-shrink-0">
              {currentProcess.icon}
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{currentProcess.name}</CardTitle>
              <CardDescription className="text-base">
                {currentProcess.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Benefit Highlight */}
          <div className="bg-accent/10 border-l-4 border-accent p-4 rounded">
            <p className="font-semibold text-accent mb-1">💡 Digitalisierungs-Nutzen:</p>
            <p className="text-sm">{currentProcess.benefit}</p>
          </div>

          {/* Analysis Questions */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentState" className="text-base font-semibold">
                1. Wie läuft dieser Prozess aktuell bei Ihnen ab? *
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Beschreiben Sie den IST-Zustand: Welche Tools nutzen Sie? Wie viel Zeit benötigen Sie? Wer ist beteiligt?
              </p>
              <Textarea
                id="currentState"
                value={currentAnalysis.currentState}
                onChange={(e) => updateCurrentAnalysis("currentState", e.target.value)}
                placeholder={`Beispiel: Kundenanfragen kommen per Telefon rein, ich notiere sie handschriftlich in einem Notizbuch und übertrage sie später in Excel...`}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="painPoints" className="text-base font-semibold">
                2. Was läuft nicht optimal? Wo verlieren Sie Zeit oder Geld?
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Seien Sie ehrlich: Welche Probleme, Fehler oder Ineffizienzen gibt es?
              </p>
              <Textarea
                id="painPoints"
                value={currentAnalysis.painPoints}
                onChange={(e) => updateCurrentAnalysis("painPoints", e.target.value)}
                placeholder={`Beispiel: Manchmal vergesse ich Anfragen zu übertragen, doppelte Eingaben kosten Zeit, keine Übersicht über offene Anfragen...`}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desiredState" className="text-base font-semibold">
                3. Wie sollte der Prozess idealerweise ablaufen?
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Träumen Sie: Was wäre die perfekte Lösung für diesen Prozess?
              </p>
              <Textarea
                id="desiredState"
                value={currentAnalysis.desiredState}
                onChange={(e) => updateCurrentAnalysis("desiredState", e.target.value)}
                placeholder={`Beispiel: Kunde füllt Online-Formular aus, Anfrage landet automatisch im System, ich sehe sofort alle Details und kann direkt ein Angebot erstellen...`}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-base font-semibold">
                4. Wie dringend ist die Verbesserung dieses Prozesses?
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Helfen Sie uns zu priorisieren: Was sollten wir zuerst angehen?
              </p>
              <Select
                value={currentAnalysis.priority}
                onValueChange={(value: "low" | "medium" | "high") => 
                  updateCurrentAnalysis("priority", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    Niedrig - Kann warten, ist aber nice to have
                  </SelectItem>
                  <SelectItem value="medium">
                    Mittel - Sollte mittelfristig verbessert werden
                  </SelectItem>
                  <SelectItem value="high">
                    Hoch - Dringend, kostet uns aktuell viel Zeit/Geld
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={currentIndex === 0 ? onBack : handlePrevious}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentIndex === 0 ? "Zurück zur Auswahl" : "Vorheriger Prozess"}
            </Button>

            <div className="flex items-center gap-2">
              {processes.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-accent w-8"
                      : index < currentIndex
                      ? "bg-accent/50"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={!isCurrentStepValid}
              className="bg-accent hover:bg-accent/90"
            >
              {currentIndex === processes.length - 1 ? (
                <>
                  Analyse abschließen
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Nächster Prozess
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💬</span>
            <div>
              <h4 className="font-semibold mb-1">Tipp für bessere Ergebnisse</h4>
              <p className="text-sm text-muted-foreground">
                Je detaillierter Sie Ihre Prozesse beschreiben, desto präziser können wir Ihnen helfen. 
                Denken Sie an konkrete Beispiele aus Ihrem Alltag. Es gibt keine falschen Antworten!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

