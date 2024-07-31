# Deno API Server

This is a simple Deno server that provides various API endpoints for interacting with different services. The server handles requests and formats responses based on the specific endpoint used.

## Endpoints

### `/gemini`

Fetches a response from the Gemini API.

- **Request**: `GET /gemini?prompt=your_prompt_here`
- **Response**:
  ```json
  {
    "code": "200",
    "reply": "Response from Gemini API"
  }
  ```

### `/geminiAdvance`

Fetches a response from the Gemini Advance API.

- **Request**: `GET /geminiAdvance?prompt=your_prompt_here`
- **Response**:
  ```json
  {
    "code": "200",
    "reply": "Response from Gemini Advance API"
  }
  ```

### `/readImage`

Fetches a response based on an image URL and prompt.

- **Request**: `GET /readImage?prompt=your_prompt_here&imgURL=your_image_url_here`
- **Response**:
  ```json
  {
    "code": "200",
    "reply": "Response based on image URL"
  }
  ```

### `/video`

Fetches a response based on a video URL and prompt.

- **Request**: `GET /video?prompt=your_prompt_here&videoURL=your_video_url_here`
- **Response**:
  ```json
  {
    "code": "200",
    "reply": "Response based on video URL"
  }
  ```

## Running the Server

To run the server, you need to have [Deno](https://deno.land/) installed.

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Run the server**:
   ```bash
   deno run --allow-net index.ts
   ```

   This command will start the server on `http://localhost:8080`.

## Permissions

The server requires the following permissions:

- `--allow-net`: To allow network access for making API requests.
- `--allow-read`: To read files (if applicable).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.