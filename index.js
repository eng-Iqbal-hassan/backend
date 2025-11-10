import express from "express";

const app = express();

app.get("/",(req,res)=>{
    res.send("resposne is sent")
})

app.get("/api/joke",(req,res)=>{
    const jokes = [
        {
            id: 1,
            title: "First Joke",
            content: "This is a joke",
        },
        {
            id: 2,
            title: "Second Joke",
            content: "This is a joke",
        },
        {
            id: 3,
            title: "Third Joke",
            content: "This is a joke",
        },
        {
            id: 4,
            title: "Fourth Joke",
            content: "This is a joke",
        },
        {
            id: 5,
            title: "Fifth Joke",
            content: "This is a joke",
        },
    ];
    res.send(jokes);
})

const PORT = 5000;

app.listen(PORT, ()=>{
    console.log(`serve at http://localhost:${PORT}`)
})