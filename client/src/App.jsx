import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');

  // ✅ Fetch all todos
  function getalltodos() {
    axios
      .get('http://localhost:3000/getalltodos')
      .then((res) => {
        setTodos(res.data.data);
      })
      .catch((err) => {
        console.error('Error fetching todos:', err);
      });
  }

  useEffect(() => {
    getalltodos();
  }, []); // ✅ run only once when component mounts

  // ✅ Add new todo
  const addTodo = () => {
    if (name.trim() && age.trim()) {
      axios
        .post('http://localhost:3000/addtodo', {
          name: name.trim(),
          age: parseInt(age),
        })
        .then(() => {
          toast.success('Successfully added!');
          getalltodos(); // refresh list
        })
        .catch((err) => {
          console.error('Error adding todo:', err);
        });
    }
    setName('');
    setAge('');
  };

  // ✅ Delete todo
  const deleteTodo = (id) => {
    axios
      .delete(`http://localhost:3000/deletetodo/${id}`)
      .then(() => {
        toast.success('Successfully deleted!');
        getalltodos(); // refresh list
      })
      .catch((err) => {
        console.error('Error deleting todo:', err);
      });
  };

  // ✅ Toggle complete (local only, not saved in DB)
  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // ✅ Start edit
  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditName(todo.name);
    setEditAge(todo.age);
  };

  // ✅ Save edit
  const saveEdit = () => {
    axios
      .patch(`http://localhost:3000/updatetodo/${editingId}`, {
        name: editName.trim(),
        age: parseInt(editAge),
      })
      .then(() => {
        toast.success('Successfully updated!');
        getalltodos(); // refresh list
      })
      .catch((err) => {
        console.error('Error updating todo:', err);
      });

    setEditingId(null);
    setEditName('');
    setEditAge('');
  };

  // ✅ Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditAge('');
  };

  // ✅ Handle Enter key
  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Todo List
      </h1>
      <Toaster />

      {/* Add Todo Form */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Add New Person
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addTodo)}
              placeholder="Enter name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Age
            </label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addTodo)}
              placeholder="Enter age"
              min="1"
              max="120"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div className="sm:self-end">
            <button
              onClick={addTodo}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Todo List */}
      {todos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No todos yet</div>
          <div className="text-gray-500">Add your first person above!</div>
        </div>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className={`p-4 rounded-lg border-2 transition ${
                todo.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {editingId === todo._id ? (
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                    min="1"
                    max="120"
                    className="w-full sm:w-24 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleComplete(todo._id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                        todo.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {todo.completed && <Check size={14} />}
                    </button>
                    <div
                      className={`${
                        todo.completed ? 'line-through text-gray-500' : ''
                      }`}
                    >
                      <span className="font-medium">{todo.name}</span>
                      <span className="text-gray-600 ml-2">
                        ({todo.age} years old)
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(todo)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {todos.length > 0 && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total: {todos.length}</span>
            <span>Completed: {todos.filter((t) => t.completed).length}</span>
            <span>Remaining: {todos.filter((t) => !t.completed).length}</span>
          </div>
        </div>
      )}
    </div>
  );
}
