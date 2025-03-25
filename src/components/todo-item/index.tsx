import React, { memo } from 'react'
import { ITodo } from '../../types'
import './todo-item.css'

interface IProps {
	todo: ITodo
	toggleTodo: (id: string) => void
	deleteTodo: (id: string) => void
}

/**
 * Компонент отдельной задачи в списке дел.
 * @param props Свойства компонента.
 * @param props.tod0 Информация о задаче.
 * @param props.toggleTodo Функция для переключения статуса выполнения задачи.
 * @param props.deleteTodo Функция для удаления задачи.
 * @returns Элемент задачи.
 */
export const TodoItem: React.FC<IProps> = memo(
	({ todo, toggleTodo, deleteTodo }) => {
		return (
			<li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
				<input
					type='checkbox'
					checked={todo.completed}
					onChange={() => toggleTodo(todo.id)}
					className='todo-checkbox'
					data-testid={`todo-checkbox-${todo.id}`}
				/>
				<span className='todo-text'>{todo.text}</span>
				<button
					onClick={() => deleteTodo(todo.id)}
					className='delete-button'
					data-testid={`delete-button-${todo.id}`}
				>
					Удалить
				</button>
			</li>
		)
	}
)
