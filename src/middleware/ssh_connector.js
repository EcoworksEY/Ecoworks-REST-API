// SSH Tunnel Connector
// Written by Bardia Habib Khoda

const tunnel = require('tunnel-ssh');
const fs = require('fs');

const sshConfig = {
  username: process.env.EC2_USER,
  privateKey: fs.readFileSync(process.env.SSH_KEY_FILE_PATH_LOCAL),
  host: process.env.EC2_GATEWAY_HOST,
  port: 22,
  dstHost: process.env.DB_HOST,
  dstPort: process.env.DB_PORT,
  localHost: '127.0.0.1',
  localPort: process.env.DB_PORT,
};

const createSSHTunnel = () => {
  return new Promise((resolve, reject) => {
    const sshTunnel = tunnel(sshConfig, (error, server) => {
      if (error) {
        console.error('Error establishing SSH tunnel:', error);
        reject(error);
      } else {
        console.log('SSH Tunnel is ready.');
        resolve(sshTunnel);
      }
    });

    sshTunnel.on('error', (error) => {
      console.error('SSH Tunnel error:', error);
      reject(error);
    });
  });
};

module.exports = createSSHTunnel;
