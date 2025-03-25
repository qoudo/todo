import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoForm } from '../';

describe('TodoForm', () => {
    test('Должен добавлять новую задачу при отправке формы', () => {
        const addTodo = jest.fn();
        render(<TodoForm addTodo={addTodo} />);

        const input = screen.getByTestId('todo-input');
        const button = screen.getByTestId('add-button');

        fireEvent.change(input, { target: { value: 'Новая задача' } });
        fireEvent.click(button);

        expect(addTodo).toHaveBeenCalledWith('Новая задача');
    });

    test('Не должен добавлять пустую задачу', () => {
        const addTodo = jest.fn();
        render(<TodoForm addTodo={addTodo} />);

        const button = screen.getByTestId('add-button');
        fireEvent.click(button);

        expect(addTodo).not.toHaveBeenCalled();
    });

    test('Очищает поле ввода после добавления задачи', () => {
        const addTodo = jest.fn();
        render(<TodoForm addTodo={addTodo} />);

        const input = screen.getByTestId('todo-input');
        const button = screen.getByTestId('add-button');

        fireEvent.change(input, { target: { value: 'Новая задача' } });
        fireEvent.click(button);

        expect(addTodo).toHaveBeenCalledWith("Новая задача");
    });
});
