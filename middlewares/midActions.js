const { update } = require("../controllers/actions.js");
const client = require("../db/connect.js");

// ! sign up 
const addUser = async (user) => {
    try {
        const TODO = client.db("TODO");
        const users = TODO.collection("Users");
        const usersCollection = await users.find({}).toArray();
        const username = user.name;
        const exist = usersCollection.some(user => user.name === username);
        if (!exist) {
            await users.insertOne(user);
            await TODO.createCollection(user.name);
            return "Sign up Successful";
        } else {
            return "Username Exist ! Try another"
        }
    } catch (error) {
        return `Error creating document: ${error}`;
    }
}

// ! Add task
const createDoc = async (newList, username) => {
    try {
        const TODO = client.db("TODO");
        const todoList = TODO.collection(username);
        const doc = { Task: newList, Status: "Pending" };
        await todoList.insertOne(doc);
        return `The Task has been inserted Successfully`;
    } catch (error) {
        return `Error creating document : ${error}`;
    }
}

// ! update task
const MarkDone = async (task, username) => {
    try {
        const TODO = client.db("TODO");
        const todoList = TODO.collection(username);
        const query = { Task: task };
        const statusUpdate = {
            $set: {
                Status: "Done",
            }
        };
        await todoList.updateMany(query, statusUpdate);
        return `Nice, you are now one more step closer to success :)`;
    } catch (error) {
        return `Update failed : ${error}`;
    }
}

// ! Get tasks
const list = async (input, userList) => {
    try {
        const TODO = client.db("TODO");
        const todoList = TODO.collection(userList);
        let output;
        if (input === "all") {
            output = await todoList.find().toArray();
        } else {
            const flags = {
                Status: input,
            };
            output = await todoList.find(flags).toArray();
        }
        console.log(`Your List of to-dos : `);
        console.log(output)
        return output
    } catch (error) {
        console.error("Error listing tasks:", error);
        return error
    }
}

// ! Delete all tasks
const delAll = async (confirmation, username) => {
    try {
        const TODO = client.db("TODO");
        const todoList = TODO.collection(username);
        if (confirmation === "yes" || confirmation === 'YES') {
            await todoList.deleteMany();
        }
    } catch (error) {
        return `Error deleting all tasks: ${error}`;
    }
}

// ! Delete task
const del = async (task, username) => {
    try {
        const TODO = client.db("TODO");
        const todoList = TODO.collection(username);
        const query = { Task: task };
        await todoList.deleteOne(query);
    } catch (error) {
        return `Error deleting task: ${error}`;
    }
}

// Exporting the functions
module.exports = { createDoc, MarkDone, del, list, delAll, addUser }