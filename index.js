const express = require("express");
const { default: mongoose } = require("mongoose");
const todolist = require("./model/todoSchema");
const app = express();
require("dotenv").config();

app.use(express.json());

// Database connection

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Database connection error:", err));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// routes start here


// add todo

app.post("/addtodo", async (req, res) => {
  const { name, age } = req.body;

  let todo = new todolist({
    name,
    age,
  });

  await todo.save();

  res
    .status(201)
    .json({ success: true, message: "Todo added successfully", data: todo });
});

// get all todos

app.get("/getalltodos", async (req, res) => {
  try {
    const  todos = await todolist.find({});
    res
      .status(200)
      .json({ success: true, message: "Todos fetched successfully" , 
        data:todos, });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message  });
  }
});

//  find single todo by name

app.get("/findsingletodo/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const todo = await todolist.findOne({ name });
    return res.status(200).json({ success: true, message: "Todo fetched successfully", data: todo });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message  });
  }});

//   update todo by name

app.patch("/updatetodo/:id", async (req, res)=>{
    try {
        
        let {id} = req.params;
        let {name} = req.body

        let updatetodo = await todolist.findOneAndUpdate({name: id},{name},{new:true });

        return res.status(200).json({
            success:true , 
            massage: "updated",
            UpdateData: updatetodo,
        })

        
    } catch (error) {
        return res.status(500).json({
            success:false , massage: err.massage || err
        })
    }
})
