import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Check } from "lucide-react";

const TOTAL_STEPS = 5;

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [sessionId, setSessionId] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Client Information
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  
  // Step 2: Company Information
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [numberOfEmployees, setNumberOfEmployees] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  
  // Step 3: Business Processes
  const [processes, setProcesses] = useState<Array<{
    id?: string;
    processName: string;
    category: string;
    description: string;
    currentState: string;
    painPoints: string;
    desiredState: string;
    priority: "low" | "medium" | "high";
  }>>([]);
  
  // Step 4: Goals and Wishes
  const [goals, setGoals] = useState<Array<{
    id?: string;
    goalType: "short_term" | "long_term" | "vision";
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }>>([]);
  
  // Step 5: Company Values
  const [values, setValues] = useState<Array<{
    id?: string;
    valueName: string;
    description: string;
    examples: string;
    importance: number;
  }>>([]);

  const createSessionMutation = trpc.onboarding.createSession.useMutation();
  const updateSessionMutation = trpc.onboarding.updateSession.useMutation();
  const upsertCompanyInfoMutation = trpc.companyInfo.upsert.useMutation();
  const createProcessMutation = trpc.processes.create.useMutation();
  const createGoalMutation = trpc.goals.create.useMutation();
  const createValueMutation = trpc.values.create.useMutation();

  const handleStartOnboarding = async () => {
    if (!clientName.trim()) {
      toast.error("Bitte geben Sie Ihren Namen ein");
      return;
    }
    
    try {
      const result = await createSessionMutation.mutateAsync({
        clientName,
        clientEmail: clientEmail || undefined,
        clientPhone: clientPhone || undefined,
      });
      
      setSessionId(result.sessionId);
      setCurrentStep(2);
      toast.success("Willkommen! Lassen Sie uns beginnen.");
    } catch (error) {
      toast.error("Fehler beim Starten der Sitzung");
    }
  };

  const handleSaveCompanyInfo = async () => {
    if (!companyName.trim()) {
      toast.error("Bitte geben Sie den Firmennamen ein");
      return;
    }
    
    try {
      await upsertCompanyInfoMutation.mutateAsync({
        sessionId,
        companyName,
        industry: industry || undefined,
        foundedYear: foundedYear ? parseInt(foundedYear) : undefined,
        numberOfEmployees: numberOfEmployees ? parseInt(numberOfEmployees) : undefined,
        location: companyLocation || undefined,
        website: website || undefined,
        description: description || undefined,
      });
      
      await updateSessionMutation.mutateAsync({ sessionId, currentStep: 3 });
      setCurrentStep(3);
      toast.success("Firmeninformationen gespeichert");
    } catch (error) {
      toast.error("Fehler beim Speichern");
    }
  };

  const handleAddProcess = () => {
    setProcesses([...processes, {
      processName: "",
      category: "",
      description: "",
      currentState: "",
      painPoints: "",
      desiredState: "",
      priority: "medium",
    }]);
  };

  const handleRemoveProcess = (index: number) => {
    setProcesses(processes.filter((_, i) => i !== index));
  };

  const handleSaveProcesses = async () => {
    if (processes.length === 0) {
      toast.error("Bitte fügen Sie mindestens einen Prozess hinzu");
      return;
    }
    
    const hasEmptyNames = processes.some(p => !p.processName.trim());
    if (hasEmptyNames) {
      toast.error("Bitte geben Sie für alle Prozesse einen Namen ein");
      return;
    }
    
    try {
      for (const process of processes) {
        await createProcessMutation.mutateAsync({
          sessionId,
          ...process,
        });
      }
      
      await updateSessionMutation.mutateAsync({ sessionId, currentStep: 4 });
      setCurrentStep(4);
      toast.success("Prozesse gespeichert");
    } catch (error) {
      toast.error("Fehler beim Speichern der Prozesse");
    }
  };

  const handleAddGoal = () => {
    setGoals([...goals, {
      goalType: "short_term",
      title: "",
      description: "",
      priority: "medium",
    }]);
  };

  const handleRemoveGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleSaveGoals = async () => {
    if (goals.length === 0) {
      toast.error("Bitte fügen Sie mindestens ein Ziel hinzu");
      return;
    }
    
    const hasEmptyTitles = goals.some(g => !g.title.trim());
    if (hasEmptyTitles) {
      toast.error("Bitte geben Sie für alle Ziele einen Titel ein");
      return;
    }
    
    try {
      for (const goal of goals) {
        await createGoalMutation.mutateAsync({
          sessionId,
          ...goal,
        });
      }
      
      await updateSessionMutation.mutateAsync({ sessionId, currentStep: 5 });
      setCurrentStep(5);
      toast.success("Ziele gespeichert");
    } catch (error) {
      toast.error("Fehler beim Speichern der Ziele");
    }
  };

  const handleAddValue = () => {
    setValues([...values, {
      valueName: "",
      description: "",
      examples: "",
      importance: 5,
    }]);
  };

  const handleRemoveValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    if (values.length === 0) {
      toast.error("Bitte fügen Sie mindestens einen Wert hinzu");
      return;
    }
    
    const hasEmptyNames = values.some(v => !v.valueName.trim());
    if (hasEmptyNames) {
      toast.error("Bitte geben Sie für alle Werte einen Namen ein");
      return;
    }
    
    try {
      for (const value of values) {
        await createValueMutation.mutateAsync({
          sessionId,
          ...value,
        });
      }
      
      await updateSessionMutation.mutateAsync({ 
        sessionId, 
        currentStep: 5,
        completedAt: new Date()
      });
      
      toast.success("Onboarding erfolgreich abgeschlossen!");
      setTimeout(() => navigate("/success"), 1500);
    } catch (error) {
      toast.error("Fehler beim Abschließen");
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img src="/pista-logo.png" alt="PISTA Consulting" className="h-10" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">PISTA<span className="text-accent">.</span></h1>
                <p className="text-sm text-muted-foreground">consulting</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Waldhauser Sanitär & Heizung</p>
              <p className="text-xs text-muted-foreground">Onboarding Portal</p>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Schritt {currentStep} von {TOTAL_STEPS}</p>
        </div>

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Willkommen bei PISTA Consulting</CardTitle>
              <CardDescription>
                Wir freuen uns, Sie bei der digitalen Transformation zu begleiten. Lassen Sie uns mit Ihren Kontaktdaten beginnen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Name *</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ihr vollständiger Name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientEmail">E-Mail</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="ihre.email@beispiel.de"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Telefon</Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+49 123 456789"
                />
              </div>
              
              <Button 
                onClick={handleStartOnboarding} 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={createSessionMutation.isPending}
              >
                {createSessionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Weiter
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Firmeninformationen</CardTitle>
              <CardDescription>
                Erzählen Sie uns mehr über Waldhauser Sanitär & Heizung.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Firmenname *</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Waldhauser Sanitär & Heizung"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry">Branche</Label>
                  <Input
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="z.B. Handwerk, Sanitär"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Gründungsjahr</Label>
                  <Input
                    id="foundedYear"
                    type="number"
                    value={foundedYear}
                    onChange={(e) => setFoundedYear(e.target.value)}
                    placeholder="z.B. 1990"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="numberOfEmployees">Anzahl Mitarbeiter</Label>
                  <Input
                    id="numberOfEmployees"
                    type="number"
                    value={numberOfEmployees}
                    onChange={(e) => setNumberOfEmployees(e.target.value)}
                    placeholder="z.B. 15"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Standort</Label>
                  <Input
                    id="location"
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    placeholder="z.B. Grünwald"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://www.beispiel.de"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Firmenbeschreibung</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschreiben Sie Ihr Unternehmen, Ihre Dienstleistungen und was Sie besonders macht..."
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={handleSaveCompanyInfo} 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={upsertCompanyInfoMutation.isPending}
              >
                {upsertCompanyInfoMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Weiter
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Geschäftsprozesse</CardTitle>
              <CardDescription>
                Dokumentieren Sie Ihre wichtigsten Geschäftsprozesse und wo Verbesserungsbedarf besteht.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {processes.map((process, index) => (
                <Card key={index} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Prozess {index + 1}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProcess(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Prozessname *</Label>
                        <Input
                          value={process.processName}
                          onChange={(e) => {
                            const newProcesses = [...processes];
                            newProcesses[index].processName = e.target.value;
                            setProcesses(newProcesses);
                          }}
                          placeholder="z.B. Auftragsabwicklung"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Kategorie</Label>
                        <Input
                          value={process.category}
                          onChange={(e) => {
                            const newProcesses = [...processes];
                            newProcesses[index].category = e.target.value;
                            setProcesses(newProcesses);
                          }}
                          placeholder="z.B. Vertrieb, Verwaltung"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Beschreibung</Label>
                      <Textarea
                        value={process.description}
                        onChange={(e) => {
                          const newProcesses = [...processes];
                          newProcesses[index].description = e.target.value;
                          setProcesses(newProcesses);
                        }}
                        placeholder="Kurze Beschreibung des Prozesses..."
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Aktueller Zustand</Label>
                      <Textarea
                        value={process.currentState}
                        onChange={(e) => {
                          const newProcesses = [...processes];
                          newProcesses[index].currentState = e.target.value;
                          setProcesses(newProcesses);
                        }}
                        placeholder="Wie läuft der Prozess aktuell ab?"
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Schmerzpunkte</Label>
                      <Textarea
                        value={process.painPoints}
                        onChange={(e) => {
                          const newProcesses = [...processes];
                          newProcesses[index].painPoints = e.target.value;
                          setProcesses(newProcesses);
                        }}
                        placeholder="Welche Probleme gibt es? Was läuft nicht optimal?"
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Gewünschter Zustand</Label>
                      <Textarea
                        value={process.desiredState}
                        onChange={(e) => {
                          const newProcesses = [...processes];
                          newProcesses[index].desiredState = e.target.value;
                          setProcesses(newProcesses);
                        }}
                        placeholder="Wie sollte der Prozess idealerweise ablaufen?"
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Priorität</Label>
                      <Select
                        value={process.priority}
                        onValueChange={(value: "low" | "medium" | "high") => {
                          const newProcesses = [...processes];
                          newProcesses[index].priority = value;
                          setProcesses(newProcesses);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Niedrig</SelectItem>
                          <SelectItem value="medium">Mittel</SelectItem>
                          <SelectItem value="high">Hoch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button
                variant="outline"
                onClick={handleAddProcess}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Prozess hinzufügen
              </Button>
              
              <Button 
                onClick={handleSaveProcesses} 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={createProcessMutation.isPending}
              >
                {createProcessMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Weiter
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Ziele & Wünsche</CardTitle>
              <CardDescription>
                Was möchten Sie kurz-, mittel- und langfristig erreichen?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((goal, index) => (
                <Card key={index} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Ziel {index + 1}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveGoal(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Typ *</Label>
                        <Select
                          value={goal.goalType}
                          onValueChange={(value: "short_term" | "long_term" | "vision") => {
                            const newGoals = [...goals];
                            newGoals[index].goalType = value;
                            setGoals(newGoals);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short_term">Kurzfristig (0-6 Monate)</SelectItem>
                            <SelectItem value="long_term">Langfristig (6-24 Monate)</SelectItem>
                            <SelectItem value="vision">Vision (2+ Jahre)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Priorität</Label>
                        <Select
                          value={goal.priority}
                          onValueChange={(value: "low" | "medium" | "high") => {
                            const newGoals = [...goals];
                            newGoals[index].priority = value;
                            setGoals(newGoals);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Niedrig</SelectItem>
                            <SelectItem value="medium">Mittel</SelectItem>
                            <SelectItem value="high">Hoch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Titel *</Label>
                      <Input
                        value={goal.title}
                        onChange={(e) => {
                          const newGoals = [...goals];
                          newGoals[index].title = e.target.value;
                          setGoals(newGoals);
                        }}
                        placeholder="z.B. Digitalisierung der Auftragserfassung"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Beschreibung</Label>
                      <Textarea
                        value={goal.description}
                        onChange={(e) => {
                          const newGoals = [...goals];
                          newGoals[index].description = e.target.value;
                          setGoals(newGoals);
                        }}
                        placeholder="Beschreiben Sie das Ziel im Detail..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button
                variant="outline"
                onClick={handleAddGoal}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ziel hinzufügen
              </Button>
              
              <Button 
                onClick={handleSaveGoals} 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={createGoalMutation.isPending}
              >
                {createGoalMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Weiter
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Unternehmenswerte & Philosophie</CardTitle>
              <CardDescription>
                Was macht Ihre Unternehmenskultur aus? Welche Werte sind Ihnen wichtig?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {values.map((value, index) => (
                <Card key={index} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Wert {index + 1}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveValue(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Wertname *</Label>
                      <Input
                        value={value.valueName}
                        onChange={(e) => {
                          const newValues = [...values];
                          newValues[index].valueName = e.target.value;
                          setValues(newValues);
                        }}
                        placeholder="z.B. Kundenzufriedenheit, Qualität, Innovation"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Beschreibung</Label>
                      <Textarea
                        value={value.description}
                        onChange={(e) => {
                          const newValues = [...values];
                          newValues[index].description = e.target.value;
                          setValues(newValues);
                        }}
                        placeholder="Was bedeutet dieser Wert für Ihr Unternehmen?"
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Beispiele</Label>
                      <Textarea
                        value={value.examples}
                        onChange={(e) => {
                          const newValues = [...values];
                          newValues[index].examples = e.target.value;
                          setValues(newValues);
                        }}
                        placeholder="Konkrete Beispiele, wie dieser Wert gelebt wird..."
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Wichtigkeit (1-10)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={value.importance}
                        onChange={(e) => {
                          const newValues = [...values];
                          newValues[index].importance = parseInt(e.target.value) || 5;
                          setValues(newValues);
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button
                variant="outline"
                onClick={handleAddValue}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Wert hinzufügen
              </Button>
              
              <Button 
                onClick={handleComplete} 
                className="w-full bg-accent hover:bg-accent/90"
                disabled={createValueMutation.isPending}
              >
                {createValueMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Onboarding abschließen
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

