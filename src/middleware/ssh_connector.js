// SSH Tunnel Connector
// Written by Bardia Habib Khoda

const { createTunnel } = require('tunnel-ssh');
const fs = require('fs');

const sshConfig = {
  username: process.env.EC2_USER,
  privateKey: fs.readFileSync('C:\\Users\\XK444SM\\Downloads\\ecoworks-database.pem'),
  host: process.env.EC2_GATEWAY_HOST,
  port: 22,
  dstHost: process.env.DB_HOST,
  dstPort: process.env.DB_PORT,
  localHost: '127.0.0.1',
  localPort: process.env.DB_PORT,
};

async function createSSHTunnel() {
  return new Promise((resolve, reject) => {
    const sshTunnel = createTunnel(sshConfig, (error, server) => {
      if (error) {
        console.error('Error establishing SSH tunnel:', error);
        reject(error);
      } else {
        console.log('SSH Tunnel is ready.');
        resolve(sshTunnel);
      }
    });
  });
};

module.exports = { createSSHTunnel };
