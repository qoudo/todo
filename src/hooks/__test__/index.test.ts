import { renderHook, act } from '@testing-library/react';
import { useTodos } from '../';

// Мок для localStorage
const localStorageMock = (() => {
    let store: Record<string, any> = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

describe('useTodos', () => {
    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
    });

    test('Инициализируется с пустым массивом задач по умолчанию', () => {
        const { result } = renderHook(() => useTodos());

        expect(result.current.todos).toEqual([]);
        expect(result.current.filteredTodos).toEqual([]);
        expect(result.current.activeFilter).toBe('all');
    });

    test('Загружает начальное состояние из localStorage', () => {
        const initialTodos = [
            { id: '1', text: 'Тестовая задача', completed: false }
        ];

        localStorageMock.getItem.mockReturnValue(JSON.stringify(initialTodos));

        const { result } = renderHook(() => useTodos());

        expect(result.current.todos).toEqual(initialTodos);
        expect(localStorageMock.getItem).toHaveBeenCalledWith('todos');
    });

    test('Добавляет новую задачу', () => {
        const { result } = renderHook(() => useTodos());

        act(() => {
            result.current.addTodo('Новая задача');
        });

        expect(result.current.todos.length).toBe(1);
        expect(result.current.todos[0].text).toBe('Новая задача');
        expect(result.current.todos[0].completed).toBe(false);
        expect(result.current.todos[0].id).toBeDefined();
    });

    test('Не добавляет пустую задачу', () => {
        const { result } = renderHook(() => useTodos());

        act(() => {
            result.current.addTodo('');
        });

        expect(result.current.todos.length).toBe(0);

        act(() => {
            result.current.addTodo('   ');
        });

        expect(result.current.todos.length).toBe(0);
    });

    test('Переключает статус задачи', () => {
        const initialTodos = [
            { id: '1', text: 'Тестовая задача', completed: false }
        ];

        localStorageMock.getItem.mockReturnValue(JSON.stringify(initialTodos));

        const { result } = renderHook(() => useTodos());

        act(() => {
            result.current.toggleTodo('1');
        });

        expect(result.current.todos[0].completed).toBe(true);

        act(() => {
            result.current.toggleTodo('1');
        });

        expect(result.current.todos[0].completed).toBe(false);
    });

    test('Удаляет задачу', () => {
        const initialTodos = [
            { id: '1', text: 'Задача 1', completed: false },
            { id: '2', text: 'Задача 2', completed: true }
        ];

        localStorageMock.getItem.mockReturnValue(JSON.stringify(initialTodos));

        const { result } = renderHook(() => useTodos());

        act(() => {
            result.current.deleteTodo('1');
        });

        expect(result.current.todos.length).toBe(1);
        expect(result.current.todos[0].id).toBe('2');
    });

    test('Фильтрует задачи по активному фильтру', () => {
        const initialTodos = [
            { id: '1', text: 'Задача 1', completed: false },
            { id: '2', text: 'Задача 2', completed: true }
        ];

        localStorageMock.getItem.mockReturnValue(JSON.stringify(initialTodos));

        const { result } = renderHook(() => useTodos());

        // Изначально фильтр 'all', должны быть все задачи
        expect(result.current.filteredTodos.length).toBe(2);

        // Меняем фильтр на 'active'
        act(() => {
            result.current.setActiveFilter('active');
        });

        expect(result.current.activeFilter).toBe('active');
        expect(result.current.filteredTodos.length).toBe(1);
        expect(result.current.filteredTodos[0].id).toBe('1');

        // Меняем фильтр на 'completed'
        act(() => {
            result.current.setActiveFilter('completed');
        });

        expect(result.current.activeFilter).toBe('completed');
        expect(result.current.filteredTodos.length).toBe(1);
        expect(result.current.filteredTodos[0].id).toBe('2');
    });
});
