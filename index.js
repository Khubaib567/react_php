const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;


// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// API endpoint
app.get('/express', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});
    
// Handles any requests that don't match the ones above
app.get('/api/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});


app.get('/php', (req, res) => {
  res.send(`
    <html>
    <body>
      <form action="/run-php" method="post">
        <button type="submit">Run PHP Script</button>
      </form>
      <div id="phpOutput"></div>
      <script>
        const form = document.querySelector('form');
        const phpOutput = document.querySelector('#phpOutput');
        
        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          const response = await fetch('/run-php', { method: 'POST' });
          const data = await response.text();
          phpOutput.textContent = data;
        });
      </script>
    </body>
    </html>
  `);
});

app.post('/run-php', (req, res) => {
  exec('php index.php', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      res.status(500).send('Error running PHP script');
      return;
    }
    res.send(stdout);
  });
});

// app.listen(port, () => {
//   console.log(`Server is listening at http://localhost:${port}`);
// });



module.exports = app;