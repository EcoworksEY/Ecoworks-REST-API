// Testing SSH

const { createSSHTunnel } = require('../middleware/ssh_connector');
const ssh_router = require('express').Router();

ssh_router.get('/run', (req, res) => {
    // Just initiating this
    createSSHTunnel()
      .then((sshTunnel) => {
        console.log('SSH Tunnel established successfully!');
        res.status(200).json({ message: 'SSH Tunnel works. Closing now.'})

        sshTunnel.close();
      })
      .catch((error) => {
        console.error('Error creating SSH Tunnel:', error);
        res.status(500).json({ message: 'Internal Server error.'});
      });
    
});

module.exports = ssh_router;