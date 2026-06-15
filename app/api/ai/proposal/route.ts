import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { auth } from "@/lib/auth"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectType, clientName, budget, deadline, description, yourName, yourBusiness } = await req.json()

    if (!projectType || !clientName) {
      return NextResponse.json({ error: "Project type and client name are required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" })

    const prompt = `You are an expert freelance proposal writer. Write a professional, compelling proposal in HTML format.

Context:
- Freelancer name: ${yourName || "the freelancer"}
- Business/Studio: ${yourBusiness || ""}
- Client name: ${clientName}
- Project type: ${projectType}
- Budget: ${budget ? `₹${budget}` : "to be discussed"}
- Deadline: ${deadline || "to be discussed"}
- Project description: ${description || "Not provided"}

Write a complete professional proposal in HTML. Use these exact HTML tags only:
- <h2> for section headings
- <p> for paragraphs  
- <ul> and <li> for bullet points
- <strong> for bold text
- <hr> to separate sections

The proposal must include these sections:
1. A warm personalized introduction addressing ${clientName} by name
2. Understanding of the Project (restate what they need professionally)
3. Proposed Solution & Approach (detailed methodology)
4. Deliverables (bullet list of exactly what will be delivered)
5. Timeline & Milestones (with specific phases)
6. Investment (mention the budget professionally)
7. Why Choose Me (3-4 compelling reasons)
8. Next Steps (clear call to action)

Make it sound human, warm, confident and professional. Avoid generic filler. Tailor it specifically to ${clientName} and the ${projectType} project. Output ONLY the HTML content, no markdown, no code blocks, no explanations.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Clean up any accidental markdown code blocks
    const cleaned = text
      .replace(/```html/gi, "")
      .replace(/```/g, "")
      .trim()

    return NextResponse.json({ success: true, content: cleaned })
  } catch (error) {
    console.error("Gemini API error:", error)
    return NextResponse.json(
      { error: "Failed to generate proposal. Please try again." },
      { status: 500 }
    )
  }
}