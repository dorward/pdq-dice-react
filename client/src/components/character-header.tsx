import { FormGroup, Button, H2, HTMLSelect, InputGroup, Icon, IconSize } from '@blueprintjs/core';
import { selectBennies } from '../data/user-slice';
import {
	selectEditingCharacter,
	updateCurrentBennies,
	updateMaximumBennies,
	updateName,
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
			<>
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
							value={characterToEdit.name}
							onChange={e => dispatch(updateName(e.target.value))}
						/>
					</FormGroup>
				</div>

				<div className="bennies-edit">
					<FormGroup inline label="Current Bennies" labelFor="current-bennies-edit">
						<HTMLSelect
							id="current-bennies-edit"
							value={characterToEdit.bennies.current}
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
							value={characterToEdit.bennies.max}
							onChange={e => dispatch(updateMaximumBennies(e.target.value))}
						/>
					</FormGroup>
				</div>
			</>
		);
	}

	return (
		<div className="character-header">
			<img src={avatarUrl} alt="" />
			<H2>{name}</H2>
			<p>
				Bennies: {bennies.current}/{bennies.max}
			</p>
		</div>
	);
};

export default CharacterHeader;
