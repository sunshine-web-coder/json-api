const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const { v4: uuidv4 } = require('uuid');

// Add middleware to parse JSON request body
server.use(jsonServer.bodyParser);

server.get("/users", (req, res) => {
  const users = router.db.get("users").value();
  res.json(users);
});

// Authenticate user
server.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = router.db.get("users").find({ username, password }).value();
  if (user) {
    res.json({ success: true, user });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }
});

// Register new user
server.post("/auth/register", (req, res) => {
  const { username, password } = req.body;
  const user = router.db.get("users").find({ username }).value();
  if (user) {
    res.status(400).json({ success: false, message: "username already exists" });
  } else {
    const newUser = { id: uuidv4(), username, password }
    router.db.get("users").push(newUser).write();
    res.json({ success: true, user: newUser });
  }
});

// Use default middlewares
server.use(middlewares);

// Use router
server.use(router);

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
