import { attributeValues } from '../../consts';
import { applyWound, healWound } from '../../data/user-slice';
import { useDispatch } from 'react-redux';
import { Button, Icon, Intent } from '@blueprintjs/core';

type Props = {
	firstUnwounded: number;
	firstBought: number;
	characterId: string;
	attributeId: string;
	isWoundable: boolean;
};

const SimpleHealth = ({ isWoundable, firstUnwounded, firstBought, characterId, attributeId }: Props) => {
	const dispatch = useDispatch();

	const bonus = new Intl.NumberFormat('en-GB', {
		signDisplay: 'exceptZero',
	}).format(attributeValues[firstUnwounded][1]);

	const wounded = firstUnwounded !== firstBought;

	return (
		<td className="health-column">
			{isWoundable && wounded && (
				<Button
					onClick={() => {
						dispatch(
							healWound({
								characterId: characterId,
								attributeId: attributeId,
							})
						);
					}}>
					<Icon icon="symbol-cross" intent={Intent.SUCCESS} title="Heal" htmlTitle="Heal" />
				</Button>
			)}
			<span className="bonus"> ({bonus}) </span>
			{isWoundable && (
				<Button
					onClick={() => {
						dispatch(
							applyWound({
								characterId: characterId,
								attributeId: attributeId,
							})
						);
					}}>
					<Icon icon="heart-broken" intent={Intent.DANGER} title="Wound" htmlTitle="Wound" />
				</Button>
			)}
		</td>
	);
};

export default SimpleHealth;
