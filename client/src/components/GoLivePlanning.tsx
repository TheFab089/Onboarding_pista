import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Rocket, Calendar, Users, Database, GraduationCap, AlertCircle } from "lucide-react";

interface GoLivePlan {
  timeline: "asap" | "1month" | "3months" | "flexible";
  dataImport: "yes" | "no" | "partial";
  dataSource: string;
  trainingNeeds: "basic" | "advanced" | "extensive";
  trainingFormat: "onsite" | "online" | "hybrid";
  pilotUsers: number;
  pilotDuration: number;
  goLiveDate: string;
  concerns: string;
}

interface GoLivePlanningProps {
  onPlanChange: (plan: GoLivePlan) => void;
}

export default function GoLivePlanning({ onPlanChange }: GoLivePlanningProps) {
  const [plan, setPlan] = useState<GoLivePlan>({
    timeline: "flexible",
    dataImport: "yes",
    dataSource: "",
    trainingNeeds: "basic",
    trainingFormat: "hybrid",
    pilotUsers: 2,
    pilotDuration: 2,
    goLiveDate: "",
    concerns: ""
  });

  const updatePlan = (field: keyof GoLivePlan, value: any) => {
    const updated = { ...plan, [field]: value };
    setPlan(updated);
    onPlanChange(updated);
  };

  const getTimelineLabel = (value: string) => {
    switch (value) {
      case "asap": return "So schnell wie möglich (4-6 Wochen)";
      case "1month": return "In 1-2 Monaten";
      case "3months": return "In 3-6 Monaten";
      case "flexible": return "Flexibel / kein Zeitdruck";
      default: return "";
    }
  };

  const getTrainingLabel = (value: string) => {
    switch (value) {
      case "basic": return "Basis (4-8 Stunden)";
      case "advanced": return "Erweitert (2-3 Tage)";
      case "extensive": return "Umfassend (1 Woche+)";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-accent bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-accent" />
            Go-Live Planung
          </CardTitle>
          <CardDescription>
            Planen Sie den Rollout und die Einführung von Odoo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timeline */}
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">Zeitplan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Wann möchten Sie mit Odoo live gehen?
                </Label>
                <RadioGroup
                  value={plan.timeline}
                  onValueChange={(value) => updatePlan("timeline", value)}
                >
                  {["asap", "1month", "3months", "flexible"].map((option) => (
                    <div key={option} className="flex items-center space-x-2 p-2 rounded hover:bg-accent/5">
                      <RadioGroupItem value={option} id={`timeline-${option}`} />
                      <Label htmlFor={`timeline-${option}`} className="cursor-pointer flex-1">
                        {getTimelineLabel(option)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label>Gewünschtes Go-Live Datum (optional)</Label>
                <Input
                  type="date"
                  value={plan.goLiveDate}
                  onChange={(e) => updatePlan("goLiveDate", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Import */}
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">Datenübernahme</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Sollen Daten aus bestehenden Systemen übernommen werden?
                </Label>
                <RadioGroup
                  value={plan.dataImport}
                  onValueChange={(value) => updatePlan("dataImport", value)}
                >
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/5">
                    <RadioGroupItem value="yes" id="data-yes" />
                    <Label htmlFor="data-yes" className="cursor-pointer flex-1">
                      Ja, vollständige Datenübernahme
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/5">
                    <RadioGroupItem value="partial" id="data-partial" />
                    <Label htmlFor="data-partial" className="cursor-pointer flex-1">
                      Teilweise (nur wichtigste Daten)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent/5">
                    <RadioGroupItem value="no" id="data-no" />
                    <Label htmlFor="data-no" className="cursor-pointer flex-1">
                      Nein, Neustart ohne alte Daten
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {plan.dataImport !== "no" && (
                <div>
                  <Label>Welche Systeme / Datenquellen?</Label>
                  <Input
                    value={plan.dataSource}
                    onChange={(e) => updatePlan("dataSource", e.target.value)}
                    placeholder="z.B. Excel-Listen, alte Software, Access-Datenbank..."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Training */}
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">Schulung & Training</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Schulungsbedarf
                </Label>
                <RadioGroup
                  value={plan.trainingNeeds}
                  onValueChange={(value) => updatePlan("trainingNeeds", value)}
                >
                  {["basic", "advanced", "extensive"].map((option) => (
                    <div key={option} className="flex items-center space-x-2 p-2 rounded hover:bg-accent/5">
                      <RadioGroupItem value={option} id={`training-${option}`} />
                      <Label htmlFor={`training-${option}`} className="cursor-pointer flex-1">
                        {getTrainingLabel(option)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label>Schulungsformat</Label>
                <Select
                  value={plan.trainingFormat}
                  onValueChange={(value) => updatePlan("trainingFormat", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onsite">Vor Ort beim Kunden</SelectItem>
                    <SelectItem value="online">Online / Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid (Mix aus beidem)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pilot Phase */}
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">Pilotphase</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Anzahl Pilot-Benutzer</Label>
                  <Input
                    type="number"
                    min="1"
                    value={plan.pilotUsers}
                    onChange={(e) => updatePlan("pilotUsers", parseInt(e.target.value) || 1)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Empfohlen: 1-3 Personen
                  </p>
                </div>
                <div>
                  <Label>Pilot-Dauer (Wochen)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={plan.pilotDuration}
                    onChange={(e) => updatePlan("pilotDuration", parseInt(e.target.value) || 1)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Empfohlen: 2-4 Wochen
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Tipp:</strong> Eine Pilotphase mit wenigen Benutzern hilft, Probleme frühzeitig zu erkennen 
                  und Prozesse zu optimieren, bevor alle Mitarbeiter umsteigen.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Concerns */}
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">Bedenken & Herausforderungen</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Label>
                Gibt es Bedenken oder erwartete Herausforderungen bei der Einführung?
              </Label>
              <Textarea
                value={plan.concerns}
                onChange={(e) => updatePlan("concerns", e.target.value)}
                placeholder="z.B. 'Mitarbeiter sind nicht technikaffin', 'Wenig Zeit für Schulung', 'Sorge vor Datenverlust'..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Je offener Sie hier sind, desto besser können wir Sie unterstützen!
              </p>
            </CardContent>
          </Card>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Unser Ansatz:</strong> Wir begleiten Sie Schritt für Schritt – von der Datenübernahme über 
              die Schulung bis zum erfolgreichen Go-Live. Sie sind nie allein!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

