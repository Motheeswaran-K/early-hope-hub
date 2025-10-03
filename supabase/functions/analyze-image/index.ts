import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey || !lovableApiKey) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { imageBase64, imagePath } = await req.json();

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "Missing image data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Analyzing image with Lovable AI...");

    // Call Lovable AI for image analysis
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a medical AI assistant specialized in analyzing breast tissue images. Provide a detailed analysis indicating whether the tissue appears benign, malignant, or normal. Always include confidence scores and reasoning. Note: This is for educational purposes only and not a replacement for professional medical diagnosis.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this breast tissue image. Provide: 1) Classification (benign/malignant/normal), 2) Confidence score (0-100), 3) Key observations, 4) Recommendations. Format as JSON.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI analysis failed: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log("AI response received:", aiData);

    const analysisText = aiData.choices?.[0]?.message?.content || "";
    
    // Parse AI response to extract structured data
    let predictionType = "normal";
    let confidenceScore = 75;
    let analysisDetails: any = {};

    try {
      // Try to extract JSON from response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        predictionType = (parsed.classification || "normal").toLowerCase();
        confidenceScore = parsed.confidence || 75;
        analysisDetails = parsed;
      } else {
        // Fallback: simple text parsing
        if (analysisText.toLowerCase().includes("malignant")) {
          predictionType = "malignant";
        } else if (analysisText.toLowerCase().includes("benign")) {
          predictionType = "benign";
        }
        analysisDetails = { raw_analysis: analysisText };
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      analysisDetails = { raw_analysis: analysisText };
    }

    // Ensure prediction type is valid
    if (!["benign", "malignant", "normal"].includes(predictionType)) {
      predictionType = "normal";
    }

    // Save prediction to database
    const { data: prediction, error: dbError } = await supabase
      .from("predictions")
      .insert({
        user_id: user.id,
        image_path: imagePath || "uploaded-image",
        prediction_type: predictionType,
        confidence_score: confidenceScore,
        analysis_details: analysisDetails,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }

    console.log("Analysis complete, prediction saved");

    return new Response(
      JSON.stringify({
        prediction: predictionType,
        confidence: confidenceScore,
        analysis: analysisDetails,
        predictionId: prediction.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in analyze-image function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
