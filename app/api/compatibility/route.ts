import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Create a new FormData object to send to Flask
    const flaskFormData = new FormData()

    // Copy all form fields
    for (const [key, value] of formData.entries()) {
      flaskFormData.append(key, value)
    }

    // Call the Flask API
    const response = await fetch("http://localhost:5000/compatibility", {
      method: "POST",
      body: flaskFormData,
    })

    if (!response.ok) {
      throw new Error(`Flask API returned ${response.status}`)
    }

    const data = await response.json()

    // Return the response from the Flask API
    return NextResponse.json({
      response: data.response,
    })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Failed to process your request. Please try again." }, { status: 500 })
  }
}

