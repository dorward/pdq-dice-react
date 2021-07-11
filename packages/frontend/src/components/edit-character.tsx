import React from 'react';
import { Callout, Button } from '@blueprintjs/core';
import Dropzone from 'react-dropzone';
import { addCharacterFromYAML } from '../data/user-slice';
import { useDispatch } from 'react-redux';

type Props = {
	firstCharacter?: boolean;
	characterId?: string;
};

const EditCharacter = ({ characterId, firstCharacter }: Props) => {
	const dispatch = useDispatch();

	// TODO generate an ID for it here if we don't already have one
	// Then get the character by ID.
	// When adding it, generate a new tab with its ID and then trigger a switch to that ID with a useEffect
	// Maybe useEffect sets the currently being edited character?
	// Clicking another tab explicitly changes it out of edit mode?
	const character: any = null; // TODO If there is an ID get this from Redux

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
	if (!character) {
		return (
			<>
				{firstCharacter && (
					<>
						<Callout title="Hi!" icon="info-sign" intent="primary" className="tiny">
							<p>
								Welcome to PDQ Dice. It looks like you don't have any characters set up yet. You'll need to create one
								before you can do much with this app.
							</p>
						</Callout>
					</>
				)}

				<Dropzone onDrop={onDrop}>
					{({ getRootProps, getInputProps }) => (
						<Callout title="Upload YAML" icon="cloud-upload" intent="none" className="tiny">
							<div {...getRootProps()}>
								<input {...getInputProps()} />
								<p>If you have a YML containing your character data then you can drag and drop it onto this box or…</p>
								<Button className="center" intent="primary">
									Open File
								</Button>
							</div>
						</Callout>
					)}
				</Dropzone>

				<Callout title="New Character" icon="new-person" intent="none" className="tiny">
					<p>Start with a blank character sheet.</p>
					<Button className="center" intent="primary">
						New Character
					</Button>
				</Callout>
			</>
		);
	}

	return <p>Character in edit mode</p>;
};

export default EditCharacter;
