import { serve } from "https://deno.land/std@0.155.0/http/server.ts";

async function fetchAndFormatResponse(url: string) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "true") {
      return { code: "200", reply: data.result };
    } else {
      return { code: "200", reply: data.message };
    }
  } catch {
    return { code: "500", reply: "Request error occurred" };
  }
}

async function geminiHandler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const prompt = url.searchParams.get("prompt");

  if (!prompt) {
    return new Response(JSON.stringify({ code: "400", reply: "Prompt is required" }), { status: 400 });
  }

  const apiUrl = `https://api.nyxs.pw/ai/gemini?text=${prompt}`;
  const response = await fetchAndFormatResponse(apiUrl);
  return new Response(JSON.stringify(response), { headers: { "Content-Type": "application/json" } });
}

async function geminiAdvanceHandler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const prompt = url.searchParams.get("prompt");

  if (!prompt) {
    return new Response(JSON.stringify({ code: "400", reply: "Prompt is required" }), { status: 400 });
  }

  const apiUrl = `https://api.nyxs.pw/ai/gemini-advance?text=${prompt}`;
  const response = await fetchAndFormatResponse(apiUrl);
  return new Response(JSON.stringify(response), { headers: { "Content-Type": "application/json" } });
}

async function readImageHandler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const prompt = url.searchParams.get("prompt");
  const imgURL = url.searchParams.get("imgURL");

  if (!prompt || !imgURL) {
    return new Response(JSON.stringify({ code: "400", reply: "Prompt and imgURL are required" }), { status: 400 });
  }

  const apiUrl = `https://api.nyxs.pw/ai/gemini-img?text=${prompt}&url=${imgURL}`;
  const response = await fetchAndFormatResponse(apiUrl);
  return new Response(JSON.stringify(response), { headers: { "Content-Type": "application/json" } });
}

async function videoHandler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const prompt = url.searchParams.get("prompt");
  const videoURL = url.searchParams.get("videoURL");

  if (!prompt || !videoURL) {
    return new Response(JSON.stringify({ code: "400", reply: "Prompt and videoURL are required" }), { status: 400 });
  }

  const apiUrl = `https://api.nyxs.pw/ai/gemini-video?text=${prompt}&url=${videoURL}`;
  const response = await fetchAndFormatResponse(apiUrl);
  return new Response(JSON.stringify(response), { headers: { "Content-Type": "application/json" } });
}

serve(async (req: Request) => {
  const { pathname } = new URL(req.url);

  if (pathname === "/gemini") {
    return geminiHandler(req);
  } else if (pathname === "/geminiAdvance") {
    return geminiAdvanceHandler(req);
  } else if (pathname === "/readImage") {
    return readImageHandler(req);
  } else if (pathname === "/video") {
    return videoHandler(req);
  } else {
    return new Response(JSON.stringify({ code: "404", reply: "Endpoint not found" }), { status: 404 });
  }
}, { addr: ":8080" });

console.log("Server running on http://localhost:8080");
