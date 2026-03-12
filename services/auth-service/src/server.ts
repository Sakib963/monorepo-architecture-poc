import Hapi from '@hapi/hapi';
import { routes } from './routes';

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'], // Allow all origins for POC
        credentials: true,
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`🚀 Auth Service running on ${server.info.uri}`);
  console.log('\nAvailable endpoints:');
  console.log('  GET  / - Service status');
  console.log('  POST /auth/login - Login with credentials');
  console.log('  GET  /auth/me - Get current user');
  console.log('\nTest credentials:');
  console.log('  User:  user@example.com / user123');
  console.log('  Admin: admin@example.com / admin123');

  return server;
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

init();
