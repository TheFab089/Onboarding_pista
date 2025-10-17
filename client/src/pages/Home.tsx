import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Target, Lightbulb, Users } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <img src="/pista-logo.png" alt="PISTA Consulting" className="h-10" />
          <Button 
            onClick={() => navigate("/admin")} 
            variant="outline"
            size="sm"
          >
            Admin Dashboard
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Willkommen bei Ihrem digitalen Onboarding
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Waldhauser Sanitär & Heizung - Gemeinsam auf der Überholspur zur digitalen Transformation
          </p>
          <Button 
            onClick={() => navigate("/onboarding")} 
            size="lg"
            className="bg-accent hover:bg-accent/90 text-lg px-8 py-6"
          >
            Onboarding starten
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-foreground">Was erwartet Sie?</h3>
            <p className="text-lg text-muted-foreground">Ein strukturierter Prozess zur Erfassung Ihrer Anforderungen</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-accent">
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-accent mb-2" />
                <CardTitle className="text-lg">Firmeninformationen</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Erfassen Sie grundlegende Informationen über Ihr Unternehmen und Ihre Branche.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent">
              <CardHeader>
                <Target className="h-10 w-10 text-accent mb-2" />
                <CardTitle className="text-lg">Geschäftsprozesse</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Dokumentieren Sie Ihre wichtigsten Prozesse und Verbesserungspotenziale.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent">
              <CardHeader>
                <Lightbulb className="h-10 w-10 text-accent mb-2" />
                <CardTitle className="text-lg">Ziele & Wünsche</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Definieren Sie Ihre kurz- und langfristigen Digitalisierungsziele.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent">
              <CardHeader>
                <Users className="h-10 w-10 text-accent mb-2" />
                <CardTitle className="text-lg">Unternehmenswerte</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Teilen Sie Ihre Unternehmensphilosophie und wichtigsten Werte mit uns.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">Bereit für die digitale Transformation?</h3>
          <p className="text-xl mb-8 opacity-90">
            Das Onboarding dauert ca. 15-20 Minuten. Sie können jederzeit pausieren und später fortfahren.
          </p>
          <Button 
            onClick={() => navigate("/onboarding")} 
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6"
          >
            Jetzt starten
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 PISTA Consulting. Alle Rechte vorbehalten.</p>
          <p className="mt-2">Speziell entwickelt für Waldhauser Sanitär & Heizung, Grünwald</p>
        </div>
      </footer>
    </div>
  );
}
