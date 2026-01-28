import { useState } from 'react'
import './App.css'

function App() {
  const [list, setList] = useState([])
  const [task, setTask] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [priority, setPriority] = useState('Medium')

  const [filter, setFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Date')
  const [searchQuery, setSearchQuery] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editTaskId, setEditTaskId] = useState(null)
  const [editTask, setEditTask] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editTime, setEditTime] = useState('')
  const [editPriority, setEditPriority] = useState('Medium')

  // ADD TASK
  const addTask = () => {
    if (!task.trim()) return

    const newTask = {
      id: Date.now(),
      task,
      completed: false,
      date,
      time,
      priority
    }

    setList([...list, newTask])
    setTask('')
    setDate('')
    setTime('')
    setPriority('Medium')
  }

  // TOGGLE COMPLETE
  const toggleCompletion = (id) => {
    setList(
      list.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  // DELETE TASK
  const deleteTask = (id) => {
    setList(list.filter(item => item.id !== id))
  }

  // OPEN EDIT MODAL
  const openEditModal = (id) => {
    const item = list.find(t => t.id === id)
    if (!item) return

    setEditTaskId(id)
    setEditTask(item.task)
    setEditDate(item.date)
    setEditTime(item.time)
    setEditPriority(item.priority)
    setShowModal(true)
  }

  // CLOSE EDIT MODAL
  const closeEditModal = () => {
    setShowModal(false)
    setEditTaskId(null)
  }

  // SAVE EDIT
  const saveEditedTask = () => {
    setList(
      list.map(item =>
        item.id === editTaskId
          ? {
              ...item,
              task: editTask,
              date: editDate,
              time: editTime,
              priority: editPriority
            }
          : item
      )
    )
    closeEditModal()
  }

  // FILTER + SEARCH + SORT
  const filteredList = list
    .filter(item => {
      if (filter === 'Completed') return item.completed
      if (filter === 'Pending') return !item.completed
      return true
    })
    .filter(item =>
      item.task.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'Date') {
        return new Date(a.date || 0) - new Date(b.date || 0)
      }
      if (sortBy === 'Priority') {
        const order = { High: 1, Medium: 2, Low: 3 }
        return order[a.priority] - order[b.priority]
      }
      return 0
    })

  return (
    <>
     <div className="bg-black min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-6xl text-white mb-6">Todo List</h1>

      {/* ADD TASK */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Task"
          value={task}
          onChange={e => setTask(e.target.value)}
          className="px-4 py-2 mr-2 rounded-lg bg-gray-900 text-yellow-300"
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="px-4 py-2 mr-2 rounded-lg bg-gray-900 text-yellow-300"
        />
        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          className="px-4 py-2 mr-2 rounded-lg bg-gray-900 text-yellow-300"
        />
        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
          className="px-4 py-2 mr-2 rounded-lg bg-gray-900 text-yellow-300"
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <button
          onClick={addTask}
          className="bg-yellow-300 px-4 py-2 rounded-lg font-semibold"
        >
          Add
        </button>
      </div>

      {/* FILTERS */}
      <div className="mb-6">
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-2 mr-2 rounded-lg bg-gray-900 text-yellow-300"
        >
          <option>All</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-4 py-2 mr-2 rounded-lg bg-gray-900 text-yellow-300"
        >
          <option>Date</option>
          <option>Priority</option>
        </select>

        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-900 text-yellow-300"
        />
      </div>

      {/* TASK LIST */}
      <ul>
        {filteredList.map(item => (
          <li
            key={item.id}
            className="bg-gray-800 text-yellow-300 p-4 mb-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleCompletion(item.id)}
                className="mr-2"
              />
              <span className={item.completed ? 'line-through' : ''}>
                {item.task}
              </span>
              <div className="text-sm">
                {item.date} {item.time} | {item.priority}
              </div>
            </div>

            <div>
              <button
                onClick={() => openEditModal(item.id)}
                className="bg-green-500 px-3 py-1 mr-2 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(item.id)}
                className="bg-red-500 px-3 py-1 rounded-lg"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96 text-yellow-300">
            <h2 className="text-2xl mb-4">Edit Task</h2>

            <input
              type="text"
              value={editTask}
              onChange={e => setEditTask(e.target.value)}
              className="w-full mb-2 px-3 py-2 rounded bg-gray-900"
            />
            <input
              type="date"
              value={editDate}
              onChange={e => setEditDate(e.target.value)}
              className="w-full mb-2 px-3 py-2 rounded bg-gray-900"
            />
            <input
              type="time"
              value={editTime}
              onChange={e => setEditTime(e.target.value)}
              className="w-full mb-2 px-3 py-2 rounded bg-gray-900"
            />
            <select
              value={editPriority}
              onChange={e => setEditPriority(e.target.value)}
              className="w-full mb-4 px-3 py-2 rounded bg-gray-900"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <div className="flex justify-end">
              <button
                onClick={closeEditModal}
                className="bg-gray-600 px-4 py-2 mr-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedTask}
                className="bg-yellow-300 px-4 py-2 rounded-lg text-gray-900"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      </div> 
    </>
  )
}

export default App
