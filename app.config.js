module.exports = {
  apps: [{
    name: 'weltenbummlerpaar-backend',
    script: 'dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      DEBUG: 'weltenbummlerpaar-backend:*',
    },
  }],
};
