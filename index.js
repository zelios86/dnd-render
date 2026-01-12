const express = require("express");
const app = express();

function calcolaBonusCompetenza(livello) {
    if (livello >= 17) return 6;
    if (livello >= 13) return 5;
    if (livello >= 9) return 4;
    if (livello >= 5) return 3;
    return 2;
  }

app.get("/", (req, res) => {
  res.send("La mia app D&D è !");
});

app.get("/personaggi", (req, res) => {
  res.json([
    {
      nome: "Eldrin",
      classe: "Mago",
      livello: 3
    }
  ]);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server avviato");
});