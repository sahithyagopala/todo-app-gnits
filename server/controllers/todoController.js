const Todo = require("../models/Todo");

// GET /api/todos
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/todos
const createTodo = async (req, res) => {
  try {
    const title = req.body.title?.trim();

    if (!title) {
      return res.status(400).json({ message: "Todo title is required" });
    }

    const newTodo = await Todo.create({ title, completed: false });
    res.status(201).json(newTodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/todos/:id
const updateTodo = async (req, res) => {
  try {
    const updates = {};

    if (req.body.title !== undefined) {
      const title = req.body.title.trim();
      if (!title) {
        return res.status(400).json({ message: "Todo title cannot be empty" });
      }
      updates.title = title;
    }

    if (req.body.completed !== undefined) {
      updates.completed = Boolean(req.body.completed);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided" });
    }

    const todo = await Todo.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid todo id" });
    }

    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/todos/:id
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted" });
  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid todo id" });
    }

    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
