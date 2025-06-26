// Simple API endpoint to check if FFMPEG is installed
const { exec } = require('child_process');

module.exports = (req, res) => {
  exec('ffmpeg -version', (error, stdout, stderr) => {
    if (error) {
      console.error('FFMPEG check error:', error);
      return res.json({ 
        installed: false, 
        error: 'FFMPEG is not installed or not in PATH'
      });
    }
    
    return res.json({ 
      installed: true, 
      version: stdout.split('\n')[0]
    });
  });
};