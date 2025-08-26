const app = require("./app");

const PORT = process.env.PORT || 5000;
console.log(PORT,"PORT")

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
