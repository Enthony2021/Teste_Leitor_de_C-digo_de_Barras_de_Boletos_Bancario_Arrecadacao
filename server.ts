import app from './src/index';
const port = 8080

const server = app.listen(port, () => {
  console.log(`Server running on: http://localhost:${port}/boleto/`);
});

process.on('SIGINT', () => {
  server.close();
  console.log("server closed!");
});