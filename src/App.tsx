import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {v1} from "uuid";
import Todolist, { TaskType } from './Todolist';
import AddItemForm from './AddItemForm';

export type FilterValuesType = 'all' | 'active' | 'completed'

type TodolistType = {
  id: string
  title: string
  filter: FilterValuesType
}

type TasksStateType = {
  [key: string]: Array<TaskType>
}

function App() {

	const removeTask = (taskId: string, todolistId: string) => {
		let tasks = tasksObj[todolistId]
		const filteredTasks = tasks.filter((task) => {
			return task.id !== taskId
		})
		tasksObj[todolistId] = filteredTasks
		setTasks({...tasksObj})
	}

	const addTask = (title: string, todolistId: string)=> {
		const task = {id: v1(), title: title, isDone: false
		}
		let tasks = tasksObj[todolistId]

		const newtasks = [task, ...tasks]
		tasksObj[todolistId]=newtasks
		setTasks({...tasksObj})
	}

  function changeStatus (taskId: string, isDone: boolean, todolistId: string) {
    let tasks = tasksObj[todolistId]
    let task = tasks.find( t => t.id === taskId)
    if (task) {
      task.isDone = isDone
      setTasks({...tasksObj})
    }
  }
  function changeTaskTitle (taskId: string, newTitle: string, todolistId: string) {
    let tasks = tasksObj[todolistId]
    let task = tasks.find( t => t.id === taskId)
    if (task) {
      task.title = newTitle
      setTasks({...tasksObj})
    }
  }

  const changeFilter = (value: FilterValuesType, todolistId: string) => {
		let todolist = todolists.find(tl => tl.id === todolistId);
		if (todolist) {
			todolist.filter = value; /* value - 'all' | 'active' | 'completed' from FilterValuesType. */
			setTodolists([...todolists])
		}
	}

  let todolistId1 = v1()
  let todolistId2 = v1()

  let [todolists, setTodolists] = useState<Array<TodolistType>>([
    {id: todolistId1, title: "what to learn", filter: "all"},
    {id: todolistId2, title: "what to learn", filter: "all"},
  ])

  let removeTodolist = (todolistId: string) => {
    let filteredTodolist = todolists.filter(tl => tl.id !== todolistId)
    setTodolists(filteredTodolist)
    delete tasksObj[todolistId]
    setTasks({...tasksObj})
  }

  let [tasksObj, setTasks] = useState<TasksStateType>({
    [todolistId1]: [
      {id: v1(), title: 'HTML&CSS', isDone: true},
      {id: v1(), title: 'JS', isDone: true},
      {id: v1(), title: 'ReactJS&CSS', isDone: false},
      {id: v1(), title: 'React API', isDone: false},
      {id: v1(), title: 'GraphQL', isDone: false}],
    [todolistId2]: [
      {id: v1(), title: 'Book', isDone: true},
      {id: v1(), title: 'Milk', isDone: true},
    ]
  })

  function addTodolist(title: string) {
    let todolist: TodolistType = {
      id: v1(),
      filter: 'all',
      title: title
    }
    setTodolists([todolist, ...todolists])
    setTasks({
      ...tasksObj,
      [todolist.id]: [] //id of Todolist, and we have empty array - [] - because there are no tasks yet, since we just created Todolist.
    }) //now because Todolist is not the only thing - inside it has Tasks, so we have to set those tasks.
  }



  return (
    <div className="App">
      <AddItemForm addItem={addTodolist} />
      {
				todolists.map( (tl) => {
					let tasksForTodolist = tasksObj[tl.id]
					if (tl.filter === 'active') {
						tasksForTodolist = tasksForTodolist.filter(task => !task.isDone)
					}
				
					if (tl.filter === 'completed') {
						tasksForTodolist = tasksForTodolist.filter(task => task.isDone)
					}
					return <Todolist
					key={tl.id}
					id={tl.id}
					title={tl.title}
					tasks={tasksForTodolist}
					removeTask={removeTask}
					changeFilter={changeFilter}
					addTask={addTask}
					changeTaskStatus={changeStatus}
          changeTaskTitle={changeTaskTitle}
					filter={tl.filter}
					removeTodolist={removeTodolist}
				/>
				})
			}
    </div>
  );

}

export default App;
