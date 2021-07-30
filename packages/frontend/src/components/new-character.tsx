import { Button, Callout } from '@blueprintjs/core';
import { addCharacterFromYAML } from '../data/user-slice';
import { createNewCharacter } from '../data/helpers';
import { useDispatch } from 'react-redux';
import Dropzone from 'react-dropzone';
import React from 'react';

const NewCharacter = () => {
	const dispatch = useDispatch();
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
		</>
	);
};

export default NewCharacter;
