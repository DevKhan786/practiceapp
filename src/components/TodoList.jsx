import React, { useEffect, useState } from "react";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const localTodos = localStorage.getItem("todos");
    if (localTodos) {
      try {
        const parsedTodos = JSON.parse(localTodos);
        if (Array.isArray(parsedTodos)) {
          setTasks(parsedTodos);
        } else {
          setTasks([]);
        }
      } catch (e) {
        setTasks([]);
      }
    }
  }, []);

  function persistData(newList) {
    localStorage.setItem("todos", JSON.stringify(newList));
  }

  function handleInput(event) {
    setTodoValue(event.target.value);
  }

  function addTask() {
    if (todoValue.trim() === "") return;
    const newList = [
      ...tasks,
      {
        text: todoValue,
        completed: false,
      },
    ];
    setTasks(newList);
    persistData(newList);
    setTodoValue("");
  }

  function filteredTasks() {
    if (filter === "All") return tasks;
    if (filter === "Completed") return tasks.filter((task) => task.completed);
    if (filter === "Incomplete") return tasks.filter((task) => !task.completed);
    return [];
  }

  function toggleCompleted(index) {
    const newList = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newList);
    persistData(newList);
  }

  function editTask(index) {
    setTodoValue(tasks[index].text);
    deleteTask(index);
  }

  function deleteTask(index) {
    const newList = tasks.filter((task, i) => i !== index);
    setTasks(newList);
    persistData(newList);
  }

  function moveTaskUp(index) {
    if (index > 0) {
      const newList = [...tasks];
      [newList[index - 1], newList[index]] = [
        newList[index],
        newList[index - 1],
      ];
      setTasks(newList);
      persistData(newList);
    }
  }

  function moveTaskDown(index) {
    if (index < tasks.length - 1) {
      const newList = [...tasks];
      [newList[index + 1], newList[index]] = [
        newList[index],
        newList[index + 1],
      ];
      setTasks(newList);
      persistData(newList);
    }
  }

  return (
    <>
      <div className="container">
        <h1>Todo-App</h1>
        <div className="inputs">
          <input
            type="text"
            placeholder="Enter task"
            value={todoValue}
            onChange={handleInput}
          />
          <button onClick={addTask}>Add Task</button>
        </div>
        <div className="filters">
          <button onClick={() => setFilter("All")}>All</button>
          <button onClick={() => setFilter("Completed")}>Completed</button>
          <button onClick={() => setFilter("Incomplete")}>Incomplete</button>
        </div>
        <ul>
          {filteredTasks().map((task, index) => (
            <li key={index}>
              <span>{task.text}</span>
              <div className="task-actions">
                <button onClick={() => editTask(index)}>Edit</button>
                <button onClick={() => deleteTask(index)}>Delete</button>
                <button onClick={() => moveTaskUp(index)}>Up</button>
                <button onClick={() => moveTaskDown(index)}>Down</button>
                <button onClick={() => toggleCompleted(index)}>
                  {task.completed ? "Undo" : "Complete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
