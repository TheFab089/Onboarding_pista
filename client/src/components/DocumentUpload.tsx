import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, File, Trash2, Check, Loader2, FileText, Image as ImageIcon } from "lucide-react";

interface DocumentUploadProps {
  sessionId: string;
}

const DOCUMENT_TYPES = [
  { value: "logo", label: "Firmenlogo" },
  { value: "letterhead", label: "Briefkopf" },
  { value: "invoice_template", label: "Rechnungsvorlage" },
  { value: "quote_template", label: "Angebotsvorlage" },
  { value: "price_list", label: "Preisliste" },
  { value: "product_catalog", label: "Produktkatalog" },
  { value: "process_document", label: "Prozessdokumentation" },
  { value: "other", label: "Sonstiges" },
];

export default function DocumentUpload({ sessionId }: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("other");
  const [description, setDescription] = useState("");

  const { data: documents, refetch } = trpc.documents.getBySession.useQuery({ sessionId });
  const uploadMutation = trpc.documents.upload.useMutation({
    onSuccess: () => {
      toast.success("Dokument erfolgreich hochgeladen");
      refetch();
      setDescription("");
    },
    onError: () => {
      toast.error("Fehler beim Hochladen");
    },
  });

  const deleteMutation = trpc.documents.delete.useMutation({
    onSuccess: () => {
      toast.success("Dokument gelöscht");
      refetch();
    },
  });

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Datei zu groß (max. 10MB)");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      const base64Data = base64.split(',')[1]; // Remove data:image/png;base64, prefix

      await uploadMutation.mutateAsync({
        sessionId,
        documentType: selectedType,
        fileName: file.name,
        fileData: base64Data,
        mimeType: file.type,
        description: description || undefined,
      });
    };
    reader.readAsDataURL(file);
  }, [sessionId, selectedType, description, uploadMutation]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dokumente hochladen</CardTitle>
          <CardDescription>
            Laden Sie wichtige Dokumente hoch, die für die Odoo-Implementierung benötigt werden
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Dokumenttyp</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Beschreibung (optional)</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="z.B. Aktuelles Logo 2024"
              />
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-accent bg-accent/10"
                : "border-gray-300 hover:border-accent/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleChange}
              disabled={uploadMutation.isPending}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="h-12 w-12 text-accent mb-4 animate-spin" />
                  <p className="text-sm text-muted-foreground">Wird hochgeladen...</p>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm font-semibold mb-1">
                    Datei hier ablegen oder klicken zum Auswählen
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, PNG, JPG, XLSX (max. 10MB)
                  </p>
                </>
              )}
            </label>
          </div>
        </CardContent>
      </Card>

      {documents && documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Hochgeladene Dokumente
              <Badge variant="secondary">{documents.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {documents.map((doc) => (
                <Card key={doc.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 text-muted-foreground">
                          {getFileIcon(doc.mimeType || '')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{doc.fileName}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {DOCUMENT_TYPES.find(t => t.value === doc.documentType)?.label || doc.documentType}
                            </Badge>
                            {doc.fileSize && <span>{formatFileSize(doc.fileSize)}</span>}
                          </div>
                          {doc.description && (
                            <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(doc.fileUrl, '_blank')}
                        >
                          <File className="h-4 w-4 mr-1" />
                          Öffnen
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate({ id: doc.id })}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

