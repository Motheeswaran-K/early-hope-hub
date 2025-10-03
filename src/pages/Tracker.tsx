import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Calendar, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Symptom {
  id: string;
  date: string;
  symptom: string;
  severity: string;
  notes: string;
}

const Tracker = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [newSymptom, setNewSymptom] = useState("");
  const [severity, setSeverity] = useState("mild");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleAddSymptom = () => {
    if (!newSymptom.trim()) {
      toast({
        title: "Error",
        description: "Please enter a symptom",
        variant: "destructive",
      });
      return;
    }

    const symptom: Symptom = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      symptom: newSymptom,
      severity,
      notes,
    };

    setSymptoms([symptom, ...symptoms]);
    setNewSymptom("");
    setNotes("");
    setSeverity("mild");

    toast({
      title: "Symptom Added",
      description: "Your symptom has been tracked successfully",
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Health Tracker</h1>
          <p className="text-muted-foreground text-lg">
            Monitor your symptoms and track your health journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Add Symptom Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Log New Symptom
              </CardTitle>
              <CardDescription>
                Track symptoms to identify patterns and share with healthcare providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Symptom</label>
                <Input
                  placeholder="e.g., Pain, Discomfort, Swelling"
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Severity</label>
                <select
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Notes</label>
                <Textarea
                  placeholder="Any additional details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleAddSymptom}
                className="w-full bg-gradient-to-r from-primary to-secondary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Symptom
              </Button>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                Health Insights
              </CardTitle>
              <CardDescription>
                Overview of your tracked symptoms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-card border">
                  <p className="text-2xl font-bold text-primary">{symptoms.length}</p>
                  <p className="text-sm text-muted-foreground">Total Entries</p>
                </div>
                <div className="p-4 rounded-lg bg-card border">
                  <p className="text-2xl font-bold text-secondary">
                    {symptoms.filter((s) => s.severity === "severe").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Severe Cases</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-card border space-y-2">
                <p className="text-sm font-medium">Quick Tips</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Track symptoms daily for better insights</li>
                  <li>Note any patterns or triggers</li>
                  <li>Share your log with your doctor</li>
                  <li>Set reminders for follow-ups</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Symptom History */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Symptom History
            </CardTitle>
            <CardDescription>
              Your logged symptoms and health records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {symptoms.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  No symptoms tracked yet. Start logging to build your health history.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {symptoms.map((symptom) => (
                  <div
                    key={symptom.id}
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{symptom.symptom}</p>
                        <p className="text-sm text-muted-foreground">{symptom.date}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          symptom.severity === "severe"
                            ? "bg-destructive/10 text-destructive"
                            : symptom.severity === "moderate"
                            ? "bg-accent/10 text-accent"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {symptom.severity}
                      </span>
                    </div>
                    {symptom.notes && (
                      <p className="text-sm text-muted-foreground">{symptom.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tracker;
