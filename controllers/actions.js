const bcrypt = require("bcrypt");
const { authenticate } = require("../middlewares/auth.js");
const { createDoc, MarkDone, del, list, delAll, addUser } = require("../middlewares/midActions.js")

// ! user sign up
const signUp = async (req, res) => {
    try {
        const hashedpassword = await bcrypt.hash(req.body.password, 10);
        const user = { name: req.body.name, password: hashedpassword };
        const result = await addUser(user);
        res.status(201).send(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

/*
? get requests : 
1. to get list of all tasks
2. to get list of completed tasks
3. to get list of pending tasks
? post requests : 
1. creation of to-do
? put req:
1. to update the status
? delete req:
1. to delete specific/all to-do
? head req:
1. to get the head of res
*/


// ! add task
const addTask = async (req, res) => {
    const user = req.query;
    const verification = await authenticate(user);
    if (verification) {
        const output = await createDoc(req.body.task, user.name);
        res.status(201).send(output);
    } else {
        res.status(403).send("Unauthenticated access denied !");
    }
};

//  ! update task status
const update = async (req, res) => {
    const user = req.query;
    const verification = await authenticate(user);
    if (verification) {
        try {
            const output = await MarkDone(req.body.task, user.name);
            // 202 : accepted
            res.status(200).send(output);
        } catch (error) {
            res.status(400).send(error);
        }
    } else {
        res.status(403).send("Unauthenticated access denied !");
    }
};

//  ! Get all tasks
const getList = async (req, res) => {
    const user = req.query;
    const verification = await authenticate(user);
    if (verification) {
        const output = await list(req.params.getP, user.name);
        res.status(200).send(output);
    } else {
        res.status(403).send("Unauthenticated access denied !");
    }
};

// ! Delete all tasks
const remove = async (req, res) => {
    if (req.params.rmP === "all") {
        const user = req.query;
        const verification = await authenticate(user);
        if (verification) {
            try {
                await delAll("yes", user.name);
                res.status(204).end();
            } catch (error) {
                res.status(400).send(error);
            }
        } else {
            res.status(403).send("Unauthenticated access denied ! one");
        }
    } else {
        const user = req.query;
        const verification = await authenticate(user);
        if (verification) {
            try {
                await del(req.params.rmP, user.name);
                // 204 : successful request without any response
                res.status(204).end();
            } catch (error) {
                res.status(400).send(error);
            }
        } else {
            res.status(403).send("Unauthenticated access denied ! two");
        }
    }
};

module.exports = { addTask, update, remove, getList, signUp }