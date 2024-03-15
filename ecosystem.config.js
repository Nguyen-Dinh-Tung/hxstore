const env = {
  NODE_ENV: 'production',
};
module.exports = {
  apps: [
    {
      name: 'hx-admin',
      script: './dist/user/main.js',
      env,
      time: true,
    },
    {
      name: 'hx-user',
      script: './dist/admin/main.js',
      env,
      time: true,
    },
  ],
};
