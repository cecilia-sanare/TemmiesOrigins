import path from 'path';
import {fileURLToPath} from 'url';

const DIRNAME = path.join(path.dirname(fileURLToPath(import.meta.url)), '../');

export const DIRECTORIES = {
    DIRNAME,
    MODS: path.join(DIRNAME, '../mods'),
    CREDITS_FILE: path.join(DIRNAME, '../credits.md'),
    OUTPUT_FILE: path.join(DIRNAME, `../TemmiesOriginsClient-${process.env.GITHUB_REF_NAME}.mrpack`)
};