import { Button, Callout, Checkbox, H3, UL } from '@blueprintjs/core';
import {
    addCharacterFromYAML,
    addCharacterFromJSON,
    selectCharacters,
    toggleCharacterVisibility,
} from '../data/user-slice';
import { createNewCharacter } from '../data/helpers';
import { useDispatch, useSelector } from 'react-redux';
import Dropzone from 'react-dropzone';
import { useState } from 'react';

const NewCharacter = () => {
    const dispatch = useDispatch();
    const characters = useSelector(selectCharacters);
    const [importError, setImportError] = useState('');

    const onDrop = (acceptedFiles: File[]) => {
        setImportError('');
        if (acceptedFiles.length === 1) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    if (typeof reader.result !== 'string')
                        throw new Error('The file could not be read as text.');
                    const action = /\.json$/i.test(file.name)
                        ? addCharacterFromJSON
                        : addCharacterFromYAML;
                    dispatch(action(reader.result));
                } catch (error) {
                    setImportError(
                        error instanceof Error
                            ? error.message
                            : 'The character could not be imported.',
                    );
                }
            };
            reader.onerror = () =>
                setImportError('The file could not be read. Please try again.');
            reader.onabort = () =>
                setImportError('The file import was cancelled. Please try again.');
            try {
                reader.readAsText(file);
            } catch {
                setImportError('The file could not be read. Please try again.');
            }
        } else {
            setImportError('Please select one YAML or JSON character file.');
        }
    };
    return (
        <>
            <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                    <Callout
                        title="Upload YAML or JSON"
                        icon="cloud-upload"
                        intent="none"
                        className="tiny"
                    >
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>
                                If you have a YAML or JSON file containing your character data
                                then you can drag and drop it onto this box.
                            </p>
                            <Button className="center" intent="primary">
                                Open File
                            </Button>
                        </div>
                    </Callout>
                )}
            </Dropzone>
            {importError && (
                <Callout role="alert" title="Import failed" intent="danger">
                    {importError}
                </Callout>
            )}

            <Callout title="New Character" icon="new-person" intent="none" className="tiny">
                <p>Start with a blank character sheet.</p>
                <Button className="center" intent="primary" onClick={createNewCharacter}>
                    New Character
                </Button>
            </Callout>
            <H3>Active characters</H3>
            <p>Toggle these characters appearing in the tab bar at the top.</p>
            <UL>
                {characters.map((character) => (
                    <li key={character.id}>
                        <Checkbox
                            checked={!character.hidden}
                            onChange={() => dispatch(toggleCharacterVisibility(character.id))}
                        >
                            {character.codeName || 'Missing Code Name'}
                        </Checkbox>
                    </li>
                ))}
            </UL>
        </>
    );
};

export default NewCharacter;
