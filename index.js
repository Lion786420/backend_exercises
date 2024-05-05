const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.json());

morgan.token("postLog", (req, res) => {
  return JSON.stringify(req.body);
});
app.use(morgan("tiny"));

persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const searchedId = Number(request.params.id);
  const searchedPerson = persons.filter((person) => person.id === searchedId);
  if (searchedPerson.length != 0) {
    response.json(searchedPerson);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const searchedId = Number(request.params.id);
  persons = persons.filter((person) => person.id !== searchedId);
  console.log(persons);
  response.status(202).end();
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`
  );
});

app.use(
  morgan(":method :postLog :status :res[content-length] - :response-time ms")
);
app.post("/api/persons", (request, response) => {
  const newPerson = request.body;
  if (newPerson.name && newPerson.number) {
    const nameFilter = persons.filter(
      (person) => person.name.toLowerCase() == newPerson.name.toLowerCase()
    );
    if (nameFilter.length > 0) {
      response.status(200).send({ error: "Name must be unique" });
    } else {
      const newContact = {
        id: Math.ceil(Math.random() * 5000),
        name: newPerson.name,
        number: newPerson.number,
      };
      persons = persons.concat(newContact);
      response.send(newContact);
    }
  } else {
    response.status(404).send({ error: "Name or number missing" });
  }
});

const PORT = 3001;
app.listen(PORT);
console.log(`Listening on port ${PORT}`);
