const { spawn } = require('child_process');
const path = require('path');

const port = process.env.PORT || '3000';
const serveEntrypoint = path.join(__dirname, '..', 'node_modules', 'serve', 'build', 'main.js');

const child = spawn(process.execPath, [serveEntrypoint, '-s', 'build', '-l', port], {
  stdio: 'inherit',
  shell: false,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
