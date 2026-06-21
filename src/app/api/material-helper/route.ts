import { NextRequest } from "next/server";
import OpenAI from "openai";import { NextRequest } from "next/server";
import OpenAI from "openai";
// Rich, Kanpur-localized fallback database for popular construction materials
// Strict whitelist of recognized construction materials
const MATERIAL_WHITELIST = [
  "cement",
  "tmt bar",
  "steel",
  "sand",
  "morang sand",
  "bricks",
  "tiles",
  "pvc pipe",
  "aggregate",
  "concrete"
];
// Rich, Kanpur-localized fallback database for all whitelisted construction materials
const FALLBACK_DATABASE: Record<string, Array<{ title: string; description: string; criticalWarning?: string }>> = {
  cement: [
    {
      description: "Ensure all tiles for a single room come from the exact same batch/lot code, as slight color deviations are common between firing runs.",
      criticalWarning: "Inspect boxes at delivery time to match the batch numbers printed on the packaging."
    }
  ]
};
// Generates a dynamic placeholder response if the material is not in the database
function generateGenericFallback(material: string) {
  return [
  ],
  pvc: [
    {
      title: "Verify Grade and Manufacturer Standards",
      description: `For ${material}, always demand BIS (Bureau of Indian Standards) certification. Kanpur's regional distributors frequently deal in non-standard batches. Cross-verify standard codes on the packaging.`,
      criticalWarning: "Check for duplicate branding stamps common in transit hubs near Cooperganj."
      title: "Wall Thickness & Pressure Rating",
      description: "Ensure pipes are Schedule 40 or 80 and certified by IS:4985 standards. Deep borewells and plumbing lines in Kanpur experience heavy pressure due to local hard water pumping requirements.",
      criticalWarning: "Look for the official blue tint markings. Thin-walled pipes crack under the extreme heat of Kanpur summers."
    },
    {
      title: "Inspect Storage & Moisture Exposure",
      description: `Ensure the ${material} has been kept in a raised, water-resistant shelter. Kanpur's extreme humidity variations and Ganga-plain dew can compromise material integrity prior to installation.`,
      criticalWarning: "Reject materials showing signs of water staining, mold, or outer structural cracking."
      title: "Lead-Free Certification",
      description: "For drinking water lines, confirm that PVC pipes are certified lead-free. Heavy metal leaching from cheap pipes poses serious health hazards.",
      criticalWarning: "Verify lead-free stamps on pipe bodies. Never use cheap drainage conduits for potable water lines."
    },
    {
      title: "Check Local Supply Authenticity",
      description: `Ensure you purchase ${material} from authorized distributors in Kanpur (e.g., Kidwai Nagar, Barra, or Lal Bangla). Ask for a tax invoice detailing the manufacturer batch ID for quality verification.`,
      criticalWarning: "Double-check the manufacturer warranty card validity for the UP region."
      title: "Joint & Socket Depth Uniformity",
      description: "Ensure sockets are formed uniformly to enable leak-proof joints. Use heavy-duty solvent cement from authorized retailers in Kidwai Nagar to resist local thermal expansion.",
      criticalWarning: "Verify that pipe joints sit flush. Uneven joints leak inside walls, causing dampness in Kanpur brick masonry."
    }
  ];
  ],
  aggregate: [
    {
      title: "Size and Shape Uniformity",
      description: "Use angular, machine-crushed 20mm aggregates for RCC slab works. Flaky, flat, or elongated aggregates reduce concrete bond strength and compromise load-bearing structures.",
      criticalWarning: "Reject aggregates containing soft river pebbles or smooth round stones."
    },
    {
      title: "Stone Dust & Silt Cleanliness",
      description: "Aggregates must be washed and free from stone dust, clay, or loam coatings. Dust creates a barrier between cement paste and aggregate, reducing overall compression strength.",
      criticalWarning: "Perform a quick hand rub test. If the stone leaves a thick dusty residue on your hands, wash the aggregate before mixing."
    },
    {
      title: "Source Quarry Origin",
      description: "Ensure aggregates are sourced from hard granite/basalt quarries in Bundelkhand or Jhansi regions rather than soft sandstone from local canal basins.",
      criticalWarning: "Softer sandstone aggregates break down during concrete mixing, leading to early slab degradation."
    }
  ],
  concrete: [
    {
      title: "Concrete Mix Ratio (M20/M25)",
      description: "For structural columns and slabs in Kanpur, use at least an M20 mix (1:1.5:3 cement:sand:aggregate). Measure using precise boxes rather than local masons' visual estimations.",
      criticalWarning: "Maintain a water-cement ratio below 0.45 to ensure density and prevent moisture penetration during Kanpur monsoons."
    },
    {
      title: "Workability and Slump Test",
      description: "Ensure workability matches casting requirements. Masons often add excess water on-site to make placing easier, which severely reduces final concrete strength.",
      criticalWarning: "Concrete must be a cohesive, paste-like mix. Reject mixes that have water separating from the stone aggregates."
    },
    {
      title: "Curing Duration and Methods",
      description: "Slabs and columns must undergo pond/spray curing for a minimum of 10 to 14 days. Curing is critical in Kanpur's dry summer months to prevent shrinkage cracks.",
      criticalWarning: "Cover concrete slabs with wet hessian cloth to prevent rapid evaporation in Kanpur's hot winds."
    }
  ]
};
// Maps matched whitelist items to FALLBACK_DATABASE keys
function mapToDatabaseKey(matchedWhitelistItem: string): string {
  if (matchedWhitelistItem === "steel") return "tmt";
  if (matchedWhitelistItem === "tmt bar") return "tmt";
  if (matchedWhitelistItem === "sand") return "morang";
  if (matchedWhitelistItem === "morang sand") return "morang";
  if (matchedWhitelistItem === "pvc pipe") return "pvc";
  return matchedWhitelistItem; // cement, bricks, tiles, aggregate, concrete match directly
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { material } = body;
    // Validate the material parameter
    // Validate parameter presence
    if (!material || typeof material !== "string" || material.trim() === "") {
      return Response.json(
        { error: "Material name is required." },
        { status: 400 }
      );
    }
    const trimmedMaterial = material.trim();
    const searchKey = trimmedMaterial.toLowerCase();
    // Check if the developer wants mock-only or if API Key is placeholder
    // Check if the searchKey matches any item in the material whitelist
    const matchedWhitelistItem = MATERIAL_WHITELIST.find(item => 
      searchKey.includes(item) || (searchKey.length >= 3 && item.includes(searchKey))
    );
    if (!matchedWhitelistItem) {
      return Response.json(
        { error: "Please enter a valid construction material." },
        { status: 400 }
      );
    }
    // Map matched whitelist item to fallback database key
    const dbKey = mapToDatabaseKey(matchedWhitelistItem);
    const mockChecks = FALLBACK_DATABASE[dbKey];
    // Check if API Key is placeholder or missing
    const isKeyMissingOrPlaceholder = !process.env.OPENAI_API_KEY || 
                                     process.env.OPENAI_API_KEY === "YOUR_OPENAI_API_KEY" ||
                                     process.env.OPENAI_API_KEY === "";
    if (isKeyMissingOrPlaceholder) {
      // Fallback directly to simulated database response
      const matchedKey = Object.keys(FALLBACK_DATABASE).find(k => searchKey.includes(k) || k.includes(searchKey));
      const checks = matchedKey ? FALLBACK_DATABASE[matchedKey] : generateGenericFallback(trimmedMaterial);
      return Response.json({
        material: trimmedMaterial,
        checks: checks,
        checks: mockChecks,
        isMock: true,
        mockReason: "No API Key configured. Displaying Kanpur structural fallback database."
      });
    } catch (apiError: any) {
      console.warn("OpenAI API call failed or quota exceeded. Falling back to Kanpur local database. Error:", apiError?.message);
      // Handle Quota (429) or Auth (401) or general API errors by falling back gracefully
      const matchedKey = Object.keys(FALLBACK_DATABASE).find(k => searchKey.includes(k) || k.includes(searchKey));
      const checks = matchedKey ? FALLBACK_DATABASE[matchedKey] : generateGenericFallback(trimmedMaterial);
      const isQuotaError = apiError?.message?.includes("quota") || apiError?.status === 429;
      return Response.json({
        material: trimmedMaterial,
        checks: checks,
        checks: mockChecks,
        isMock: true,
        mockReason: isQuotaError 
          ? "OpenAI API quota exceeded. Falling back to regional Kanpur database checks." 
  }
}
"use client";
import React, { useState, useEffect } from "react";
const POPULAR_MATERIALS = [
  "Cement",
  "TMT Bar (Steel)",
  "Morang Sand (Coarse)",
  "Red Clay Bricks",
  "Vitrified Tiles",
  "Plumbing PVC Pipes"
  "TMT Bar",
  "Steel",
  "Sand",
  "Morang Sand",
  "Bricks",
  "Tiles",
  "PVC Pipe",
  "Aggregate",
  "Concrete"
];
// Fun changing load messages to keep Kanpur homeowners engaged
      const data: ApiResponse = await response.json();
      if (!response.ok) {
        if (response.status === 400) {
          setInputError(data.error || "Please enter a valid construction material.");
          setResult(null);
          setLoading(false);
          return;
        }
        throw new Error(data.error || "Failed to retrieve information from the server.");
      }
      setResult(data);
    } catch (err: any) {
      console.error("Submission error:", err);
      // Check if it looks like a config error (missing OpenAI key)
      const isConfig = err.message.includes("OpenAI API Key") || err.message.includes("not configured");
      setApiError({
        message: err.message || "Something went wrong. Please check your connection and try again.",
        isConfig
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSuggestionClick = (selectedMaterial: string) => {
    setMaterial(selectedMaterial);
    setInputError("");
  };
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Badge Indicator */}
      <div className="flex justify-center mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 glow-indicator">
          <MapPin size={12} />
          Kanpur Localized Edition
        </span>
      </div>
      {/* Main Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 bg-clip-text text-transparent text-glow flex items-center justify-center gap-3">
          <HardHat className="text-amber-500 animate-bounce" size={40} />
          Buildanta
        </h1>
        <p className="text-xl md:text-2xl font-bold text-gray-200 mt-2">
          Material Quality procurement Helper
        </p>
        <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto mt-2">
          First-time Kanpur homebuilders: Enter any construction material to receive 3 localized, safety-critical quality checks before you purchase.
        </p>
      </div>
      {/* Input Section */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-2xl mb-8 relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/15 to-transparent rounded-tr-2xl pointer-events-none" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="material-input" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Building2 size={16} className="text-amber-400" />
              What material are you buying today?
            </label>
            <div className="relative flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="material-input"
                  type="text"
                  placeholder="e.g. Portland Pozzolan Cement, 8mm TMT Bar, Morang Sand..."
                  placeholder="Cement, TMT Bar, Tiles, Bricks..."
                  value={material}
                  onChange={(e) => {
                    setMaterial(e.target.value);
  );
}


// Rich, Kanpur-localized fallback database for popular construction materials
const FALLBACK_DATABASE: Record<string, Array<{ title: string; description: string; criticalWarning?: string }>> = {
  cement: [
    {
      title: "OPC vs PPC Grade Selection",
      description: "For residential builds in Kanpur, PPC (Portland Pozzolan Cement) is highly recommended over OPC for masonry and plaster because PPC resists sulfate attacks from Kanpur's salt-heavy groundwater and alluvial soil.",
      criticalWarning: "Verify that the cement is fresh. Kanpur's high seasonal humidity (especially near Jajmau/Ganga) causes fast lumps. Reject bags older than 3 months."
    },
    {
      title: "Adulteration & Packaging Check",
      description: "Ensure the bags are double-stitched with official manufacturer seals. Fly-ash mixing is common in local secondary markets. Buy only from authorized dealers in Barra, Cooperganj, or Lal Bangla.",
      criticalWarning: "Look for the red/green brand hologram. Duplicate packing of local brands is highly prevalent in rural Kanpur outskirts."
    },
    {
      title: "Lump & Hydration Inspection",
      description: "Insert your hand into the bag; it must feel cool, not warm, indicating no ongoing hydration reaction. It should be a smooth powder free of gritty sand-like mixtures.",
      criticalWarning: "Reject any bags with hard crusted corners, which indicate exposure to rain during local transport."
    }
  ],
  tmt: [
    {
      title: "Fe 500D / Fe 550D Ductility Grade",
      description: "Kanpur lies in Seismic Zone III. High-ductility steel (marked with 'D') is critical for foundation reinforcement in gangetic clay soils to absorb subterranean stress.",
      criticalWarning: "Ensure the 'Fe 500D' or 'Fe 550D' stamp is embossed clearly every meter along the bar."
    },
    {
      title: "Corrosion & Rust Scaling",
      description: "Oxidation decreases steel-concrete bonding. Check that bars have a dark blue-grey steel finish, and avoid orange-brown scaling rust common in poorly covered yards near Jajmau.",
      criticalWarning: "Light surface rust is fine, but flake-like scaling rust weakens structural integrity and should be rejected."
    },
    {
      title: "Section Weight & Diameter Accuracy",
      description: "Check the bar diameters with calipers. Local unbranded re-rolling mills often manufacture underweight TMT bars, leading to structural failures under load.",
      criticalWarning: "Buy only standard lengths (typically 12 meters) from reputable manufacturers (e.g., Tata, SAIL, JSPL) to avoid duplicate grades."
    }
  ],
  morang: [
    {
      title: "Silt and Clay Percentage",
      description: "Bundelkhand red Morang is preferred in Kanpur. Silt content must not exceed 5% by volume. Excessive silt weakens concrete mortar, causing plaster cracking later.",
      criticalWarning: "Perform a field jar test: mix sand with water in a glass jar. Silt settling on top should not exceed 5% after 2 hours."
    },
    {
      title: "Organic and Salt Adulteration",
      description: "Sand dredged from contaminated local rivers may contain organic debris or high salt contents that corrode internal TMT bar reinforcement.",
      criticalWarning: "Ensure the sand is dry and light red-orange. Highly alkaline sand from local canal basins should be rejected."
    },
    {
      title: "Granular Grading (Fineness Modulus)",
      description: "Ensure coarse particles (grading zone II or III) are used for concrete works. Fine river sand is only suitable for finishing coats and internal plastering.",
      criticalWarning: "Reject sand if it contains large pebbles or excessive mud clods."
    }
  ],
  bricks: [
    {
      title: "Class I Quality & Compression",
      description: "Bricks in Kanpur are sourced from local kilns (Bhatta) along the highway. They must be uniform, copper-colored, and free from cracks or pebbles.",
      criticalWarning: "When struck together, two bricks should produce a clear metallic ringing sound. A dull thud indicates under-burnt clay."
    },
    {
      title: "Water Absorption Limits",
      description: "High water absorption leads to dampness in walls. Good bricks should absorb less than 20% of their dry weight after soaking for 24 hours.",
      criticalWarning: "Avoid bricks showing white salt deposits (efflorescence) after drying; Kanpur groundwater will react badly with them."
    },
    {
      title: "Hardness & Sharp Edges",
      description: "A fingernail scratch should not leave a deep mark on the brick surface. Edges must be sharp and rectilineal for efficient mortar bonding.",
      criticalWarning: "Ensure local kiln batch codes are stamped clearly on the frog."
    }
  ],
  tiles: [
    {
      title: "Water Absorption & Porosity",
      description: "Select vitrified tiles with water absorption of less than 0.5% for floors. For bathrooms and kitchens, ceramic wall tiles must have a protective glaze to prevent mold.",
      criticalWarning: "Verify that tiles are stored dry at local dealer showrooms in Kidwai Nagar or Barra."
    },
    {
      title: "Dimensional Calibrations",
      description: "Ensure tile sizes (thickness, length, width) are identical. Minor warpages lead to uneven flooring ('lip-page') which looks unsightly and gathers dust.",
      criticalWarning: "Place two tiles face-to-face to check for flatness or gaps along the edges."
    },
    {
      title: "Shade Variation (Batch Coding)",
      description: "Ensure all tiles for a single room come from the exact same batch/lot code, as slight color deviations are common between firing runs.",
      criticalWarning: "Inspect boxes at delivery time to match the batch numbers printed on the packaging."
    }
  ]
};

// Generates a dynamic placeholder response if the material is not in the database
function generateGenericFallback(material: string) {
  return [
    {
      title: "Verify Grade and Manufacturer Standards",
      description: `For ${material}, always demand BIS (Bureau of Indian Standards) certification. Kanpur's regional distributors frequently deal in non-standard batches. Cross-verify standard codes on the packaging.`,
      criticalWarning: "Check for duplicate branding stamps common in transit hubs near Cooperganj."
    },
    {
      title: "Inspect Storage & Moisture Exposure",
      description: `Ensure the ${material} has been kept in a raised, water-resistant shelter. Kanpur's extreme humidity variations and Ganga-plain dew can compromise material integrity prior to installation.`,
      criticalWarning: "Reject materials showing signs of water staining, mold, or outer structural cracking."
    },
    {
      title: "Check Local Supply Authenticity",
      description: `Ensure you purchase ${material} from authorized distributors in Kanpur (e.g., Kidwai Nagar, Barra, or Lal Bangla). Ask for a tax invoice detailing the manufacturer batch ID for quality verification.`,
      criticalWarning: "Double-check the manufacturer warranty card validity for the UP region."
    }
  ];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { material } = body;

    // Validate the material parameter
    if (!material || typeof material !== "string" || material.trim() === "") {
      return Response.json(
        { error: "Material name is required." },
        { status: 400 }
      );
    }

    const trimmedMaterial = material.trim();
    const searchKey = trimmedMaterial.toLowerCase();

    // Check if the developer wants mock-only or if API Key is placeholder
    const isKeyMissingOrPlaceholder = !process.env.OPENAI_API_KEY || 
                                     process.env.OPENAI_API_KEY === "YOUR_OPENAI_API_KEY" ||
                                     process.env.OPENAI_API_KEY === "";

    if (isKeyMissingOrPlaceholder) {
      // Fallback directly to simulated database response
      const matchedKey = Object.keys(FALLBACK_DATABASE).find(k => searchKey.includes(k) || k.includes(searchKey));
      const checks = matchedKey ? FALLBACK_DATABASE[matchedKey] : generateGenericFallback(trimmedMaterial);

      return Response.json({
        material: trimmedMaterial,
        checks: checks,
        isMock: true,
        mockReason: "No API Key configured. Displaying Kanpur structural fallback database."
      });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `List 3 things a first-time homeowner in Kanpur should check before buying ${trimmedMaterial}.
You must respond with a JSON object in this exact format:
{
  "material": "${trimmedMaterial}",
  "checks": [
    {
      "title": "Short quality check title (e.g. Silt Content, Grade standard)",
      "description": "Detailed explanation of what to check and why, tailored specifically to Kanpur, India (e.g., Gangetic clay soil, high heat and moisture levels, groundwater salinity/alkalinity in Kanpur South vs Kanpur North, local markets like Lal Bangla, Barra, or Cooperganj, or local trusted manufacturing certifications).",
      "criticalWarning": "Optional local tip or warning, for example, alert on typical sand mixing or counterfeit packaging common in local stores."
    }
  ]
}
Provide exactly 3 items in the 'checks' array. Focus heavily on local Kanpur conditions (weather, soil, sand quality, water hardness, common local procurement issues).`;

    try {
      // Call OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert civil engineer and construction material procurement consultant based in Kanpur, Uttar Pradesh, India. You assist homeowners in getting the highest quality construction materials. You only respond in JSON format matching the schema requested.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const content = completion.choices[0].message?.content || "{}";
      const data = JSON.parse(content);

      if (!data.checks || !Array.isArray(data.checks)) {
        throw new Error("AI response was missing the checks list.");
      }

      return Response.json(data);

    } catch (apiError: any) {
      console.warn("OpenAI API call failed or quota exceeded. Falling back to Kanpur local database. Error:", apiError?.message);

      // Handle Quota (429) or Auth (401) or general API errors by falling back gracefully
      const matchedKey = Object.keys(FALLBACK_DATABASE).find(k => searchKey.includes(k) || k.includes(searchKey));
      const checks = matchedKey ? FALLBACK_DATABASE[matchedKey] : generateGenericFallback(trimmedMaterial);

      const isQuotaError = apiError?.message?.includes("quota") || apiError?.status === 429;

      return Response.json({
        material: trimmedMaterial,
        checks: checks,
        isMock: true,
        mockReason: isQuotaError 
          ? "OpenAI API quota exceeded. Falling back to regional Kanpur database checks." 
          : `AI API unavailable (${apiError?.message || "connection error"}). Showing Kanpur structural database checks.`
      });
    }
  } catch (error: any) {
    console.error("Error in material-helper API route:", error);
    return Response.json(
      { error: error?.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
