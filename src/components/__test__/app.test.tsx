import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../app';
import { useTodos } from '../../hooks';
import '@testing-library/jest-dom';

// Мокируем хук useTodos
jest.mock('../../hooks', () => ({
    useTodos: jest.fn(),
}));

describe('App Component', () => {
    // Создаем базовый набор замоканных данных и функций
    const mockAddTodo = jest.fn();
    const mockToggleTodo = jest.fn();
    const mockDeleteTodo = jest.fn();
    const mockSetActiveFilter = jest.fn();

    const mockTodos = [
        { id: '1', text: 'Задача 1', completed: false },
        { id: '2', text: 'Задача 2', completed: true },
        { id: '3', text: 'Задача 3', completed: false },
    ];

    const mockActiveTodos = mockTodos.filter(todo => !todo.completed);
    const mockCompletedTodos = mockTodos.filter(todo => todo.completed);

    beforeEach(() => {
        jest.clearAllMocks();
        // Настраиваем мок хука useTodos для каждого теста
        (useTodos as jest.Mock).mockReturnValue({
            todos: mockTodos,
            filteredTodos: mockTodos,
            addTodo: mockAddTodo,
            toggleTodo: mockToggleTodo,
            deleteTodo: mockDeleteTodo,
            activeFilter: 'all',
            setActiveFilter: mockSetActiveFilter,
        });
    });

    test('Отображает приложение с заголовком, формой, фильтром и списком дел', () => {
        render(<App />);

        // Проверяем заголовок
        expect(screen.getByText('Список задач')).toBeInTheDocument();

        // Проверяем наличие формы для добавления задач
        expect(screen.getByPlaceholderText('Что нужно сделать?')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Добавить' })).toBeInTheDocument();

        // Проверяем наличие кнопок фильтра
        expect(screen.getByTestId('filter-all')).toBeInTheDocument();
        expect(screen.getByTestId('filter-active')).toBeInTheDocument();
        expect(screen.getByTestId('filter-completed')).toBeInTheDocument();

        // Проверяем, что отображается список всех задач при фильтре 'all'
        expect(screen.getByText('Все задачи')).toBeInTheDocument();
        expect(screen.getByText('Задача 1')).toBeInTheDocument();
        expect(screen.getByText('Задача 2')).toBeInTheDocument();
        expect(screen.getByText('Задача 3')).toBeInTheDocument();
    });

    test('Отображает активные задачи при выборе активного фильтра', () => {
        // Настраиваем мок на активный фильтр
        (useTodos as jest.Mock).mockReturnValue({
            todos: mockTodos,
            filteredTodos: mockActiveTodos,
            addTodo: mockAddTodo,
            toggleTodo: mockToggleTodo,
            deleteTodo: mockDeleteTodo,
            activeFilter: 'active',
            setActiveFilter: mockSetActiveFilter,
        });

        render(<App />);

        // Проверяем заголовок списка
        expect(screen.getByText('Активные задачи')).toBeInTheDocument();

        // Проверяем, что отображаются только активные задачи
        expect(screen.getByText('Задача 1')).toBeInTheDocument();
        expect(screen.getByText('Задача 3')).toBeInTheDocument();
        expect(screen.queryByText('Задача 2')).not.toBeInTheDocument();
    });

    test('Отображает выполненные задачи при выборе фильтра «Выполнено»', () => {
        // Настраиваем мок на фильтр завершенных задач
        (useTodos as jest.Mock).mockReturnValue({
            todos: mockTodos,
            filteredTodos: mockCompletedTodos,
            addTodo: mockAddTodo,
            toggleTodo: mockToggleTodo,
            deleteTodo: mockDeleteTodo,
            activeFilter: 'completed',
            setActiveFilter: mockSetActiveFilter,
        });

        render(<App />);

        // Проверяем заголовок списка
        expect(screen.getByText('Выполненные задачи')).toBeInTheDocument();

        // Проверяем, что отображаются только завершенные задачи
        expect(screen.getByText('Задача 2')).toBeInTheDocument();
        expect(screen.queryByText('Задача 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Задача 3')).not.toBeInTheDocument();
    });

    test('Действия todo корректно передаются дочерним компонентам.', () => {
        render(<App />);

        // Проверяем, что функция addTodo передается в TodoForm
        const input = screen.getByPlaceholderText('Что нужно сделать?');
        const addButton = screen.getByRole('button', { name: 'Добавить' });

        fireEvent.change(input, { target: { value: 'Новая задача' } });
        fireEvent.click(addButton);

        expect(mockAddTodo).toHaveBeenCalledWith('Новая задача');

        // Проверяем, что функция toggleTodo передается в TodoList
        const checkbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(checkbox);

        expect(mockToggleTodo).toHaveBeenCalledWith('1');

        // Проверяем, что функция deleteTodo передается в TodoList
        const deleteButton = screen.getAllByTestId('delete-button-1')[0];
        fireEvent.click(deleteButton);

        expect(mockDeleteTodo).toHaveBeenCalledWith('1');

        // Проверяем, что функция setActiveFilter передается в TodoFilter
        const filterButton = screen.getByTestId('filter-completed');
        fireEvent.click(filterButton);

        expect(mockSetActiveFilter).toHaveBeenCalledWith('completed');
    });
});
