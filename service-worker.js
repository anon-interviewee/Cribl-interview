importScripts('https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js');

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only intercept .jsx file requests
  if (url.pathname.endsWith('.jsx')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response so we can read it twice
          const responseClone = response.clone();
          
          // Process the response only if it's successful
          if (response.ok) {
            return responseClone.text().then(code => {
              try {
                // Transpile the JSX code using Babel
                const transformedCode = Babel.transform(code, {
                  presets: ['react'],
                  filename: url.pathname,
                  sourceType: 'module'
                }).code;
                
                // Create and return a new response with the transpiled code
                // Set the correct MIME type for JavaScript modules
                const headers = new Headers(response.headers);
                headers.set('Content-Type', 'application/javascript');
                
                return new Response(transformedCode, {
                  status: response.status,
                  statusText: response.statusText,
                  headers: headers
                });
              } catch (error) {
                console.error('Error transpiling JSX:', error);
                // Return original response if transpilation fails
                return response;
              }
            });
          }
          
          // Return the original response if not OK
          return response;
        })
        .catch(error => {
          console.error('Fetch error:', error);
          return new Response(`// Error fetching ${url.pathname}: ${error}`, {
            status: 500,
            headers: { 'Content-Type': 'application/javascript' }
          });
        })
    );
  }
});