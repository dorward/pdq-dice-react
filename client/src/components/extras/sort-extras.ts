import { Extra, ExtraSortOrder } from '../../types';

const sortExtras = (extras: Extra[], sortOrder: ExtraSortOrder = 'name') => {
	if (sortOrder === 'name') return [...extras].sort((a, b) => a.name.localeCompare(b.name));
	return [...extras].sort((a, b) => a.location.localeCompare(b.location) || a.name.localeCompare(b.name));
};

export default sortExtras;
