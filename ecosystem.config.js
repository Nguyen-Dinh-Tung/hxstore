module.exports = {
  apps: [
    {
      name: 'hx-admin',
      script: './dist/user/main.js',
      args: 'limit',
    },
    {
      name: 'hx-user',
      script: './dist/admin/main.js',
      args: 'rotate',
    },
  ],
};
