import { FormGroup, Button, H2, HTMLSelect, InputGroup, Icon, IconSize } from '@blueprintjs/core';
import { selectBennies } from '../data/user-slice';
import {
	selectEditingCharacter,
	updateCurrentBennies,
	updateMaximumBennies,
	updateName,
	updateCodeName,
	updateMotivation,
	updateOrigin,
	updatePlayer,
} from '../data/edit-mode-slice';
import { selectUser } from '../data/user-slice';
import { useDispatch, useSelector } from 'react-redux';
import { useFilePicker } from 'use-file-picker';
import UploadError from './upload-error';
import Loading from './loading';
import ImageModal from './image-modal';
import InventorySizeModal from './inventory-size-modal';
import { User } from '../types';

type Props = {
	name: string;
	avatar?: string;
};

const bennyValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const CharacterHeader = ({ name, avatar }: Props) => {
	const dispatch = useDispatch();
	const characterToEdit = useSelector(selectEditingCharacter);
	const { avatar: userAvatar } = useSelector(selectUser) as User;

	const bennies = useSelector(selectBennies) ?? { current: 0, max: 'unknown' };

	const [openFileSelector, { filesContent, loading, errors, clear }] = useFilePicker({
		readAs: 'DataURL',
		accept: 'image/*',
		multiple: true,
		limitFilesConfig: { max: 1 },
		// minFileSize: 0.1, // in megabytes
		maxFileSize: 50,
		imageSizeRestrictions: {
			maxHeight: 1600, // in pixels
			maxWidth: 1600,
			minHeight: 50,
			minWidth: 50,
		},
	});

	if (errors.length) return <UploadError clear={clear} />;

	const uploadedImage = filesContent?.[0]?.content;

	const avatarUrl = characterToEdit?.avatar ?? avatar ?? userAvatar;

	if (characterToEdit) {
		return (
			<div className="character-header-editor">
				{uploadedImage && <ImageModal url={uploadedImage} clear={clear} />}
				{characterToEdit.selectedExtraId && <InventorySizeModal id={characterToEdit.selectedExtraId} />}
				<div className="character-id-editor">
					{loading && <Loading small={true} />}
					{!loading && (
						<Button onClick={openFileSelector}>
							<>
								<div className="icon-container">
									<Icon icon="upload" title="Change avatar" size={IconSize.LARGE} color="black" />
								</div>
								<img src={avatarUrl} alt="" />
							</>
						</Button>
					)}
					<FormGroup label="Character name" labelFor="character-name-edit">
						<InputGroup
							id="character-name-edit"
							value={characterToEdit.name ?? ''}
							onChange={e => dispatch(updateName(e.target.value))}
						/>
					</FormGroup>
				</div>
				<div className="header-edit-field">
					<FormGroup label="Player" labelFor="player-edit">
						<InputGroup
							id="player-edit"
							value={characterToEdit.player ?? ''}
							onChange={e => dispatch(updatePlayer(e.target.value))}
						/>
					</FormGroup>
				</div>
				<div className="header-edit-field">
					<FormGroup label="Code Name" labelFor="code-name-edit">
						<InputGroup
							id="code-name-edit"
							value={characterToEdit.codeName ?? ''}
							onChange={e => dispatch(updateCodeName(e.target.value))}
						/>
					</FormGroup>
				</div>
				<div className="header-edit-field">
					<FormGroup label="Motivation" labelFor="motivation-edit">
						<InputGroup
							id="motivation-edit"
							value={characterToEdit.motivation ?? ''}
							onChange={e => dispatch(updateMotivation(e.target.value))}
						/>
					</FormGroup>
				</div>
				<div className="header-edit-field">
					<FormGroup label="Origin" labelFor="origin-edit">
						<InputGroup
							id="origin-edit"
							value={characterToEdit.origin ?? ''}
							onChange={e => dispatch(updateOrigin(e.target.value))}
						/>
					</FormGroup>
				</div>

				<div className="bennies-edit">
					<FormGroup inline label="Current Bennies" labelFor="current-bennies-edit">
						<HTMLSelect
							id="current-bennies-edit"
							value={characterToEdit.bennies.current ?? '0'}
							options={bennyValues}
							onChange={e => {
								const count = +e.target.value;
								dispatch(updateCurrentBennies(count));
							}}
						/>
					</FormGroup>

					<FormGroup inline label="Maximum Bennies" labelFor="max-bennies-edit">
						<InputGroup
							id="max-bennies-edit"
							value={characterToEdit.bennies.max ?? '3'}
							onChange={e => dispatch(updateMaximumBennies(e.target.value))}
						/>
					</FormGroup>
				</div>
			</div>
		);
	}

	return (
		<div className="character-header">
			<img src={avatarUrl} alt="" />
			<div className="header-group">
				<span className="label">Character Name</span>
				<span className="field" id="field-character-name">
					Pending
				</span>
			</div>
			<div className="header-group">
				<span className="label">Player Name</span>
				<span className="field" id="field-player-name">
					Pending
				</span>
			</div>
			<div className="header-group" id="group-code-name">
				<span className="label">Code Name</span>
				<H2 className="field" id="field-code-name">
					{name}
				</H2>
			</div>
			<div className="header-group">
				<span className="label">Motivation</span>
				<span className="field" id="field-motivation">
					Pending
				</span>
			</div>
			<div className="header-group">
				<span className="label">Origin</span>
				<span className="field" id="field-origin">
					Pending
				</span>
			</div>
			<div className="header-group" id="group-bennies">
				<span className="label">Bennies</span>
				<span className="field" id="field-bennies">
					{bennies.current}/{bennies.max}
				</span>
			</div>
		</div>
	);
};

export default CharacterHeader;
