import { serve } from "https://deno.land/std@0.155.0/http/server.ts";
async function fetchAndFormatResponse(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === "true") {
            return {
                code: "200",
                reply: data.result
            };
        } else {
            return {
                code: "200",
                reply: data.message
            };
        }
    } catch  {
        return {
            code: "500",
            reply: "Request error occurred"
        };
    }
}
async function geminiHandler(request) {
    const url = new URL(request.url);
    const prompt = url.searchParams.get("prompt");
    if (!prompt) {
        return new Response(JSON.stringify({
            code: "400",
            reply: "Prompt is required"
        }), {
            status: 400
        });
    }
    const apiUrl = `https://api.nyxs.pw/ai/gemini?text=${prompt}`;
    const response = await fetchAndFormatResponse(apiUrl);
    return new Response(JSON.stringify(response), {
        headers: {
            "Content-Type": "application/json"
        }
    });
}
async function geminiAdvanceHandler(request) {
    const url = new URL(request.url);
    const prompt = url.searchParams.get("prompt");
    if (!prompt) {
        return new Response(JSON.stringify({
            code: "400",
            reply: "Prompt is required"
        }), {
            status: 400
        });
    }
    const apiUrl = `https://api.nyxs.pw/ai/gemini-advance?text=${prompt}`;
    const response = await fetchAndFormatResponse(apiUrl);
    return new Response(JSON.stringify(response), {
        headers: {
            "Content-Type": "application/json"
        }
    });
}
async function readImageHandler(request) {
    const url = new URL(request.url);
    const prompt = url.searchParams.get("prompt");
    const imgURL = url.searchParams.get("imgURL");
    if (!prompt || !imgURL) {
        return new Response(JSON.stringify({
            code: "400",
            reply: "Prompt and imgURL are required"
        }), {
            status: 400
        });
    }
    const apiUrl = `https://api.nyxs.pw/ai/gemini-img?text=${prompt}&url=${imgURL}`;
    const response = await fetchAndFormatResponse(apiUrl);
    return new Response(JSON.stringify(response), {
        headers: {
            "Content-Type": "application/json"
        }
    });
}
async function videoHandler(request) {
    const url = new URL(request.url);
    const prompt = url.searchParams.get("prompt");
    const videoURL = url.searchParams.get("videoURL");
    if (!prompt || !videoURL) {
        return new Response(JSON.stringify({
            code: "400",
            reply: "Prompt and videoURL are required"
        }), {
            status: 400
        });
    }
    const apiUrl = `https://api.nyxs.pw/ai/gemini-video?text=${prompt}&url=${videoURL}`;
    const response = await fetchAndFormatResponse(apiUrl);
    return new Response(JSON.stringify(response), {
        headers: {
            "Content-Type": "application/json"
        }
    });
}
serve(async (req)=>{
    const { pathname  } = new URL(req.url);
    if (pathname === "/gemini") {
        return geminiHandler(req);
    } else if (pathname === "/geminiAdvance") {
        return geminiAdvanceHandler(req);
    } else if (pathname === "/readImage") {
        return readImageHandler(req);
    } else if (pathname === "/video") {
        return videoHandler(req);
    } else {
        return new Response(JSON.stringify({
            code: "404",
            reply: "Endpoint not found"
        }), {
            status: 404
        });
    }
}, {
    addr: ":8080"
});
console.log("Server running on http://localhost:8080");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9ydW5uZXIvR2VtaW5pLUFQSXMtRGVuby9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzZXJ2ZSB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC9zdGRAMC4xNTUuMC9odHRwL3NlcnZlci50c1wiO1xuXG5hc3luYyBmdW5jdGlvbiBmZXRjaEFuZEZvcm1hdFJlc3BvbnNlKHVybDogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgICBpZiAoZGF0YS5zdGF0dXMgPT09IFwidHJ1ZVwiKSB7XG4gICAgICByZXR1cm4geyBjb2RlOiBcIjIwMFwiLCByZXBseTogZGF0YS5yZXN1bHQgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHsgY29kZTogXCIyMDBcIiwgcmVwbHk6IGRhdGEubWVzc2FnZSB9O1xuICAgIH1cbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHsgY29kZTogXCI1MDBcIiwgcmVwbHk6IFwiUmVxdWVzdCBlcnJvciBvY2N1cnJlZFwiIH07XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2VtaW5pSGFuZGxlcihyZXF1ZXN0OiBSZXF1ZXN0KTogUHJvbWlzZTxSZXNwb25zZT4ge1xuICBjb25zdCB1cmwgPSBuZXcgVVJMKHJlcXVlc3QudXJsKTtcbiAgY29uc3QgcHJvbXB0ID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJwcm9tcHRcIik7XG5cbiAgaWYgKCFwcm9tcHQpIHtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgY29kZTogXCI0MDBcIiwgcmVwbHk6IFwiUHJvbXB0IGlzIHJlcXVpcmVkXCIgfSksIHsgc3RhdHVzOiA0MDAgfSk7XG4gIH1cblxuICBjb25zdCBhcGlVcmwgPSBgaHR0cHM6Ly9hcGkubnl4cy5wdy9haS9nZW1pbmk/dGV4dD0ke3Byb21wdH1gO1xuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoQW5kRm9ybWF0UmVzcG9uc2UoYXBpVXJsKTtcbiAgcmV0dXJuIG5ldyBSZXNwb25zZShKU09OLnN0cmluZ2lmeShyZXNwb25zZSksIHsgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9IH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZW1pbmlBZHZhbmNlSGFuZGxlcihyZXF1ZXN0OiBSZXF1ZXN0KTogUHJvbWlzZTxSZXNwb25zZT4ge1xuICBjb25zdCB1cmwgPSBuZXcgVVJMKHJlcXVlc3QudXJsKTtcbiAgY29uc3QgcHJvbXB0ID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJwcm9tcHRcIik7XG5cbiAgaWYgKCFwcm9tcHQpIHtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgY29kZTogXCI0MDBcIiwgcmVwbHk6IFwiUHJvbXB0IGlzIHJlcXVpcmVkXCIgfSksIHsgc3RhdHVzOiA0MDAgfSk7XG4gIH1cblxuICBjb25zdCBhcGlVcmwgPSBgaHR0cHM6Ly9hcGkubnl4cy5wdy9haS9nZW1pbmktYWR2YW5jZT90ZXh0PSR7cHJvbXB0fWA7XG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2hBbmRGb3JtYXRSZXNwb25zZShhcGlVcmwpO1xuICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSwgeyBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0gfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlYWRJbWFnZUhhbmRsZXIocmVxdWVzdDogUmVxdWVzdCk6IFByb21pc2U8UmVzcG9uc2U+IHtcbiAgY29uc3QgdXJsID0gbmV3IFVSTChyZXF1ZXN0LnVybCk7XG4gIGNvbnN0IHByb21wdCA9IHVybC5zZWFyY2hQYXJhbXMuZ2V0KFwicHJvbXB0XCIpO1xuICBjb25zdCBpbWdVUkwgPSB1cmwuc2VhcmNoUGFyYW1zLmdldChcImltZ1VSTFwiKTtcblxuICBpZiAoIXByb21wdCB8fCAhaW1nVVJMKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShKU09OLnN0cmluZ2lmeSh7IGNvZGU6IFwiNDAwXCIsIHJlcGx5OiBcIlByb21wdCBhbmQgaW1nVVJMIGFyZSByZXF1aXJlZFwiIH0pLCB7IHN0YXR1czogNDAwIH0pO1xuICB9XG5cbiAgY29uc3QgYXBpVXJsID0gYGh0dHBzOi8vYXBpLm55eHMucHcvYWkvZ2VtaW5pLWltZz90ZXh0PSR7cHJvbXB0fSZ1cmw9JHtpbWdVUkx9YDtcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaEFuZEZvcm1hdFJlc3BvbnNlKGFwaVVybCk7XG4gIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpLCB7IGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdmlkZW9IYW5kbGVyKHJlcXVlc3Q6IFJlcXVlc3QpOiBQcm9taXNlPFJlc3BvbnNlPiB7XG4gIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxdWVzdC51cmwpO1xuICBjb25zdCBwcm9tcHQgPSB1cmwuc2VhcmNoUGFyYW1zLmdldChcInByb21wdFwiKTtcbiAgY29uc3QgdmlkZW9VUkwgPSB1cmwuc2VhcmNoUGFyYW1zLmdldChcInZpZGVvVVJMXCIpO1xuXG4gIGlmICghcHJvbXB0IHx8ICF2aWRlb1VSTCkge1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkoeyBjb2RlOiBcIjQwMFwiLCByZXBseTogXCJQcm9tcHQgYW5kIHZpZGVvVVJMIGFyZSByZXF1aXJlZFwiIH0pLCB7IHN0YXR1czogNDAwIH0pO1xuICB9XG5cbiAgY29uc3QgYXBpVXJsID0gYGh0dHBzOi8vYXBpLm55eHMucHcvYWkvZ2VtaW5pLXZpZGVvP3RleHQ9JHtwcm9tcHR9JnVybD0ke3ZpZGVvVVJMfWA7XG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2hBbmRGb3JtYXRSZXNwb25zZShhcGlVcmwpO1xuICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSwgeyBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0gfSk7XG59XG5cbnNlcnZlKGFzeW5jIChyZXE6IFJlcXVlc3QpID0+IHtcbiAgY29uc3QgeyBwYXRobmFtZSB9ID0gbmV3IFVSTChyZXEudXJsKTtcblxuICBpZiAocGF0aG5hbWUgPT09IFwiL2dlbWluaVwiKSB7XG4gICAgcmV0dXJuIGdlbWluaUhhbmRsZXIocmVxKTtcbiAgfSBlbHNlIGlmIChwYXRobmFtZSA9PT0gXCIvZ2VtaW5pQWR2YW5jZVwiKSB7XG4gICAgcmV0dXJuIGdlbWluaUFkdmFuY2VIYW5kbGVyKHJlcSk7XG4gIH0gZWxzZSBpZiAocGF0aG5hbWUgPT09IFwiL3JlYWRJbWFnZVwiKSB7XG4gICAgcmV0dXJuIHJlYWRJbWFnZUhhbmRsZXIocmVxKTtcbiAgfSBlbHNlIGlmIChwYXRobmFtZSA9PT0gXCIvdmlkZW9cIikge1xuICAgIHJldHVybiB2aWRlb0hhbmRsZXIocmVxKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgY29kZTogXCI0MDRcIiwgcmVwbHk6IFwiRW5kcG9pbnQgbm90IGZvdW5kXCIgfSksIHsgc3RhdHVzOiA0MDQgfSk7XG4gIH1cbn0sIHsgYWRkcjogXCI6ODA4MFwiIH0pO1xuXG5jb25zb2xlLmxvZyhcIlNlcnZlciBydW5uaW5nIG9uIGh0dHA6Ly9sb2NhbGhvc3Q6ODA4MFwiKTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTLEtBQUssUUFBUSwrQ0FBK0M7QUFFckUsZUFBZSx1QkFBdUIsR0FBVyxFQUFFO0lBQ2pELElBQUk7UUFDRixNQUFN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