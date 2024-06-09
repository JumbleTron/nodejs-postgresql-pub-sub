module.exports = {
  apps: [
    {
      name: 'consumer_select',
      script: './consumer_select.js',
      instances: 5,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'consumer',
      script: './consumer.js',
      instances: 5,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};