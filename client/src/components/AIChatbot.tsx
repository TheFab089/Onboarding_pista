import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, Minimize2, Maximize2, Loader2 } from "lucide-react";

interface AIChatbotProps {
  sessionId: string;
}

export default function AIChatbot({ sessionId }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: chatHistory, refetch } = trpc.chat.getHistory.useQuery(
    { sessionId },
    { enabled: isOpen }
  );

  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      refetch();
      setMessage("");
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [chatHistory, isOpen, isMinimized]);

  const handleSend = () => {
    if (!message.trim() || sendMessageMutation.isPending) return;
    
    sendMessageMutation.mutate({
      sessionId,
      message: message.trim(),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-4 rounded-full w-14 h-14 md:w-16 md:h-16 shadow-lg bg-accent hover:bg-accent/90 z-50"
        size="icon"
      >
        <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-20 right-4 w-full max-w-sm md:w-96 shadow-2xl z-40 transition-all ${
      isMinimized ? 'h-16' : 'h-[500px] md:h-[600px]'
    }`}>
      <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <CardTitle className="text-lg">Pisti</CardTitle>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="p-4 h-[calc(100%-140px)] overflow-y-auto">
            {!chatHistory || chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Hallo, ich bin Pisti! 👋</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ihr digitaler Begleiter für das Onboarding. Fragen Sie mich alles!
                </p>
                <div className="space-y-2 w-full">
                  <button
                    onClick={() => setMessage("Was bedeutet Prozessmappe?")}
                    className="w-full text-left p-2 text-sm bg-muted hover:bg-muted/80 rounded transition-colors"
                  >
                    💡 Was bedeutet Prozessmappe?
                  </button>
                  <button
                    onClick={() => setMessage("Welche Dokumente sollte ich hochladen?")}
                    className="w-full text-left p-2 text-sm bg-muted hover:bg-muted/80 rounded transition-colors"
                  >
                    📄 Welche Dokumente sollte ich hochladen?
                  </button>
                  <button
                    onClick={() => setMessage("Warum braucht ihr diese Informationen?")}
                    className="w-full text-left p-2 text-sm bg-muted hover:bg-muted/80 rounded transition-colors"
                  >
                    ❓ Warum braucht ihr diese Informationen?
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {[...chatHistory].sort((a, b) => 
                  new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
                ).map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === "user"
                          ? "bg-accent text-white"
                          : "bg-muted"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <Badge variant="outline" className="mb-2 text-xs">
                          Pisti
                        </Badge>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.createdAt!).toLocaleTimeString('de-DE', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {sendMessageMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </CardContent>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Stellen Sie eine Frage..."
                disabled={sendMessageMutation.isPending}
              />
              <Button
                onClick={handleSend}
                disabled={!message.trim() || sendMessageMutation.isPending}
                size="icon"
                className="bg-accent hover:bg-accent/90"
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

