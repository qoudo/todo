import React from 'react';
import { render, screen } from '@testing-library/react';
import { TodoList, IProps } from '../';
import { ITodo } from '../../../types';
import { TodoItem } from '../../todo-item';

// Мокаем компонент TodoItem, чтобы изолировать тестирование TodoList
jest.mock('../../todo-item', () => ({
    TodoItem: jest.fn(() => <div data-testid="mocked-todo-item" />)
}));

describe('TodoList Component', () => {
    const mockToggleTodo = jest.fn();
    const mockDeleteTodo = jest.fn();

    // Пример тестовых задач
    const mockTodos: ITodo[] = [
        { id: '1', text: 'Задача 1', completed: false },
        { id: '2', text: 'Задача 2', completed: true },
    ];

    // Базовые пропсы для тестирования
    const defaultProps: IProps = {
        todos: mockTodos,
        toggleTodo: mockToggleTodo,
        deleteTodo: mockDeleteTodo,
        title: 'Список задач'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Отображает заголовок списка', () => {
        render(<TodoList {...defaultProps} />);
        expect(screen.getByText('Список задач')).toBeInTheDocument();
    });

    it('Отображает сообщение "Список пуст" если нет задач', () => {
        render(
            <TodoList
                {...defaultProps}
                todos={[]}
            />
        );

        expect(screen.getByText('Список пуст')).toBeInTheDocument();
        expect(screen.queryByTestId('todo-list')).not.toBeInTheDocument();
    });

    it('Отображает список задач, если массив задач не пуст', () => {
        render(<TodoList {...defaultProps} />);

        expect(screen.queryByText('Список пуст')).not.toBeInTheDocument();
        expect(screen.getByTestId('todo-list')).toBeInTheDocument();
    });

    it('Правильно передает props в компоненты TodoItem', () => {
        render(<TodoList {...defaultProps} />);

        // Проверяем, что все задачи в mockTodos имеют соответствующий вызов TodoItem
        mockTodos.forEach((todo, index) => {
            const callProps = (TodoItem as jest.Mock).mock.calls[index][0];
            expect(callProps.todo).toBe(todo);
            expect(callProps.toggleTodo).toBe(mockToggleTodo);
            expect(callProps.deleteTodo).toBe(mockDeleteTodo);
        });
    });
});
