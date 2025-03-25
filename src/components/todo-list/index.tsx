import React from 'react'
import { TodoItem } from '../todo-item'
import { ITodo } from '../../types'
import './todo-list.css'

export interface IProps {
	/** Массив задач **/
	todos: ITodo[]
	/** Функция для переключения статуса выполнения задачи **/
	toggleTodo: (id: string) => void
	/** Функция для удаления задачи **/
	deleteTodo: (id: string) => void
	/** Заголовок списка задач **/
	title: string
}

/**
 * Компонент списка задач.
 * @param props Свойства компонента.
 * @returns Элемент списка задач.
 */
export const TodoList: React.FC<IProps> = ({
	todos,
	toggleTodo,
	deleteTodo,
	title,
}) =>
	todos.length === 0 ? (
		<div className='todo-list-container'>
			<h2>{title}</h2>
			<p className='empty-list'>Список пуст</p>
		</div>
	) : (
		<div className='todo-list-container'>
			<h2>{title}</h2>
			<ul className='todo-list' data-testid='todo-list'>
				{todos.map((todo) => (
					<TodoItem
						key={todo.id}
						todo={todo}
						toggleTodo={toggleTodo}
						deleteTodo={deleteTodo}
					/>
				))}
			</ul>
		</div>
	)
