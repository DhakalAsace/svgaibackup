# CloudConvert API v2 Research Report

## Overview
CloudConvert API v2 provides a robust file conversion service that supports AI (Adobe Illustrator) to SVG conversion. The API uses a job-based workflow where conversions are broken down into tasks.

## API Documentation Summary

### 1. Authentication
- **Method**: Bearer token in Authorization header
- **Format**: `Authorization: Bearer YOUR_API_KEY`
- **API Keys**: Non-expiring, created via CloudConvert dashboard
- **Required Scopes**: `task.read`, `task.write`

### 2. Complete Workflow for AI to SVG Conversion

#### Option 1: Individual Tasks Approach (More Control)

```javascript
// Step 1: Create Upload Task
POST https://api.cloudconvert.com/v2/import/upload
Response: {
  data: {
    id: "task-id",
    result: {
      form: {
        url: "https://upload.cloudconvert.com/...",
        parameters: { /* S3 upload parameters */ }
      }
    }
  }
}

// Step 2: Upload File to S3
POST [upload URL from step 1]
Content-Type: multipart/form-data
- Include all parameters from step 1
- File must be last field in form data

// Step 3: Create Conversion Task
POST https://api.cloudconvert.com/v2/convert
{
  "input": "upload-task-id",
  "output_format": "svg",
  "engine": "inkscape"  // CloudConvert uses Inkscape for AI→SVG
}

// Step 4: Wait for Conversion
GET https://api.cloudconvert.com/v2/tasks/{conversion-task-id}
Poll until status === "finished"

// Step 5: Create Export Task
POST https://api.cloudconvert.com/v2/export/url
{
  "input": "conversion-task-id",
  "inline": false,
  "archive_multiple_files": false
}

// Step 6: Wait for Export
GET https://api.cloudconvert.com/v2/tasks/{export-task-id}
Poll until status === "finished"

// Step 7: Download Result
GET [download URL from export task result]
```

#### Option 2: Jobs API Approach (Simpler)

```javascript
// Single API call to create all tasks
POST https://api.cloudconvert.com/v2/jobs
{
  "tasks": {
    "import-my-file": {
      "operation": "import/upload"
    },
    "convert-my-file": {
      "operation": "convert",
      "input": "import-my-file",
      "output_format": "svg",
      "engine": "inkscape"
    },
    "export-my-file": {
      "operation": "export/url",
      "input": "convert-my-file"
    }
  }
}

// Then upload file and wait for job completion
```

### 3. Import Methods

#### import/upload (Recommended for client uploads)
- Direct upload from client to CloudConvert
- Supports files up to 10GB
- No need to store files on your server

#### import/url
- Import from a public URL
- Good for files already hosted elsewhere

#### import/base64
- For small files (<10MB)
- Embed file directly in API request

### 4. Export Methods

#### export/url
- Generates temporary download URL
- Valid for 24 hours
- Use `?redirect=true` for direct download

#### export/s3, export/google-cloud-storage, export/azure-blob-storage
- Direct export to cloud storage
- No manual download required

### 5. Error Handling

#### HTTP Status Codes
- `200-299`: Success
- `422`: Validation error
- `429`: Rate limit exceeded
- `500`: Server error

#### Error Response Format
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "output_format": ["The output format field is required."]
  }
}
```

### 6. Progress Tracking

#### Webhooks (Recommended for production)
```javascript
// Include in job/task creation
{
  "webhook_url": "https://your-app.com/webhook",
  "events": ["job.finished", "job.failed"]
}
```

#### Polling
- Check task/job status every 2-5 seconds
- Respect rate limits

### 7. Rate Limits
- Dynamic limits based on account type
- Check headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`
- Implement exponential backoff on 429 errors

### 8. Best Practices

1. **Use Jobs API for simplicity**
   - Single request creates entire workflow
   - Easier error handling

2. **Implement proper timeouts**
   - Individual requests: 10-30 seconds
   - Overall conversion: 60-300 seconds depending on file size

3. **Handle network failures**
   - Retry failed requests with exponential backoff
   - Store job IDs for recovery

4. **Optimize for performance**
   - Use webhooks instead of polling
   - Cache conversion results when appropriate

5. **Security considerations**
   - Never expose API key to clients
   - Use server-side proxy for conversions
   - Validate file types and sizes before conversion

## Implementation in SVG AI Project

### Current Implementation (`/lib/converters/cloudconvert-client.ts`)

The existing implementation correctly follows the workflow:
1. ✅ Uploads file using import/upload
2. ✅ Creates conversion task
3. ✅ Waits for conversion completion
4. ✅ Creates export task
5. ✅ Downloads result
6. ✅ Proper error handling and timeouts

### Key Features
- Progress callbacks for UI updates
- Timeout handling at each step
- Proper S3 multipart upload formatting
- Error recovery and retry logic

### AI to SVG Specific Configuration
- **Engine**: Inkscape (CloudConvert's choice for AI files)
- **Input Format**: `ai` (also accepts PDF-compatible AI files)
- **Output Format**: `svg`
- **File Size Limit**: 100MB (reasonable for AI files)

## Testing

Use the provided test script:
```bash
node test-cloudconvert-api.js sample.ai
```

This will demonstrate the complete workflow and save the converted SVG.

## Conclusion

CloudConvert API v2 provides a reliable solution for AI to SVG conversion with:
- ✅ Full support for Adobe Illustrator files
- ✅ High-quality conversion using Inkscape engine
- ✅ Robust API with proper error handling
- ✅ Multiple import/export options
- ✅ Progress tracking capabilities

The current implementation in the SVG AI project correctly implements the CloudConvert workflow and handles all edge cases appropriately.