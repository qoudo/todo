import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from '../';
import { ITodo } from '../../../types';

// Моковые данные для тестов
const mockTodo: ITodo = {
    id: '1',
    text: 'Тестовая задача',
    completed: false
};

const mockCompletedTodo: ITodo = {
    id: '2',
    text: 'Выполненная задача',
    completed: true
};

describe('TodoItem компонент', () => {
    // Моковые функции
    const toggleTodo = jest.fn();
    const deleteTodo = jest.fn();

    beforeEach(() => {
        // Сбрасываем моки перед каждым тестом
        toggleTodo.mockClear();
        deleteTodo.mockClear();
    });

    test('Компонент корректно рендерится с невыполненной задачей', () => {
        render(
            <TodoItem todo={mockTodo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
        );

        // Проверяем, что текст задачи отображается
        expect(screen.getByText('Тестовая задача')).toBeInTheDocument();

        // Проверяем, что чекбокс не отмечен
        const checkbox = screen.getByTestId(`todo-checkbox-${mockTodo.id}`);
        expect(checkbox).not.toBeChecked();

        // Проверяем, что кнопка удаления присутствует
        expect(screen.getByText('Удалить')).toBeInTheDocument();

        // Проверяем наличие класса (невыполненной задачи)
        const listItem = screen.getByRole('listitem');
        expect(listItem).toHaveClass('todo-item');
        expect(listItem).not.toHaveClass('completed');
    });

    test('Компонент корректно рендерится с выполненной задачей', () => {
        render(
            <TodoItem todo={mockCompletedTodo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
        );

        // Проверяем, что текст задачи отображается
        expect(screen.getByText('Выполненная задача')).toBeInTheDocument();

        // Проверяем, что чекбокс отмечен
        const checkbox = screen.getByTestId(`todo-checkbox-${mockCompletedTodo.id}`);
        expect(checkbox).toBeChecked();

        // Проверяем наличие класса completed
        const listItem = screen.getByRole('listitem');
        expect(listItem).toHaveClass('todo-item');
        expect(listItem).toHaveClass('completed');
    });

    test('Вызывает toggleTodo при изменении состояния чекбокса', () => {
        render(
            <TodoItem todo={mockTodo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
        );

        const checkbox = screen.getByTestId(`todo-checkbox-${mockTodo.id}`);
        fireEvent.click(checkbox);

        // Проверяем, что функция была вызвана с правильным ID
        expect(toggleTodo).toHaveBeenCalledTimes(1);
        expect(toggleTodo).toHaveBeenCalledWith(mockTodo.id);
    });

    test('Вызывает deleteTodo при нажатии на кнопку удаления', () => {
        render(
            <TodoItem todo={mockTodo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
        );

        const deleteButton = screen.getByTestId(`delete-button-${mockTodo.id}`);
        fireEvent.click(deleteButton);

        // Проверяем, что функция была вызвана с правильным ID
        expect(deleteTodo).toHaveBeenCalledTimes(1);
        expect(deleteTodo).toHaveBeenCalledWith(mockTodo.id);
    });

    test('Применяются правильные CSS классы', () => {
        const { rerender } = render(
            <TodoItem todo={mockTodo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
        );

        let listItem = screen.getByRole('listitem');
        expect(listItem).toHaveClass('todo-item');
        expect(listItem).not.toHaveClass('completed');

        // Перерендер компонента с выполненной задачей
        rerender(
            <TodoItem todo={mockCompletedTodo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
        );

        listItem = screen.getByRole('listitem');
        expect(listItem).toHaveClass('todo-item');
        expect(listItem).toHaveClass('completed');
    });

    test('Компоненты имеют правильные data-testid атрибуты', () => {
        render(
            <TodoItem todo={mockTodo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
        );

        expect(screen.getByTestId(`todo-checkbox-${mockTodo.id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`delete-button-${mockTodo.id}`)).toBeInTheDocument();
    });
});
