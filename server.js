const app = require('./api/index');
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  🎓 CAMPUS LOST & FOUND PORTAL (NODE.JS + EXPRESS)`);
  console.log(`  🌐 Server running at: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
