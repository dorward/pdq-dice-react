// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { OverlaysProvider } from '@blueprintjs/core';
import ImageModal from './image-modal';
import { updateAvatar } from '../data/edit-mode-slice';

const mocks = vi.hoisted(() => ({ upload: vi.fn(), dispatch: vi.fn(), toDataURL: vi.fn() }));
vi.mock('../api/update-avatar', () => ({ default: mocks.upload }));
vi.mock('react-redux', () => ({ useDispatch: () => mocks.dispatch }));
vi.mock('react-avatar-editor', async () => {
    const { forwardRef, useImperativeHandle } = await import('react');
    return {
        default: forwardRef<import('react-avatar-editor').AvatarEditorRef>((_props, ref) => {
            useImperativeHandle(ref, () => ({
                getImage: () =>
                    ({ toDataURL: mocks.toDataURL }) as unknown as HTMLCanvasElement,
                getImageScaledToCanvas: () => document.createElement('canvas'),
                getCroppingRect: () => ({ x: 0, y: 0, width: 1, height: 1 }),
            }));
            return <div>Avatar editor</div>;
        }),
    };
});
const open = (clear = vi.fn()) => {
    render(
        <OverlaysProvider>
            <ImageModal url="test.png" clear={clear} />
        </OverlaysProvider>,
    );
    return clear;
};
beforeEach(() => {
    vi.resetAllMocks();
    mocks.toDataURL.mockReturnValue('data:image/png;base64,test');
});
afterEach(cleanup);

test('failed uploads keep the editor open, show an error, and permit a successful retry', async () => {
    mocks.upload
        .mockRejectedValueOnce(new Error('Network failure'))
        .mockResolvedValueOnce('/avatars/new.png');
    const clear = open();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect((await screen.findByRole('alert')).textContent).toContain('could not be uploaded');
    expect(screen.getByText('Avatar editor')).toBeTruthy();
    expect(clear).not.toHaveBeenCalled();
    expect(mocks.dispatch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(clear).toHaveBeenCalledTimes(1));
    expect(mocks.dispatch).toHaveBeenCalledWith(updateAvatar('/avatars/new.png'));
    expect(mocks.upload).toHaveBeenCalledTimes(2);
});

test('invalid images display a validation error and allow choosing another image', async () => {
    mocks.upload.mockRejectedValueOnce({ isAxiosError: true, response: { status: 400 } });
    const clear = open();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect((await screen.findByRole('alert')).textContent).toContain(
        'Please upload a valid image',
    );
    expect(screen.getByText('Avatar editor')).toBeTruthy();
    expect(mocks.dispatch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(clear).toHaveBeenCalledTimes(1);
});

test('users can cancel while an upload is pending and a late result does not update the avatar', async () => {
    let finish!: (url: string) => void;
    mocks.upload.mockImplementationOnce(
        () =>
            new Promise<string>((resolve) => {
                finish = resolve;
            }),
    );
    const clear = open();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    const signal = mocks.upload.mock.calls[0][0].signal as AbortSignal;
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(signal.aborted).toBe(true);
    expect(clear).toHaveBeenCalledTimes(1);
    finish('/avatars/late.png');
    await waitFor(() => expect(mocks.dispatch).not.toHaveBeenCalled());
    expect(clear).toHaveBeenCalledTimes(1);
});

test('canvas export failures clear loading and leave Cancel available', async () => {
    mocks.toDataURL.mockImplementationOnce(() => {
        throw new Error('Canvas export failed');
    });
    const clear = open();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect((await screen.findByRole('alert')).textContent).toContain('could not be uploaded');
    expect(mocks.upload).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(clear).toHaveBeenCalledTimes(1);
});
