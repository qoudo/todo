export interface ITodo {
	/** Идентификатор задачи **/
	id: string
	/** Текст задачи **/
	text: string
	/** Признак выполнения задачи **/
	completed: boolean
}

/** Идентификаторы фильтров задач **/
export type ITodoFilter = 'all' | 'active' | 'completed'
