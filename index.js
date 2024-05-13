const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const port = 5000;
const secretKey = "Jolie";

app.use(bodyParser.json());

const users = [
  { id: 1, username: "kevine", password: "Niyikora" },
  { id: 2, username: "Princesse", password: "Ishimwe" },
];

//login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const token = jwt.sign(
      { id: user.id, username: user.username },
      secretKey,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

//register route
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const id = users.length + 1;
  users.push({ id, username, password });
  res.status(201).json({ message: "user registered successfully" });
});

//MiddleWare
function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ message: "Token not provided" });
  }
  jwt.verify(token.split(" ")[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

//protected route
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Protected route accessed successful", user: req.user });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
