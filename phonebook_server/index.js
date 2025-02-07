import "dotenv/config";
import express, { request } from "express";
import morgan from "morgan";
import cors from "cors";
import Person from "./models/person.js";

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger)
app.use(express.static("dist"));

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(express.urlencoded({ extended: true }));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (req, res) => {
  Person.find({}).then((person) => {
    res.json(person);
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  Node.findById(request.params.id)
  .then(person => {
    if(person){
      response.json(person)
    } else{
      response.status(400).end()
    }
  })
  .catch(error => {
    next(error)
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if(!body.name || !body.number){
    return response.status(400).json({error: 'name or number is missing.'})
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save()
  .then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => {
    next(error)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => {
    next(error)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  Person.findByIdAndUpdate(
    request.params.id, 
    { name, number },
    { new: true, runValidators: true, context: 'query'}
  )
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => {
    next(error)
  })
})

app.get("/info", (request, response, next) => {
  const date = new Date();
  Person.countDocuments({})
    .then(count => {
      response.send(`<p>Phonebook has info for ${count} persons!<p/>
        <p> ${date} <p/>`);
    })
    .catch(error => next(error));
});

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
