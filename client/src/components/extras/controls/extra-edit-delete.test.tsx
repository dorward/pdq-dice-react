// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { updateInventoryItem } from '../../../data/edit-mode-slice';
import type { ExtraContainer } from '../../../types';
import ExtraEditDelete from './extra-edit-delete';

const dispatch = vi.hoisted(() => vi.fn());
vi.mock('react-redux', () => ({ useDispatch: () => dispatch }));

const extra: ExtraContainer = {
    id: 'folder',
    name: 'Box',
    location: '',
    count: null,
    value: null,
    capacity: 10,
    isExpanded: true,
};

beforeEach(() => dispatch.mockClear());
afterEach(cleanup);

test.each([1, 3])('folders with contents=%s offer Has Contents instead of DEL', (contents) => {
    render(<ExtraEditDelete extra={extra} contents={contents} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(Array.from(select.options, (option) => option.text)).toEqual([
        'Keep',
        'Has Contents',
    ]);
    expect(select.value).toBe('Keep');
    expect(select.title).toBe('Containers with contents cannot be deleted');
    fireEvent.change(select, { target: { value: 'Has Contents' } });
    expect(dispatch).not.toHaveBeenCalled();
});

test('empty folders offer DEL and dispatch deletion when selected', () => {
    render(<ExtraEditDelete extra={extra} contents={0} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(Array.from(select.options, (option) => option.text)).toEqual(['Keep', 'DEL']);
    expect(select.value).toBe('Keep');
    expect(select.title).toBe('Delete this container');
    fireEvent.change(select, { target: { value: 'Keep' } });
    expect(dispatch).not.toHaveBeenCalled();
    fireEvent.change(select, { target: { value: 'DEL' } });
    expect(dispatch).toHaveBeenCalledExactlyOnceWith(
        updateInventoryItem({ id: extra.id, value: 'DEL' }),
    );
});
