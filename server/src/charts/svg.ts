import { create } from 'xmlbuilder2';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const font = readFileSync(join(__dirname, '../../fonts/Aileron-UltraLight.otf')).toString(
    'base64',
);

export const createSvg = (width: number, height: number) => {
    const svg = create().ele('svg', { width, height, xmlns: 'http://www.w3.org/2000/svg' });
    svg.ele('style').txt(`
        @font-face {
            font-family: 'MyFont';
            src: url('data:font/otf;base64,${font}') format('opentype');
        }
        text { font-family: 'MyFont'; }
    `);
    svg.ele('rect', { width: '100%', height: '100%', fill: 'black' });
    return svg;
};
