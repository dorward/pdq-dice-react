import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

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

const splitDataUrl = /^data:image\/[a-zA-Z0-9.+-]+;base64,([A-Za-z0-9+/]+={0,2})$/;

const saveDataUrl = async (image: unknown) => {
    if (typeof image !== 'string') return;
    const matches = image.match(splitDataUrl);
    if (!matches) return;
    const [, data] = matches;
    let buffer: Buffer;
    try {
        // Decode the contents and write a fresh raster image, never the supplied file.
        buffer = await sharp(Buffer.from(data, 'base64'), { failOn: 'warning' })
            .png()
            .toBuffer();
    } catch {
        return;
    }
    const filename = `${uuidv4()}.png`;
    const path = `${avatarPaths.AVATAR_PATH}/${filename}`;
    const url = `${avatarPaths.AVATAR_URL}/${filename}`;
    await writeFile(path, buffer, { mode: 0o660 });
    return { path, url };
};

export default saveDataUrl;
