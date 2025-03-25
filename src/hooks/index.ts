import { useState, useEffect } from 'react'
import { ITodo, ITodoFilter } from '../types'

const LOCAL_STORAGE_KEY = 'todos'

/**
 * Кастомный хук для управления списком задач.
 * Обеспечивает все необходимые функции для работы с задачами:
 * добавление, удаление, редактирование, отметку выполнения и фильтрацию.
 * @returns Объект с методами и свойствами для управления задачами.
 */
export const useTodos = () => {
	// Состояние для хранения списка задач
	const [todos, setTodos] = useState<ITodo[]>(() => {
		const savedTodos = localStorage.getItem(LOCAL_STORAGE_KEY)
		return savedTodos ? JSON.parse(savedTodos) : []
	})

	// Состояние для текущего фильтра
	const [activeFilter, setActiveFilter] = useState<ITodoFilter>('all')

	// Сохранение в localStorage при изменении списка задач
	useEffect(() => {
		localStorage.setItem('todos', JSON.stringify(todos))
	}, [todos])

	/**
	 * Обработчик добавление новой задачи.
	 * @param text Текст задачи.
	 */
	const addTodo = (text: string) => {
		if (text.trim() !== '') {
			setTodos([
				...todos,
				{
					id: Date.now().toString(),
					text: text.trim(),
					completed: false,
				},
			])
		}
	}

	/**
	 * Переключение статуса выполнения задачи.
	 * @param id Идентификатор задачи.
	 */
	const toggleTodo = (id: string) => {
		setTodos(
			todos.map((todo) =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo
			)
		)
	}

	/**
	 * Обработчик удаление задачи.
	 * @param id Идентификатор задачи.
	 */
	const deleteTodo = (id: string) => {
		setTodos(todos.filter((todo) => todo.id !== id))
	}

	const filteredTodos = todos.filter((todo) => {
		if (activeFilter === 'all') return true
		if (activeFilter === 'active') return !todo.completed
		return todo.completed
	});

	return {
		todos,
		filteredTodos,
		addTodo,
		toggleTodo,
		deleteTodo,
		activeFilter,
		setActiveFilter,
	}
}
