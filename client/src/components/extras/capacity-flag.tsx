import { Tag, Intent } from '@blueprintjs/core';
import type { Extra } from '../../types';

type Props = {
	contents: number;
	extra: Extra;
};

const CapacityFlag = ({ contents, extra }: Props) => {
	if (!('capacity' in extra)) {
		return null;
	}
	const { capacity } = extra;
	if (['∞', 0].includes(capacity)) {
		return null;
	}
	const full = typeof capacity === 'number' && capacity < contents;
	const title = `Contains ${contents} out of a maximum of ${capacity}`;
	return (
		<Tag round className="capacity-flag" intent={full ? Intent.DANGER : Intent.SUCCESS} title={title}>
			{contents}
		</Tag>
	);
};

export default CapacityFlag;
