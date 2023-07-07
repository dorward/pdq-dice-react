import { User } from '../types';

const filterCharacterIdentityFromUser = (user: User, characterId: string) => {
    const character = user.characters.find((c) => c.id === characterId);
    const identity = {
        name: character?.codeName || character?.name || user.nickname || user.userTag,
        avatar: character?.avatar ?? user.avatar,
    };
    return identity;
};

export default filterCharacterIdentityFromUser;
