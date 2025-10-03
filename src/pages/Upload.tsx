import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleAnalyze = () => {
    toast({
      title: "Analysis Started",
      description: "Your image is being analyzed. This may take a moment...",
    });
    
    // Simulate analysis - in real implementation, this would call Lovable AI
    setTimeout(() => {
      toast({
        title: "Analysis Complete",
        description: "Results are ready. Backend integration coming soon!",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">AI Image Analysis</h1>
          <p className="text-muted-foreground text-lg">
            Upload breast tissue images for AI-powered detection and analysis
          </p>
        </div>

        <Alert className="mb-8 border-accent/50 bg-accent/5">
          <AlertCircle className="h-4 w-4 text-accent" />
          <AlertDescription>
            This is a demonstration interface. For actual medical diagnosis, please consult with healthcare professionals.
            AI integration will be added in the next phase.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Upload Medical Image</CardTitle>
            <CardDescription>
              Drag and drop or click to select breast tissue images for analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!preview ? (
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <UploadIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  Drop your image here or click to browse
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports JPG, PNG, and other image formats
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <Button asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Select Image
                  </label>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden border-2 border-border">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain bg-muted"
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                    }}
                    className="flex-1"
                  >
                    Remove Image
                  </Button>
                  <Button
                    onClick={handleAnalyze}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary"
                  >
                    Analyze Image
                  </Button>
                </div>
              </div>
            )}

            {/* Results Placeholder */}
            {selectedFile && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">Analysis Results</CardTitle>
                  <CardDescription>
                    AI-powered prediction with confidence scores will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-card border">
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Status: Ready for Analysis
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Click "Analyze Image" to process with AI. Results will include:
                      </p>
                      <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                        <li>Classification (Benign, Malignant, Normal)</li>
                        <li>Confidence scores</li>
                        <li>Visual explanations</li>
                        <li>Personalized recommendations</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;
