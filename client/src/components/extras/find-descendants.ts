import type { ExtraContainer } from '../../types';

const findDescendants = (
    extra: ExtraContainer,
    containers: ExtraContainer[],
): ExtraContainer[] => {
    const children = containers.filter((possible) => possible.location === extra.id);
    const deeper = children.flatMap((child) => findDescendants(child, containers));
    return children.concat(deeper);
};

export default findDescendants;
