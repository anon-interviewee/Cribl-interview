# Usage

You can start it by calling `npm start` and pointing your browser to `http://localhost:8000`. Upon
visiting the page, you will see a table of data, and clicking the caret `>` symbol on the beginning of each row
will allow you to expand the row to see the JSON in a more human-readable format.

# Design

As an exercise, this application doesn't have a static build step while still using ES imports. This is done by 
using the features of babel standalone and a service worker to intercept requests to jsx files so they can be
transpiled appropriately with appropriate MIME-type replaced in the response.

If there were also more time, I'd want to explore interactivity performance as it's quite bad when rendering 50K rows.
Virtualization isn't necessarily straightforward depending on what UX compromises are suitable.

# Testing

Test can be run using `npm test`.

Testing is limited to just making sure the pretty-printing function works as expected, as it was a somewhat complicated
function. Given more time, I would have liked to include integration tests using something like cypress or puppeteer to
test that the fetchLogs function works as expected, and that the LogViewer component renders appropriately. If the function
were refactored to not use code unavailable in NodeJS, then it could probably be tested with jest alone.

The LogViewer component could also be tested using mocks with RTL, but rendering it into a full browser would just allow 
for more comprehensive testing.
