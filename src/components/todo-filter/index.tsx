import React, { memo } from 'react'
import { ITodoFilter } from '../../types'
import './todo-filter.css'

interface IProps {
	/** Текущий активный фильтр ("all", "active", "completed") **/
	activeFilter: ITodoFilter
	/**  Функция для изменения текущего фильтра **/
	setActiveFilter: (filter: ITodoFilter) => void
}

/**
 * Компонент для фильтрации списка задач по их статусу.
 * @param props Свойства компонента.
 * @returns Компонент фильтрации задач.
 */
export const TodoFilter: React.FC<IProps> = memo(
	({ activeFilter, setActiveFilter }) => {
		return (
			<div className='filter-container'>
				<button
					className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
					onClick={() => setActiveFilter('all')}
					data-testid='filter-all'
				>
					Все
				</button>
				<button
					className={`filter-button ${activeFilter === 'active' ? 'active' : ''}`}
					onClick={() => setActiveFilter('active')}
					data-testid='filter-active'
				>
					Активные
				</button>
				<button
					className={`filter-button ${activeFilter === 'completed' ? 'active' : ''}`}
					onClick={() => setActiveFilter('completed')}
					data-testid='filter-completed'
				>
					Выполненные
				</button>
			</div>
		)
	}
)
