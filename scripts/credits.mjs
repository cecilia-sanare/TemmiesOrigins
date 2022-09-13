import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import toml from 'toml';
import * as CF from './services/curseforge.mjs';
import * as MR from './services/modrinth.mjs';
import dedent from 'dedent';

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));
const MODS = path.join(DIRNAME, '../mods');
const CREDITS_FILE = path.join(DIRNAME, '../credits.md');

(async () => {
    const modConfigs = await fs.readdir(MODS).then(async (mods) => {
        return await Promise.all(mods.map(async (mod) => {
            const content = await fs.readFile(path.join(MODS, mod), 'utf-8');
            return toml.parse(content);
        }));
    });

    const {curseforge: curseforgeMods, modrinth: modrinthMods} = modConfigs.reduce((mods, modConfig) => {
        if (modConfig.update && modConfig.update.curseforge) {
            mods.curseforge.push(modConfig.update.curseforge['project-id']);
        } else if (modConfig.update && modConfig.update.modrinth) {
            mods.modrinth.push(modConfig.update.modrinth['mod-id']);
        } else {
            console.warn(`Unknown mod! ${modConfig}`);
        }

        return mods;
    }, {
        curseforge: [],
        modrinth: []
    });

    const [
        cfModInfos,
        mrModInfos
    ] = await Promise.all([
        CF.getMods(curseforgeMods),
        MR.getProjects(modrinthMods)
    ]);
    
    const teams = await MR.getProjectTeams(
        mrModInfos.map((mod) => mod.team)
    );

    const markdown = dedent`
        ### Temmie's Origins ()

        #### Modrinth Mods

        ${mrModInfos.map((modInfo) => {
            const team = teams.find((members) => members[0].team_id === modInfo.team);

            return `[${modInfo.title}](https://modrinth/mods/${modInfo.slug}) (by ${team.map((member) => `[${member.user.name || member.user.username}](https://modrinth.com/user/${member.user.username})`).join(', ')})`
        }).join('\r\n')}

        #### CurseForge Mods

        ${cfModInfos.data.map((modInfo) => 
            `[${modInfo.name}](${modInfo.links.websiteUrl}) (by ${modInfo.authors.map((author) => `[${author.name}](${author.url})`)}).join(', ')})`    
        ).join('\r\n')}
    `;

    await fs.writeFile(CREDITS_FILE, markdown, 'utf-8');
})();