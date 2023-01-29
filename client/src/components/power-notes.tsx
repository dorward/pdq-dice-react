import { H2, H3 } from '@blueprintjs/core';
import { Attribute } from '../types';
import ReactMarkdown from 'react-markdown';

type Props = {
	powers: Attribute[];
};

const PowerNotes = ({ powers }: Props) => {
	return (
		<div className="power-description">
			<H2>Power Notes</H2>
			{powers
				.filter(power => Boolean(power.notes))
				.map(power => (
					<PowerDescription power={power} />
				))}
		</div>
	);
};

type PropsD = {
	power: Attribute;
};

const PowerDescription = ({ power }: PropsD) => {
	return (
		<div className="power">
			<H3>{power.name}</H3>
			<ReactMarkdown children={power.notes} />
		</div>
	);
};

export default PowerNotes;
