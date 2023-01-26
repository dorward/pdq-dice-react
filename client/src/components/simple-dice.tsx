import { Button, ButtonGroup } from '@blueprintjs/core';
import { d6 } from '../api/roll';

import SkillCheck from './skill-check';

type Props = {
	hasSkillButton?: boolean;
};

const SimpleDice = ({ hasSkillButton }: Props) => {
	return (
		<ButtonGroup>
			{hasSkillButton && <SkillCheck />}

			<Button icon="random" onClick={() => d6({})}>
				d6
			</Button>
			<Button icon="double-chevron-up" onClick={() => d6({ high: true })}>
				Luck (High)
			</Button>
			<Button icon="double-chevron-down" onClick={() => d6({ high: false })}>
				Luck (Low)
			</Button>
		</ButtonGroup>
	);
};

export default SimpleDice;
