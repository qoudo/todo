import React, { useState, memo } from 'react'
import './todo-form.css'

interface IProps {
	/** Функция для добавления новой зада **/
	addTodo: (text: string) => void
}

/**
 * Компонент формы для добавления новой задачи.
 * @param props Свойства компонента.
 * @returns Элемент формы.
 */
export const TodoForm: React.FC<IProps> = memo(({ addTodo }) => {
	const [text, setText] = useState('')

	/**
	 * Обработчик изменения текста в поле ввода.
	 * @param event Событие изменения.
	 */
	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		if (text.trim()) {
			addTodo(text)
			setText('')
		}
	}

	return (
		<form onSubmit={handleSubmit} className='todo-form'>
			<input
				type='text'
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder='Что нужно сделать?'
				className='todo-input'
				data-testid='todo-input'
			/>
			<button type='submit' className='todo-button' data-testid='add-button'>
				Добавить
			</button>
		</form>
	)
})
