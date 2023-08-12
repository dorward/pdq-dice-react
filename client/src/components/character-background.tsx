import { H2 } from '@blueprintjs/core';
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import { selectEditingCharacter, updateBackground } from '../data/edit-mode-slice';
import { TextArea } from '@blueprintjs/core';

type Props = {
	background?: string;
};

const CharacterBackground = ({ background }: Props) => {
	const characterToEdit = useSelector(selectEditingCharacter);
	if (characterToEdit) {
		return <Editor />;
	}
	if (!background) {
		return null;
	}
	return (
		<div className="character-background">
			<H2>Background</H2>
			<ReactMarkdown children={background} />
		</div>
	);
};

const Editor = () => {
	const characterToEdit = useSelector(selectEditingCharacter);
	const dispatch = useDispatch();
	return (
		<div className="character-background edit">
			<H2>Background</H2>
			<div className="background-editor-content">
				<div className="help">
					<ul>
						<li>
							Prefix a line with <code>###</code> for a heading
						</li>
						<li>Use two new lines to start a new paragraph</li>
						<li>
							Wrap a word with <code>**</code> to make it <b>bold</b>
						</li>
						<li>
							Wrap a word with <code>*</code> to make it <i>italic</i>
						</li>
					</ul>
				</div>
				<div className="text">
					<TextArea
						onChange={e => dispatch(updateBackground(e.target.value))}
						value={characterToEdit.background || ''}
					/>
				</div>
			</div>
		</div>
	);
};

export default CharacterBackground;
