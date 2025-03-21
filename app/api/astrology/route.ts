import { NextResponse } from 'next/server';
export async function POST(request: NextRequest) {
  const timeoutDuration = 10000; // 10-second timeout

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    const formData = await request.formData();
    const flaskFormData = new FormData();

    // Validate required fields
    const requiredFields = ['name', 'date_of_birth', 'time_of_birth', 'gender', 'state', 'city'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Copy form data with encoding
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        flaskFormData.append(key, value, value.name);
      } else {
        flaskFormData.append(key, value.toString());
      }
    }

    const response = await fetch("http://localhost:5000/astrology", {
      method: "POST",
      body: flaskFormData,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}