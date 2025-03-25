import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoFilter } from '../';
import { ITodoFilter } from '../../../types';

describe('TodoFilter', () => {
    const setActiveFilterMock = jest.fn();

    beforeEach(() => {
        setActiveFilterMock.mockClear();
    });

    test('Отображает все три кнопки фильтрации', () => {
        render(
            <TodoFilter activeFilter="all" setActiveFilter={setActiveFilterMock} />
        );

        expect(screen.getByText('Все')).toBeInTheDocument();
        expect(screen.getByText('Активные')).toBeInTheDocument();
        expect(screen.getByText('Выполненные')).toBeInTheDocument();
    });

    test.each<{ filter: ITodoFilter, buttonText: string }>([
        { filter: 'all', buttonText: 'Все' },
        { filter: 'active', buttonText: 'Активные' },
        { filter: 'completed', buttonText: 'Выполненные' },
    ])('Кнопка "%s" имеет класс "active", когда она активна', ({ filter, buttonText }) => {
        render(
            <TodoFilter activeFilter={filter} setActiveFilter={setActiveFilterMock} />
        );

        const activeButton = screen.getByText(buttonText);
        expect(activeButton).toHaveClass('active');

        // Проверяем, что другие кнопки не имеют класс active
        const allButtons = screen.getAllByRole('button');
        allButtons.forEach(button => {
            if (button.textContent !== buttonText) {
                expect(button).not.toHaveClass('active');
            }
        });
    });

    test.each<{ filter: ITodoFilter, buttonText: string, testId: string }>([
        { filter: 'all', buttonText: 'Все', testId: 'filter-all' },
        { filter: 'active', buttonText: 'Активные', testId: 'filter-active' },
        { filter: 'completed', buttonText: 'Выполненные', testId: 'filter-completed' },
    ])('При клике на кнопку "%s" вызывается setActiveFilter с правильным фильтром',
        ({ filter, buttonText, testId }) => {
            render(
                <TodoFilter activeFilter="all" setActiveFilter={setActiveFilterMock} />
            );

            const button = screen.getByTestId(testId);
            fireEvent.click(button);

            expect(setActiveFilterMock).toHaveBeenCalledWith(filter);
        });

    test('Применяет правильные CSS классы к кнопкам', () => {
        render(
            <TodoFilter activeFilter="active" setActiveFilter={setActiveFilterMock} />
        );

        const allButton = screen.getByTestId('filter-all');
        const activeButton = screen.getByTestId('filter-active');
        const completedButton = screen.getByTestId('filter-completed');

        expect(allButton).toHaveClass('filter-button');
        expect(allButton).not.toHaveClass('active');

        expect(activeButton).toHaveClass('filter-button');
        expect(activeButton).toHaveClass('active');

        expect(completedButton).toHaveClass('filter-button');
        expect(completedButton).not.toHaveClass('active');
    });
});
