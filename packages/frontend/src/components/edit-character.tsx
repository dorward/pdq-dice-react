import React, { useState, useEffect } from 'react';
import { Callout, Button } from '@blueprintjs/core';
import axios from 'axios';
import useQuery from '../hooks/use-query';
import { useHistory } from 'react-router-dom';
import { Character, UserData } from '../types';
import Dropzone from 'react-dropzone';

type Props = {
	firstCharacter?: boolean;
	character?: Character;
	userData: UserData;
};

const EditCharacter = ({ userData, character, firstCharacter }: Props) => {
	const onDrop = (acceptedFiles: File[]) => {
		if (acceptedFiles.length === 1) {
			const reader = new FileReader();
			reader.onload = () => {
				const { result } = reader;
				userData.addCharacter.fromYAML(result as string);
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
								<p>
									If you have a YML containing your character data then you can drag and drop it onto this box or{' '}
									<Button intent="primary">Open File</Button>.
								</p>
							</div>
						</Callout>
					)}
				</Dropzone>

				<Callout title="New Character" icon="new-person" intent="none" className="tiny">
					<p>
						Start with a blank character sheet. <Button intent="primary">New Character</Button>
					</p>
				</Callout>
			</>
		);
	}

	return <p>Character in edit mode</p>;
};

export default EditCharacter;
