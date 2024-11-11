import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

type Base = {
    AVATAR_URL: string;
    AVATAR_PATH: string;
};

export const avatarPaths: Base = ['AVATAR_URL', 'AVATAR_PATH'].reduce(
    (accumulator, envVarName) => {
        const value = process.env[envVarName];
        if (!value) {
            console.error(`${envVarName} environment variable is not set`);
            process.exit(1);
        }
        return { ...accumulator, [envVarName]: value.replace(/\/$/, '') };
    },
    {} as Partial<Base>,
) as Base;

const splitDataUrl = /^data:[a-zA-Z]+\/([a-zA-Z]+);base64,(.*)$/;

const saveDataUrl = async (image: string) => {
    const matches = image.match(splitDataUrl);
    if (!matches) return;
    const [_all, ext, data] = matches;
    const buffer = Buffer.from(data, 'base64');
    const filename = `${uuidv4()}.${ext}`;
    const path = `${avatarPaths.AVATAR_PATH}/${filename}`;
    const url = `${avatarPaths.AVATAR_URL}/${filename}`;
    await writeFile(path, buffer, { mode: 0o660 });
    return { path, url };
};

export default saveDataUrl;
