import { Button, Callout, Checkbox, H3, UL } from '@blueprintjs/core';
import { addCharacterFromYAML, selectCharacters, toggleCharacterVisibility } from '../data/user-slice';
import { createNewCharacter } from '../data/helpers';
import { useDispatch, useSelector } from 'react-redux';
import Dropzone from 'react-dropzone';
import React from 'react';

const NewCharacter = () => {
	const dispatch = useDispatch();
	const characters = useSelector(selectCharacters);

	const onDrop = (acceptedFiles: File[]) => {
		if (acceptedFiles.length === 1) {
			const reader = new FileReader();
			reader.onload = () => {
				const { result } = reader;
				dispatch(addCharacterFromYAML(result as string));
			};
			reader.readAsText(acceptedFiles[0]);
		}
	};
	return (
		<>
			<Dropzone onDrop={onDrop}>
				{({ getRootProps, getInputProps }) => (
					<Callout title="Upload YAML" icon="cloud-upload" intent="none" className="tiny">
						<div {...getRootProps()}>
							<input {...getInputProps()} />
							<p>If you have a YML containing your character data then you can drag and drop it onto this box.</p>
							<Button className="center" intent="primary">
								Open File
							</Button>
						</div>
					</Callout>
				)}
			</Dropzone>

			<Callout title="New Character" icon="new-person" intent="none" className="tiny">
				<p>Start with a blank character sheet.</p>
				<Button className="center" intent="primary" onClick={createNewCharacter}>
					New Character
				</Button>
			</Callout>
			<H3>Active characters</H3>
			<p>Toggle these characters appearing in the tab bar at the top.</p>
			<UL>
				{characters.map(character => (
					<li key={character.id}>
						<Checkbox checked={!character.hidden} onChange={() => dispatch(toggleCharacterVisibility(character.id))}>
							{character.name}
						</Checkbox>
					</li>
				))}
			</UL>
		</>
	);
};

export default NewCharacter;
