const cleanCount = (rawCount: string | number) => {
	const numericCount = parseInt(`${rawCount}`, 10);
	if ('∞' === rawCount) return '∞';
	if (isNaN(numericCount)) return '∞';
	return numericCount;
};

export default cleanCount;
