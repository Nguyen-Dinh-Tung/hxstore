const env = {
  NODE_ENV: 'production',
};
module.exports = {
  apps: [
    {
      name: 'hx-admin',
      script: './dist/apps/user/main.js',
      env,
      time: true,
    },
    {
      name: 'hx-user',
      script: './dist/apps/admin/main.js',
      env,
      time: true,
    },
  ],
};
