import { H2 } from '@blueprintjs/core';
import { selectBennies } from '../../data/user-slice';
import { selectUser } from '../../data/user-slice';
import { useSelector } from 'react-redux';
import { User } from '../../types';
import type { Props } from './character-header-types';

const CharacterHeaderView = ({ avatar, player, name, origin, codeName, motivation }: Props) => {
    const { avatar: userAvatar } = useSelector(selectUser) as User;
    const bennies = useSelector(selectBennies) ?? { current: 0, max: 'unknown' };
    const avatarUrl = avatar ?? userAvatar;

    return (
        <div className="character-header">
            <img src={avatarUrl} alt="" className="avatar" />
            <div
                className={`header-group ${codeName ? 'hasCodeName' : 'noCodeName'}`}
                id="group-character-name"
            >
                <span className="label character-name-label">Character Name</span>
                <H2 className="field character-name-value" id="field-character-name">
                    {name}
                </H2>
            </div>
            <div className="header-group" id="group-player-name">
                <span className="label player-name-label">Player Name</span>
                <span className="field player-name-value" id="field-player-name">
                    {player}
                </span>
            </div>
            <div className="header-group" id="group-code-name">
                <span className="label code-name-label">Code Name</span>
                <H2 className="field code-name-value" id="field-code-name">
                    {codeName}
                </H2>
            </div>
            <div className="header-group" id="group-motivation">
                <span className="label motivation-label">Motivation</span>
                <span className="field motivation-value" id="field-motivation">
                    {motivation}
                </span>
            </div>
            <div className="header-group" id="group-origin">
                <span className="label origin-label">Origin</span>
                <span className="field origin-value" id="field-origin">
                    {origin}
                </span>
            </div>
            <div className="header-group" id="group-bennies">
                <span className="label bennies-label">Bennies</span>
                <span className="field bennies-value" id="field-bennies">
                    <span className="bennies-current">
                        <span className="description">Current: </span> {bennies.current}
                    </span>
                    <span className="sep"> / </span>
                    <span className="bennies-max">
                        <span className="description">Max: </span> {bennies.max}
                    </span>
                </span>
            </div>
        </div>
    );
};

export default CharacterHeaderView;
