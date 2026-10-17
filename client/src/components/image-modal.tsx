import { useEffect, useRef, useState } from 'react';
import { Button, Callout, Card, Slider, Overlay2, Intent } from '@blueprintjs/core';
import AvatarEditor, { type AvatarEditorRef } from 'react-avatar-editor';
import updateAvatar from '../api/update-avatar';
import { useDispatch } from 'react-redux';
import { updateAvatar as updateAvatarAction } from '../data/edit-mode-slice';
import { isAxiosError } from 'axios';

type Props = { url: string; clear: () => void };

const ImageModal = ({ url, clear }: Props) => {
    const dispatch = useDispatch();
    const editor = useRef<AvatarEditorRef>(null);
    const upload = useRef<AbortController | null>(null);
    const [error, setError] = useState('');
    useEffect(() => () => upload.current?.abort(), []);
    const [uploading, setUploading] = useState(false);
    const [scale, setScale] = useState(1.2);

    const cancel = () => {
        upload.current?.abort();
        clear();
    };

    const save = async () => {
        if (!editor.current || uploading) return;
        const controller = new AbortController();
        upload.current = controller;
        setError('');
        setUploading(true);
        try {
            const image = editor.current.getImage().toDataURL();
            const avatarUrl = await updateAvatar({ image, signal: controller.signal });
            if (!controller.signal.aborted) {
                dispatch(updateAvatarAction(avatarUrl));
                clear();
            }
        } catch (error) {
            if (!controller.signal.aborted) {
                setError(
                    isAxiosError(error) && error.response?.status === 400
                        ? 'Please upload a valid image. Choose another image or cancel.'
                        : 'The avatar could not be uploaded. Please try again or cancel.',
                );
            }
        } finally {
            if (!controller.signal.aborted) setUploading(false);
            if (upload.current === controller) upload.current = null;
        }
    };

    return (
        <Overlay2 autoFocus enforceFocus onClose={cancel} isOpen={true}>
            <div className="v-center">
                <Card interactive={true} elevation={1} className="h-center results">
                    <AvatarEditor
                        image={url}
                        ref={editor}
                        width={250}
                        height={250}
                        border={50}
                        scale={scale}
                    />

                    <Slider
                        className="avatar-editor-scale"
                        min={0.1}
                        max={5}
                        labelValues={[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]}
                        value={scale}
                        onChange={setScale}
                        stepSize={0.1}
                    />

                    {error && (
                        <Callout role="alert" intent={Intent.DANGER}>
                            {error}
                        </Callout>
                    )}
                    <Button onClick={save} intent={Intent.PRIMARY} loading={uploading}>
                        Save
                    </Button>
                    <Button onClick={cancel}>Cancel</Button>
                </Card>
            </div>
        </Overlay2>
    );
};

export default ImageModal;
