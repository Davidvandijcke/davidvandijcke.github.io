# Deployment Guide for Research Assistant

This guide explains how to deploy the AI research assistant to Hugging Face Spaces.

## Option 1: Simple Version (No API Keys Required)

The simple version uses a rule-based system and doesn't require any API keys.

### Steps:

1. **Create a Hugging Face account** at https://huggingface.co/

2. **Create a new Space**:
   - Go to https://huggingface.co/spaces
   - Click "Create new Space"
   - Choose a name (e.g., "david-research-assistant")
   - Select "Gradio" as the SDK
   - Choose "Public" visibility
   - Click "Create Space"

3. **Upload files**:
   - Upload `app_simple.py` as `app.py`
   - Upload `requirements_simple.txt` as `requirements.txt`
   - Upload the `README.md` file

4. **Wait for deployment**:
   - The Space will automatically build and deploy
   - Once ready, you'll get a public URL

5. **Update your website**:
   - Replace the placeholder API endpoint in the about.md file with your Hugging Face Space URL

## Option 2: Advanced Version (With Document Processing)

The advanced version can read your PDFs and provide more detailed responses.

### Prerequisites:
- Hugging Face API token (free from https://huggingface.co/settings/tokens)

### Steps:

1. **Prepare documents**:
   - Create a `documents` folder in the Space
   - Upload your PDFs and CV to this folder

2. **Set up secrets**:
   - In your Space settings, go to "Settings" > "Variables and secrets"
   - Add `HUGGINGFACEHUB_API_TOKEN` with your token

3. **Upload files**:
   - Upload `app.py`
   - Upload `requirements.txt`
   - Upload the `README.md` file
   - Upload your PDF documents

4. **Update the code**:
   - Modify the `pdf_dir` path in `app.py` to point to your documents folder

## Integrating with Your Website

Once deployed, update the chat interface in your about.md file:

```javascript
// Replace the placeholder API call with:
const response = await fetch('YOUR_HUGGINGFACE_SPACE_URL/api/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    data: [message, []]  // message and history
  })
});

const data = await response.json();
const botResponse = data.data[0];
```

## Testing

1. Visit your Hugging Face Space URL
2. Try asking questions like:
   - "What are David's research interests?"
   - "Tell me about his publications"
   - "What methods has he developed?"

## Customization

You can customize the assistant by:
- Updating the knowledge base in `app_simple.py`
- Adding more documents to the advanced version
- Modifying the UI theme and colors
- Adding more example questions

## Troubleshooting

- If the Space fails to build, check the logs in the "Logs" tab
- Ensure all file paths are correct
- For the advanced version, verify your API token is set correctly
- Check that gradio version matches in requirements.txt

## Next Steps

After deployment:
1. Test the assistant thoroughly
2. Share the Space URL for feedback
3. Monitor usage and improve responses
4. Consider adding more advanced features like:
   - Multi-language support
   - Citation tracking
   - Email notifications for interesting questions