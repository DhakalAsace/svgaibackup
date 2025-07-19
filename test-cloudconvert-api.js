/**
 * CloudConvert API v2 Test for AI to SVG Conversion
 * 
 * This demonstrates the complete workflow:
 * 1. Upload file
 * 2. Create conversion task
 * 3. Wait for completion
 * 4. Download result
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const API_KEY = process.env.CLOUDCONVERT_API_KEY || '';
const BASE_URL = 'https://api.cloudconvert.com/v2';

if (!API_KEY) {
  console.error('❌ CLOUDCONVERT_API_KEY environment variable is required');
  process.exit(1);
}

/**
 * Make an HTTPS request to CloudConvert API
 */
function apiRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${parsed.message || body}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Upload file to URL with form data
 */
function uploadFile(uploadUrl, formParams, fileBuffer, filename) {
  return new Promise((resolve, reject) => {
    const boundary = '----FormBoundary' + Math.random().toString(36);
    const url = new URL(uploadUrl);
    
    // Build multipart form data
    let body = '';
    
    // Add form parameters
    for (const [key, value] of Object.entries(formParams)) {
      body += `--${boundary}\r\n`;
      body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
      body += `${value}\r\n`;
    }
    
    // Add file
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`;
    body += `Content-Type: application/octet-stream\r\n\r\n`;
    
    const endBoundary = `\r\n--${boundary}--\r\n`;
    
    // Calculate total length
    const bodyBuffer = Buffer.from(body);
    const endBuffer = Buffer.from(endBoundary);
    const totalLength = bodyBuffer.length + fileBuffer.length + endBuffer.length;
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': totalLength
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ statusCode: res.statusCode, body: responseBody });
        } else {
          reject(new Error(`Upload failed ${res.statusCode}: ${responseBody}`));
        }
      });
    });

    req.on('error', reject);
    
    // Write multipart data
    req.write(bodyBuffer);
    req.write(fileBuffer);
    req.write(endBuffer);
    req.end();
  });
}

/**
 * Download file from URL
 */
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Download failed: ${res.statusCode}`));
        return;
      }
      
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
  });
}

/**
 * Wait for task to complete
 */
async function waitForTask(taskId, maxWaitTime = 60000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    const response = await apiRequest('GET', `/tasks/${taskId}`);
    const task = response.data;
    
    console.log(`⏳ Task status: ${task.status}`);
    
    if (task.status === 'finished') {
      return task;
    }
    
    if (task.status === 'error') {
      throw new Error(`Task failed: ${task.message || 'Unknown error'}`);
    }
    
    // Wait 2 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error('Task timeout');
}

/**
 * Complete AI to SVG conversion workflow
 */
async function convertAiToSvg(aiFilePath) {
  try {
    console.log('🚀 Starting AI to SVG conversion...\n');
    
    // Read the AI file
    const fileBuffer = fs.readFileSync(aiFilePath);
    const filename = path.basename(aiFilePath);
    
    console.log(`📄 File: ${filename} (${fileBuffer.length} bytes)\n`);
    
    // Step 1: Create import/upload task
    console.log('1️⃣ Creating upload task...');
    const uploadTask = await apiRequest('POST', '/import/upload');
    const uploadTaskId = uploadTask.data.id;
    const uploadUrl = uploadTask.data.result.form.url;
    const uploadParams = uploadTask.data.result.form.parameters;
    
    console.log(`✅ Upload task created: ${uploadTaskId}`);
    console.log(`📤 Upload URL: ${uploadUrl}\n`);
    
    // Step 2: Upload the file
    console.log('2️⃣ Uploading file...');
    await uploadFile(uploadUrl, uploadParams, fileBuffer, filename);
    console.log('✅ File uploaded successfully\n');
    
    // Step 3: Create conversion task
    console.log('3️⃣ Creating conversion task...');
    const conversionTask = await apiRequest('POST', '/convert', {
      input: uploadTaskId,
      output_format: 'svg',
      engine: 'inkscape' // CloudConvert uses Inkscape for AI to SVG
    });
    const conversionTaskId = conversionTask.data.id;
    
    console.log(`✅ Conversion task created: ${conversionTaskId}\n`);
    
    // Step 4: Wait for conversion to complete
    console.log('4️⃣ Waiting for conversion...');
    const completedTask = await waitForTask(conversionTaskId);
    console.log('✅ Conversion completed\n');
    
    // Step 5: Create export task
    console.log('5️⃣ Creating export task...');
    const exportTask = await apiRequest('POST', '/export/url', {
      input: conversionTaskId,
      inline: false,
      archive_multiple_files: false
    });
    const exportTaskId = exportTask.data.id;
    
    console.log(`✅ Export task created: ${exportTaskId}\n`);
    
    // Step 6: Wait for export to complete
    console.log('6️⃣ Waiting for export...');
    const exportedTask = await waitForTask(exportTaskId);
    const downloadUrl = exportedTask.result.files[0].url;
    
    console.log(`✅ Export completed`);
    console.log(`📥 Download URL: ${downloadUrl}\n`);
    
    // Step 7: Download the SVG file
    console.log('7️⃣ Downloading SVG file...');
    const svgBuffer = await downloadFile(downloadUrl);
    
    // Save the SVG file
    const outputPath = aiFilePath.replace(/\.ai$/i, '_converted.svg');
    fs.writeFileSync(outputPath, svgBuffer);
    
    console.log(`✅ SVG saved to: ${outputPath}`);
    console.log(`📊 Size: ${svgBuffer.length} bytes\n`);
    
    // Display SVG preview
    const svgContent = svgBuffer.toString('utf8');
    console.log('🎨 SVG Preview (first 500 chars):');
    console.log(svgContent.substring(0, 500) + '...\n');
    
    console.log('🎉 Conversion completed successfully!');
    
  } catch (error) {
    console.error('❌ Conversion failed:', error.message);
    process.exit(1);
  }
}

// Alternative: Use Jobs API for a more streamlined approach
async function convertAiToSvgWithJobs(aiFilePath) {
  try {
    console.log('🚀 Starting AI to SVG conversion using Jobs API...\n');
    
    // Read the AI file
    const fileBuffer = fs.readFileSync(aiFilePath);
    const filename = path.basename(aiFilePath);
    
    console.log(`📄 File: ${filename} (${fileBuffer.length} bytes)\n`);
    
    // Create a job with all tasks
    console.log('1️⃣ Creating conversion job...');
    const job = await apiRequest('POST', '/jobs', {
      tasks: {
        'import-file': {
          operation: 'import/upload'
        },
        'convert-file': {
          operation: 'convert',
          input: 'import-file',
          output_format: 'svg',
          engine: 'inkscape'
        },
        'export-file': {
          operation: 'export/url',
          input: 'convert-file'
        }
      }
    });
    
    const jobId = job.data.id;
    const uploadTask = job.data.tasks.find(t => t.name === 'import-file');
    
    console.log(`✅ Job created: ${jobId}`);
    console.log(`📤 Upload task: ${uploadTask.id}\n`);
    
    // Upload the file
    console.log('2️⃣ Uploading file...');
    const uploadUrl = uploadTask.result.form.url;
    const uploadParams = uploadTask.result.form.parameters;
    
    await uploadFile(uploadUrl, uploadParams, fileBuffer, filename);
    console.log('✅ File uploaded successfully\n');
    
    // Wait for job to complete
    console.log('3️⃣ Waiting for job to complete...');
    const completedJob = await waitForJob(jobId);
    
    // Get export task result
    const exportTask = completedJob.tasks.find(t => t.name === 'export-file');
    const downloadUrl = exportTask.result.files[0].url;
    
    console.log(`✅ Job completed`);
    console.log(`📥 Download URL: ${downloadUrl}\n`);
    
    // Download and save the SVG
    console.log('4️⃣ Downloading SVG file...');
    const svgBuffer = await downloadFile(downloadUrl);
    
    const outputPath = aiFilePath.replace(/\.ai$/i, '_converted_job.svg');
    fs.writeFileSync(outputPath, svgBuffer);
    
    console.log(`✅ SVG saved to: ${outputPath}`);
    console.log('🎉 Conversion completed successfully!');
    
  } catch (error) {
    console.error('❌ Conversion failed:', error.message);
    process.exit(1);
  }
}

async function waitForJob(jobId, maxWaitTime = 60000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    const response = await apiRequest('GET', `/jobs/${jobId}`);
    const job = response.data;
    
    console.log(`⏳ Job status: ${job.status}`);
    
    if (job.status === 'finished') {
      return job;
    }
    
    if (job.status === 'error') {
      const errorTask = job.tasks.find(t => t.status === 'error');
      throw new Error(`Job failed: ${errorTask?.message || 'Unknown error'}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error('Job timeout');
}

// Test the conversion
const testFile = process.argv[2];

if (!testFile) {
  console.log('Usage: node test-cloudconvert-api.js <path-to-ai-file>');
  console.log('\nExample: node test-cloudconvert-api.js test.ai');
  process.exit(1);
}

if (!fs.existsSync(testFile)) {
  console.error(`❌ File not found: ${testFile}`);
  process.exit(1);
}

// Use the individual tasks approach (more control)
convertAiToSvg(testFile);

// Or use the Jobs API approach (simpler)
// convertAiToSvgWithJobs(testFile);