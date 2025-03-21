import { H1 } from '@blueprintjs/core';
import { selectUser } from '../../data/user-slice';
import { useSelector } from 'react-redux';
import { User } from '../../types';
import type { Props } from './character-info-types';

const CharacterInfoView = ({ avatar, player, name, origin, codeName, motivation }: Props) => {
    const { avatar: userAvatar } = useSelector(selectUser) as User;
    const avatarUrl = avatar ?? userAvatar;

    return (
        <div className="character-info">
            <H1 className="character-heading">
                <img src={avatarUrl} alt="" className="avatar" />
                <span>{codeName || name}</span>
            </H1>
            <div className="header-groups">
                <div className="header-group" id="group-player-name">
                    <span className="label player-name-label">Player Name</span>
                    <span className="field player-name-value" id="field-player-name">
                        {player}
                    </span>
                </div>

                <div className="header-group" id="group-character-name">
                    <span className="label character-name-label">Character Name</span>
                    <span className="field character-name-value" id="field-character-name">
                        {name}
                    </span>
                </div>

                <div className="header-group" id="group-code-name">
                    <span className="label code-name-label">Code Name</span>
                    <span className="field code-name-value" id="field-code-name">
                        {codeName}
                    </span>
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
            </div>
        </div>
    );
};

export default CharacterInfoView;
