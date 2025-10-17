import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Target, 
  Lightbulb, 
  Users, 
  Calendar,
  Mail,
  Phone,
  MapPin,
  Globe,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Download
} from "lucide-react";

export default function AdminDashboard() {
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");

  const { data: sessions, isLoading: sessionsLoading } = trpc.onboarding.getAllSessions.useQuery();
  const { data: sessionData } = trpc.onboarding.getSession.useQuery(
    { sessionId: selectedSessionId },
    { enabled: !!selectedSessionId }
  );
  const { data: companyInfo } = trpc.companyInfo.getBySession.useQuery(
    { sessionId: selectedSessionId },
    { enabled: !!selectedSessionId }
  );
  const { data: processes } = trpc.processes.getBySession.useQuery(
    { sessionId: selectedSessionId },
    { enabled: !!selectedSessionId }
  );
  const { data: goals } = trpc.goals.getBySession.useQuery(
    { sessionId: selectedSessionId },
    { enabled: !!selectedSessionId }
  );
  const { data: values } = trpc.values.getBySession.useQuery(
    { sessionId: selectedSessionId },
    { enabled: !!selectedSessionId }
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  const getGoalTypeLabel = (type: string) => {
    switch (type) {
      case "short_term": return "Kurzfristig";
      case "long_term": return "Langfristig";
      case "vision": return "Vision";
      default: return type;
    }
  };

  const exportToMarkdown = () => {
    if (!sessionData || !companyInfo) return;

    let markdown = `# Onboarding Report: ${companyInfo.companyName}\n\n`;
    markdown += `**Erstellt am:** ${new Date(sessionData.createdAt!).toLocaleDateString('de-DE')}\n\n`;
    markdown += `---\n\n`;

    // Client Info
    markdown += `## Kontaktinformationen\n\n`;
    markdown += `- **Name:** ${sessionData.clientName}\n`;
    if (sessionData.clientEmail) markdown += `- **E-Mail:** ${sessionData.clientEmail}\n`;
    if (sessionData.clientPhone) markdown += `- **Telefon:** ${sessionData.clientPhone}\n`;
    markdown += `\n`;

    // Company Info
    markdown += `## Firmeninformationen\n\n`;
    markdown += `- **Firmenname:** ${companyInfo.companyName}\n`;
    if (companyInfo.industry) markdown += `- **Branche:** ${companyInfo.industry}\n`;
    if (companyInfo.foundedYear) markdown += `- **Gründungsjahr:** ${companyInfo.foundedYear}\n`;
    if (companyInfo.numberOfEmployees) markdown += `- **Mitarbeiter:** ${companyInfo.numberOfEmployees}\n`;
    if (companyInfo.location) markdown += `- **Standort:** ${companyInfo.location}\n`;
    if (companyInfo.website) markdown += `- **Website:** ${companyInfo.website}\n`;
    if (companyInfo.description) markdown += `\n**Beschreibung:**\n${companyInfo.description}\n`;
    markdown += `\n`;

    // Processes
    if (processes && processes.length > 0) {
      markdown += `## Geschäftsprozesse\n\n`;
      processes.forEach((process, index) => {
        markdown += `### ${index + 1}. ${process.processName}\n\n`;
        if (process.description) markdown += `**Beschreibung:** ${process.description}\n\n`;
        if (process.currentState) markdown += `**IST-Zustand:**\n${process.currentState}\n\n`;
        if (process.painPoints) markdown += `**Schmerzpunkte:**\n${process.painPoints}\n\n`;
        if (process.desiredState) markdown += `**SOLL-Zustand:**\n${process.desiredState}\n\n`;
        markdown += `**Priorität:** ${process.priority}\n\n`;
        markdown += `---\n\n`;
      });
    }

    // Goals
    if (goals && goals.length > 0) {
      markdown += `## Ziele & Wünsche\n\n`;
      goals.forEach((goal, index) => {
        markdown += `### ${index + 1}. ${goal.title}\n\n`;
        markdown += `- **Typ:** ${getGoalTypeLabel(goal.goalType)}\n`;
        markdown += `- **Priorität:** ${goal.priority}\n`;
        if (goal.description) markdown += `\n${goal.description}\n`;
        markdown += `\n`;
      });
    }

    // Values
    if (values && values.length > 0) {
      markdown += `## Unternehmenswerte\n\n`;
      values.forEach((value, index) => {
        markdown += `### ${index + 1}. ${value.valueName}\n\n`;
        if (value.description) markdown += `**Beschreibung:** ${value.description}\n\n`;
        if (value.examples) markdown += `**Beispiele:** ${value.examples}\n\n`;
        markdown += `**Wichtigkeit:** ${value.importance}/10\n\n`;
      });
    }

    // Download
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onboarding-${companyInfo.companyName?.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <img src="/pista-logo.png" alt="PISTA Consulting" className="h-10" />
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Onboarding Auswertung</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Onboarding Sessions</CardTitle>
              <CardDescription>
                {sessions?.length || 0} abgeschlossene Sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <p className="text-sm text-muted-foreground">Lade Sessions...</p>
              ) : sessions && sessions.length > 0 ? (
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <Card
                      key={session.id}
                      className={`cursor-pointer transition-all ${
                        selectedSessionId === session.id
                          ? 'border-2 border-accent'
                          : 'hover:border-accent/50'
                      }`}
                      onClick={() => setSelectedSessionId(session.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{session.clientName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(session.createdAt!).toLocaleDateString('de-DE')}
                            </p>
                          </div>
                          {session.completedAt ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Keine Sessions vorhanden</p>
              )}
            </CardContent>
          </Card>

          {/* Session Details */}
          <div className="lg:col-span-2">
            {!selectedSessionId ? (
              <Card>
                <CardContent className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Wählen Sie eine Session aus, um Details anzuzeigen
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Header with Export */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{companyInfo?.companyName || sessionData?.clientName}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          {sessionData?.clientEmail && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {sessionData.clientEmail}
                            </span>
                          )}
                          {sessionData?.clientPhone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {sessionData.clientPhone}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <Button onClick={exportToMarkdown} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                <Tabs defaultValue="company" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="company">
                      <Building2 className="h-4 w-4 mr-2" />
                      Firma
                    </TabsTrigger>
                    <TabsTrigger value="processes">
                      <Target className="h-4 w-4 mr-2" />
                      Prozesse
                    </TabsTrigger>
                    <TabsTrigger value="goals">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Ziele
                    </TabsTrigger>
                    <TabsTrigger value="values">
                      <Users className="h-4 w-4 mr-2" />
                      Werte
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="company" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Firmeninformationen</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {companyInfo ? (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              {companyInfo.industry && (
                                <div>
                                  <p className="text-sm font-semibold text-muted-foreground">Branche</p>
                                  <p>{companyInfo.industry}</p>
                                </div>
                              )}
                              {companyInfo.foundedYear && (
                                <div>
                                  <p className="text-sm font-semibold text-muted-foreground">Gründungsjahr</p>
                                  <p>{companyInfo.foundedYear}</p>
                                </div>
                              )}
                              {companyInfo.numberOfEmployees && (
                                <div>
                                  <p className="text-sm font-semibold text-muted-foreground">Mitarbeiter</p>
                                  <p>{companyInfo.numberOfEmployees}</p>
                                </div>
                              )}
                              {companyInfo.location && (
                                <div>
                                  <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    Standort
                                  </p>
                                  <p>{companyInfo.location}</p>
                                </div>
                              )}
                            </div>
                            {companyInfo.website && (
                              <div>
                                <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                                  <Globe className="h-3 w-3" />
                                  Website
                                </p>
                                <a href={companyInfo.website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                                  {companyInfo.website}
                                </a>
                              </div>
                            )}
                            {companyInfo.description && (
                              <div>
                                <p className="text-sm font-semibold text-muted-foreground mb-1">Beschreibung</p>
                                <p className="text-sm">{companyInfo.description}</p>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">Keine Firmeninformationen verfügbar</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="processes" className="space-y-4">
                    {processes && processes.length > 0 ? (
                      processes.map((process, index) => (
                        <Card key={process.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="flex items-center gap-2">
                                  {process.processName}
                                  <Badge variant={getPriorityColor(process.priority || "medium")}>
                                    {process.priority}
                                  </Badge>
                                </CardTitle>
                                {process.category && (
                                  <CardDescription>{process.category}</CardDescription>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {process.description && (
                              <div>
                                <p className="text-sm font-semibold mb-1">Beschreibung</p>
                                <p className="text-sm text-muted-foreground">{process.description}</p>
                              </div>
                            )}
                            <Separator />
                            {process.currentState && (
                              <div>
                                <p className="text-sm font-semibold mb-1">IST-Zustand</p>
                                <p className="text-sm">{process.currentState}</p>
                              </div>
                            )}
                            {process.painPoints && (
                              <div className="bg-destructive/10 p-3 rounded-lg">
                                <p className="text-sm font-semibold mb-1 text-destructive">Schmerzpunkte</p>
                                <p className="text-sm">{process.painPoints}</p>
                              </div>
                            )}
                            {process.desiredState && (
                              <div className="bg-green-50 p-3 rounded-lg">
                                <p className="text-sm font-semibold mb-1 text-green-700">SOLL-Zustand</p>
                                <p className="text-sm">{process.desiredState}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                          Keine Prozesse dokumentiert
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="goals" className="space-y-4">
                    {goals && goals.length > 0 ? (
                      goals.map((goal) => (
                        <Card key={goal.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle className="flex-1">{goal.title}</CardTitle>
                              <div className="flex gap-2">
                                <Badge variant="outline">{getGoalTypeLabel(goal.goalType)}</Badge>
                                <Badge variant={getPriorityColor(goal.priority || "medium")}>
                                  {goal.priority}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          {goal.description && (
                            <CardContent>
                              <p className="text-sm">{goal.description}</p>
                            </CardContent>
                          )}
                        </Card>
                      ))
                    ) : (
                      <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                          Keine Ziele definiert
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="values" className="space-y-4">
                    {values && values.length > 0 ? (
                      values.map((value) => (
                        <Card key={value.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle>{value.valueName}</CardTitle>
                              <Badge variant="outline">
                                {value.importance}/10
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {value.description && (
                              <div>
                                <p className="text-sm font-semibold mb-1">Beschreibung</p>
                                <p className="text-sm">{value.description}</p>
                              </div>
                            )}
                            {value.examples && (
                              <div>
                                <p className="text-sm font-semibold mb-1">Beispiele</p>
                                <p className="text-sm text-muted-foreground">{value.examples}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                          Keine Werte erfasst
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

