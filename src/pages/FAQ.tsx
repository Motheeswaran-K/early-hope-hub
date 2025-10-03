import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, BookOpen, Heart, Shield } from "lucide-react";

const FAQ = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Breast Cancer Awareness</h1>
          <p className="text-muted-foreground text-lg">
            Common questions, myths, and essential information
          </p>
        </div>

        {/* Myth-Busting Section */}
        <Card className="mb-8 bg-gradient-to-br from-accent/10 to-secondary/5 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-accent" />
              Myth vs. Reality
            </CardTitle>
            <CardDescription>
              Common misconceptions about breast cancer debunked
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-card border">
                <p className="font-medium text-destructive mb-2">❌ Myth: Only women get breast cancer</p>
                <p className="text-sm text-muted-foreground">
                  ✓ Reality: While rare, men can also develop breast cancer. About 1% of all breast cancer cases occur in men.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card border">
                <p className="font-medium text-destructive mb-2">❌ Myth: Breast cancer is always hereditary</p>
                <p className="text-sm text-muted-foreground">
                  ✓ Reality: Only 5-10% of breast cancers are hereditary. Most cases occur in women with no family history.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card border">
                <p className="font-medium text-destructive mb-2">❌ Myth: Young women don't need to worry</p>
                <p className="text-sm text-muted-foreground">
                  ✓ Reality: While risk increases with age, breast cancer can occur at any age. Early detection is key for all ages.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Accordion */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What are the early signs of breast cancer?</AccordionTrigger>
                <AccordionContent>
                  Early signs include: lumps in the breast or armpit, changes in breast size or shape, skin dimpling,
                  nipple discharge, redness or scaling of breast skin. Regular self-examinations and mammograms are
                  crucial for early detection.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How often should I get screened?</AccordionTrigger>
                <AccordionContent>
                  Women aged 40-44 should have the option to start annual screening. Ages 45-54 should get mammograms
                  every year. Age 55 and older can switch to every 2 years or continue yearly. Consult your doctor for
                  personalized recommendations based on your risk factors.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>What lifestyle changes can reduce risk?</AccordionTrigger>
                <AccordionContent>
                  Maintain a healthy weight, exercise regularly (at least 150 minutes per week), limit alcohol consumption,
                  don't smoke, breastfeed if possible, and limit hormone therapy. A balanced diet rich in fruits and
                  vegetables may also help.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How accurate is AI detection?</AccordionTrigger>
                <AccordionContent>
                  AI tools can assist in early detection and analysis, but they are not replacements for professional
                  medical diagnosis. Always consult with healthcare professionals for accurate diagnosis and treatment
                  planning. AI serves as a complementary tool to support medical decisions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>What support resources are available?</AccordionTrigger>
                <AccordionContent>
                  Many resources exist including: cancer support groups, counseling services, patient navigation programs,
                  financial assistance programs, and online communities. Organizations like the American Cancer Society
                  provide comprehensive support and information.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Resources Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <Heart className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Mental Health Support</CardTitle>
              <CardDescription>
                Resources for emotional well-being during diagnosis and treatment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Support group connections</li>
                <li>• Counseling services</li>
                <li>• Meditation and mindfulness resources</li>
                <li>• Peer support programs</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-secondary transition-colors">
            <CardHeader>
              <Shield className="h-8 w-8 text-secondary mb-2" />
              <CardTitle>Prevention Tips</CardTitle>
              <CardDescription>
                Proactive steps for breast health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Regular self-examinations</li>
                <li>• Annual health screenings</li>
                <li>• Healthy diet and exercise</li>
                <li>• Know your family history</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
