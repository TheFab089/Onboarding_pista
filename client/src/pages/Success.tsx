import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function Success() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="container max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-20 w-20 text-accent" />
            </div>
            <CardTitle className="text-3xl">Vielen Dank!</CardTitle>
            <CardDescription className="text-lg mt-4">
              Ihr Onboarding wurde erfolgreich abgeschlossen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <img src="/pista-logo.png" alt="PISTA Consulting" className="h-12" />
              <div className="text-left">
                <h2 className="text-2xl font-bold text-foreground">PISTA<span className="text-accent">.</span></h2>
                <p className="text-sm text-muted-foreground">consulting</p>
              </div>
            </div>
            
            <div className="bg-muted p-6 rounded-lg text-left space-y-3">
              <h3 className="font-semibold text-lg">Wie geht es weiter?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Unser Team wird Ihre Angaben sorgfältig auswerten</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Wir erstellen eine maßgeschneiderte Digitalisierungsstrategie für Waldhauser Sanitär & Heizung</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Sie erhalten innerhalb von 3-5 Werktagen einen detaillierten Fahrplan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Wir vereinbaren einen Termin für ein persönliches Beratungsgespräch</span>
                </li>
              </ul>
            </div>
            
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Bei Fragen können Sie uns jederzeit kontaktieren:
              </p>
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">E-Mail: info@pista.consulting</p>
                <p className="text-muted-foreground">Website: www.pista.consulting</p>
              </div>
            </div>
            
            <Button 
              onClick={() => window.location.href = "/"} 
              className="mt-6 bg-primary hover:bg-primary/90"
            >
              Zurück zur Startseite
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

