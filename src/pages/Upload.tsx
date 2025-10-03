import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, Image as ImageIcon, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

const UploadAuth = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
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

    if (file.size > 10485760) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setResult(null);
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

  const handleAnalyze = async () => {
    if (!selectedFile || !preview) return;

    setAnalyzing(true);
    setResult(null);

    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to analyze images",
          variant: "destructive",
        });
        return;
      }

      // Upload image to storage
      const fileName = `${session.user.id}/${Date.now()}-${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("medical-images")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Call AI analysis edge function
      const { data, error } = await supabase.functions.invoke("analyze-image", {
        body: {
          imageBase64: preview,
          imagePath: fileName,
        },
      });

      if (error) throw error;

      setResult(data);
      
      toast({
        title: "Analysis Complete",
        description: `Prediction: ${data.prediction.toUpperCase()} (${data.confidence}% confidence)`,
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "An error occurred during analysis",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getPredictionColor = (type: string) => {
    switch (type) {
      case "benign":
        return "text-primary";
      case "malignant":
        return "text-destructive";
      default:
        return "text-secondary";
    }
  };

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case "benign":
        return <CheckCircle className="h-6 w-6 text-primary" />;
      case "malignant":
        return <AlertTriangle className="h-6 w-6 text-destructive" />;
      default:
        return <AlertCircle className="h-6 w-6 text-secondary" />;
    }
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
            This is an AI-assisted tool for educational purposes. Always consult healthcare professionals for medical diagnosis.
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
                  Supports JPG, PNG, and other image formats (Max 10MB)
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
                      setResult(null);
                    }}
                    className="flex-1"
                    disabled={analyzing}
                  >
                    Remove Image
                  </Button>
                  <Button
                    onClick={handleAnalyze}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary"
                    disabled={analyzing}
                  >
                    {analyzing ? "Analyzing..." : "Analyze Image"}
                  </Button>
                </div>
                
                {analyzing && (
                  <div className="space-y-2">
                    <Progress value={undefined} className="w-full" />
                    <p className="text-sm text-center text-muted-foreground">
                      AI is analyzing your image...
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Results Display */}
            {result && (
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {getPredictionIcon(result.prediction)}
                    <div>
                      <CardTitle className="text-lg">Analysis Results</CardTitle>
                      <CardDescription>
                        AI-powered prediction with confidence scores
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-card border">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Classification
                      </p>
                      <p className={`text-2xl font-bold capitalize ${getPredictionColor(result.prediction)}`}>
                        {result.prediction}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-card border">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Confidence Score
                      </p>
                      <p className="text-2xl font-bold text-secondary">
                        {result.confidence}%
                      </p>
                    </div>
                  </div>

                  {result.analysis && (
                    <div className="p-4 rounded-lg bg-card border">
                      <p className="text-sm font-medium mb-2">Key Observations</p>
                      <div className="text-sm text-muted-foreground">
                        {result.analysis.observations || result.analysis.raw_analysis || "Analysis details available"}
                      </div>
                    </div>
                  )}

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      These results are AI-generated predictions. Always consult with qualified healthcare professionals for proper diagnosis and treatment.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadAuth;
