import React from 'react'
import { TodoForm } from './todo-form'
import { TodoList } from './todo-list'
import { TodoFilter } from './todo-filter'
import { useTodos } from '../hooks'
import './app.css'

export const App: React.FC = () => {
	const {
		todos,
		filteredTodos,
		addTodo,
		toggleTodo,
		deleteTodo,
		activeFilter,
		setActiveFilter,
	} = useTodos()

	const activeTodos = todos.filter((todo) => !todo.completed)
	const completedTodos = todos.filter((todo) => todo.completed)

	return (
		<div className='app-container'>
			<h1 className='title'>Список задач</h1>
			<TodoForm addTodo={addTodo} />
			<TodoFilter
				activeFilter={activeFilter}
				setActiveFilter={setActiveFilter}
			/>

			{activeFilter === 'all' && (
				<TodoList
					todos={filteredTodos}
					toggleTodo={toggleTodo}
					deleteTodo={deleteTodo}
					title='Все задачи'
				/>
			)}

			{activeFilter === 'active' && (
				<TodoList
					todos={activeTodos}
					toggleTodo={toggleTodo}
					deleteTodo={deleteTodo}
					title='Активные задачи'
				/>
			)}

			{activeFilter === 'completed' && (
				<TodoList
					todos={completedTodos}
					toggleTodo={toggleTodo}
					deleteTodo={deleteTodo}
					title='Выполненные задачи'
				/>
			)}
		</div>
	)
}
