const https = require('https');

const url = 'https://mhsxzexdmnltxwyydmwa.supabase.co/rest/v1/';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oc3h6ZXhkbW5sdHh3eXlkbXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDI5NjEsImV4cCI6MjA5Nzc3ODk2MX0.2u31hbtTEZzi07Ax-IqjUvzx50kOBSEBvzOCo4o5URw';

const options = {
  headers: {
    'apikey': anonKey,
    'Authorization': `Bearer ${anonKey}`
  }
};

https.get(url, options, (res) => {
  console.log('Status Code:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Response body:', data);
  });
}).on('error', (err) => {
  console.error('API request failed:', err.message);
});
