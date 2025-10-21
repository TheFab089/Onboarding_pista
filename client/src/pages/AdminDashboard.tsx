import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  Download,
  FileText,
  LogOut
} from "lucide-react";

export default function AdminDashboard() {
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [exportingPDF, setExportingPDF] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "PISTA" && password === "admin") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Ungültige Anmeldedaten");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setLoginError("");
  };

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

  const getPriorityColor = (priority: string | null) => {
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

  const generateMarkdownContent = () => {
    if (!sessionData || !companyInfo) return "";

    let markdown = `# Onboarding Report: ${companyInfo.companyName}\n\n`;
    markdown += `**Erstellt am:** ${new Date(sessionData.createdAt!).toLocaleDateString('de-DE')}\n\n`;
    markdown += `---\n\n`;

    markdown += `## Kontaktinformationen\n\n`;
    markdown += `- **Name:** ${sessionData.clientName}\n`;
    if (sessionData.clientEmail) markdown += `- **E-Mail:** ${sessionData.clientEmail}\n`;
    if (sessionData.clientPhone) markdown += `- **Telefon:** ${sessionData.clientPhone}\n`;
    markdown += `\n`;

    markdown += `## Firmeninformationen\n\n`;
    markdown += `- **Firmenname:** ${companyInfo.companyName}\n`;
    if (companyInfo.industry) markdown += `- **Branche:** ${companyInfo.industry}\n`;
    if (companyInfo.foundedYear) markdown += `- **Gründungsjahr:** ${companyInfo.foundedYear}\n`;
    if (companyInfo.numberOfEmployees) markdown += `- **Mitarbeiter:** ${companyInfo.numberOfEmployees}\n`;
    if (companyInfo.location) markdown += `- **Standort:** ${companyInfo.location}\n`;
    if (companyInfo.website) markdown += `- **Website:** ${companyInfo.website}\n`;
    if (companyInfo.description) markdown += `\n**Beschreibung:**\n${companyInfo.description}\n`;
    markdown += `\n`;

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

    if (values && values.length > 0) {
      markdown += `## Unternehmenswerte\n\n`;
      values.forEach((value, index) => {
        markdown += `### ${index + 1}. ${value.valueName}\n\n`;
        if (value.description) markdown += `**Beschreibung:** ${value.description}\n\n`;
        if (value.examples) markdown += `**Beispiele:** ${value.examples}\n\n`;
        markdown += `**Wichtigkeit:** ${value.importance}/10\n\n`;
      });
    }

    return markdown;
  };

  const exportToPDF = async () => {
    if (!sessionData || !companyInfo) return;
    
    setExportingPDF(true);
    try {
      const markdown = generateMarkdownContent();
      
      const filename = `onboarding-${((companyInfo.companyName || 'export') as string).replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`;
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          markdown,
          filename
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('PDF export error:', error);
    } finally {
      setExportingPDF(false);
    }
  };

  const exportToMarkdown = () => {
    if (!sessionData || !companyInfo) return;

    const markdown = generateMarkdownContent();
    if (!markdown) return;

    const filename = `onboarding-${((companyInfo.companyName || 'export') as string).replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img src="/pista-logo.png" alt="PISTA Consulting" className="h-12" />
            </div>
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            <CardDescription>Bitte melden Sie sich an</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Benutzername</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="PISTA"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              {loginError && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {loginError}
                </div>
              )}
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                Anmelden
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Abmelden
          </Button>
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
                          ? "ring-2 ring-accent"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedSessionId(session.id)}
                    >
                      <CardContent className="pt-4">
                        <p className="font-medium text-sm">{session.clientName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.createdAt!).toLocaleDateString('de-DE')}
                        </p>
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
                      <div className="flex gap-2">
                        <Button onClick={exportToMarkdown} variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Markdown
                        </Button>
                        <Button onClick={exportToPDF} variant="outline" disabled={exportingPDF}>
                          <FileText className="mr-2 h-4 w-4" />
                          {exportingPDF ? "PDF wird erstellt..." : "PDF"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Tabs */}
                <Tabs defaultValue="company" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="company">Firma</TabsTrigger>
                    <TabsTrigger value="processes">Prozesse</TabsTrigger>
                    <TabsTrigger value="goals">Ziele</TabsTrigger>
                    <TabsTrigger value="values">Werte</TabsTrigger>
                  </TabsList>

                  {/* Company Info Tab */}
                  <TabsContent value="company">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          Firmeninformationen
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {companyInfo ? (
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Firmenname</p>
                              <p className="font-medium">{companyInfo.companyName}</p>
                            </div>
                            {companyInfo.industry && (
                              <div>
                                <p className="text-sm text-muted-foreground">Branche</p>
                                <p className="font-medium">{companyInfo.industry}</p>
                              </div>
                            )}
                            {companyInfo.foundedYear && (
                              <div>
                                <p className="text-sm text-muted-foreground">Gründungsjahr</p>
                                <p className="font-medium">{companyInfo.foundedYear}</p>
                              </div>
                            )}
                            {companyInfo.numberOfEmployees && (
                              <div>
                                <p className="text-sm text-muted-foreground">Mitarbeiter</p>
                                <p className="font-medium">{companyInfo.numberOfEmployees}</p>
                              </div>
                            )}
                            {companyInfo.location && (
                              <div>
                                <p className="text-sm text-muted-foreground">Standort</p>
                                <p className="font-medium">{companyInfo.location}</p>
                              </div>
                            )}
                            {companyInfo.website && (
                              <div>
                                <p className="text-sm text-muted-foreground">Website</p>
                                <a href={companyInfo.website} target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:underline">
                                  {companyInfo.website}
                                </a>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">Keine Firmeninformationen verfügbar</p>
                        )}
                        {companyInfo?.description && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Beschreibung</p>
                            <p className="text-sm">{companyInfo.description}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Processes Tab */}
                  <TabsContent value="processes">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Geschäftsprozesse
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {processes && processes.length > 0 ? (
                          <div className="space-y-6">
                            {processes.map((process, index) => (
                              <div key={index} className="border-l-4 border-accent pl-4">
                                <h4 className="font-semibold mb-2">{process.processName}</h4>
                                {process.description && (
                                  <div className="mb-3">
                                    <p className="text-sm text-muted-foreground">Beschreibung</p>
                                    <p className="text-sm">{process.description}</p>
                                  </div>
                                )}
                                {process.currentState && (
                                  <div className="mb-3">
                                    <p className="text-sm text-muted-foreground">IST-Zustand</p>
                                    <p className="text-sm">{process.currentState}</p>
                                  </div>
                                )}
                                {process.painPoints && (
                                  <div className="mb-3">
                                    <p className="text-sm text-muted-foreground">Schmerzpunkte</p>
                                    <p className="text-sm">{process.painPoints}</p>
                                  </div>
                                )}
                                {process.desiredState && (
                                  <div className="mb-3">
                                    <p className="text-sm text-muted-foreground">SOLL-Zustand</p>
                                    <p className="text-sm">{process.desiredState}</p>
                                  </div>
                                )}
                                <Badge variant={getPriorityColor(process.priority)}>
                                  {process.priority}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">Keine Prozesse erfasst</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Goals Tab */}
                  <TabsContent value="goals">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Ziele & Wünsche
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {goals && goals.length > 0 ? (
                          <div className="space-y-4">
                            {goals.map((goal, index) => (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold">{goal.title}</h4>
                                  <Badge variant="outline">{getGoalTypeLabel(goal.goalType)}</Badge>
                                </div>
                                {goal.description && (
                                  <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                                )}
                                <Badge variant={getPriorityColor(goal.priority)}>
                                  {goal.priority}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">Keine Ziele erfasst</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Values Tab */}
                  <TabsContent value="values">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5" />
                          Unternehmenswerte
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {values && values.length > 0 ? (
                          <div className="space-y-4">
                            {values.map((value, index) => (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold">{value.valueName}</h4>
                                  <span className="text-sm font-medium text-accent">{value.importance}/10</span>
                                </div>
                                {value.description && (
                                  <p className="text-sm text-muted-foreground mb-2">{value.description}</p>
                                )}
                                {value.examples && (
                                  <p className="text-sm"><span className="font-medium">Beispiele:</span> {value.examples}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">Keine Werte erfasst</p>
                        )}
                      </CardContent>
                    </Card>
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

