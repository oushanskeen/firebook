import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
import * as express from "express";

export const moderator = functions.https.onRequest((request, response) => {
  const description = request.query.description;
  if (!description) {
    response.status(400).send("Skoro zdes budet opisaniye...");
  }
  response.send(`${description}`);
});

const app = express();
const books = [
  {id: 1, data: "bookOne"},
  {id: 2, data: "bookTwo"},
];
app.get("/api/books", (req, res) => {
  res.send(books);
});
app.get("/api/books/:id", (req, res) => {
  const theBook = books.filter(({id}) => id === +req.params.id);
  !theBook ? res.status(404).send("No such book") : theBook;
});
app.post("/api/books", (req, res) => {
  const newLib = [...books, req.query.newbook];
  res.send(newLib[newLib.length - 1]);
});
app.put("/api/books/:id", (req, res) => {
  const oldBook = books.filter(({id}) => id === +req.params.id);
  !oldBook ?
    res.status(404).send("No such book") :
    (() => {
      const newBook = {...oldBook, data: req.query.data};
      const theRest = books.filter(({id}) => id !== +req.params.id);
      const newLib = [...theRest, newBook];
      res.send("Book is updated!");
      return newLib;
    })();
});
app.delete("/api/books", (req, res) => {
  books.filter(({id}) => id !== +req.params.id);
  res.send("ok");
});
export const api = functions.https.onRequest(app);
