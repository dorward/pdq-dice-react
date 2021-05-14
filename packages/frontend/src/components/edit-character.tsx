import React, { useState, useEffect } from 'react';
import { Callout } from '@blueprintjs/core';
import axios from 'axios';
import useQuery from '../hooks/use-query';
import { useHistory } from 'react-router-dom';
import { Character } from '../types';

type Props = {
	firstCharacter?: boolean;
	character?: Character;
};

const EditCharacter = ({ character, firstCharacter }: Props) => {
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
				<Callout title="Upload YAML" icon="cloud-upload" intent="none" className="tiny">
					<p>You can upload an existing character file here.</p>
				</Callout>
				<Callout title="New Character" icon="new-person" intent="none" className="tiny">
					<p>Start with a blank character sheet.</p>
				</Callout>
			</>
		);
	}

	return <p>Character in edit mode</p>;
};

export default EditCharacter;
