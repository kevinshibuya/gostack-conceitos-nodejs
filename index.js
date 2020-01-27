const express = require('express');

const app = express();

app.use(express.json());

const users = ['Jales', 'Jaules', 'Junes']

// Middleware GLOBAL
app.use((req, res, next) => {
    console.time('Request');
    console.log(`Método: ${req.method}; URL: ${req.url}`);

    next();

    console.timeEnd('Request');
});

// Middleware LOCAL
function checkNameExists(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({ error: "Name is not defined" });
    }

    return next();
}

// Middleware LOCAL
function checkUserInArray(req, res, next) {
    const user = users[req.params.index];

    if (!user) {
        return res.status(400).json({ error: "User does not exists" });
    }

    req.user = user;

    return next();
}

// CRUD: POST(Create), GET(Read), PUT(Update), DELETE(Delete)

app.get('/users', (req, res) => {
    return res.json(users);
});

app.get('/users/:index', checkUserInArray, (req, res) => {
    return res.json(req.user);
});

app.post('/users', checkNameExists, (req, res) => {
    const { name } = req.body;

    users.push(name);

    return res.json(users);
});

app.put('/users/:index', checkUserInArray, checkNameExists, (req, res) => {
    const { index } = req.params;
    const { name } = req.body;

    users[index] = name;

    return res.json(users);
});

app.delete('/users/:index', checkUserInArray, (req, res) => {
    const { index } = req.params;

    users.splice(index, 1);

    return res.send();
});

app.listen(3000);