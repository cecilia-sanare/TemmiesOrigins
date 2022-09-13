import 'dotenv/config';
import path from 'path';
import fs from 'fs/promises';
import toml from 'toml';
import * as CF from './services/curseforge.mjs';
import * as MR from './services/modrinth.mjs';
import dedent from 'dedent';
import { DIRECTORIES } from './constants/directories.mjs';

(async () => {
    try {
        const modConfigs = await fs.readdir(DIRECTORIES.MODS).then(async (mods) => {
            return await Promise.all(mods.map(async (mod) => {
                const content = await fs.readFile(path.join(DIRECTORIES.MODS, mod), 'utf-8');
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
        
        const [teams, MODRINTH_TEMPLATE] = await Promise.all([
            MR.getProjectTeams(
                mrModInfos.map((mod) => mod.team)
            ),
            fs.readFile(path.join(DIRECTORIES.DIRNAME, '../modrinth.md'), 'utf-8')
        ]);

        const modInfos = mrModInfos.map((modInfo) => {
            const team = teams.find((members) => members[0].team_id === modInfo.team);
    
            return {
                name: modInfo.title,
                url: `https://modrinth/mods/${modInfo.slug}`,
                authors: team.map((member) => ({
                    name: member.user.name || member.user.username,
                    url: `https://modrinth.com/user/${member.user.username}`
                }))
            };
        }).concat(cfModInfos.data.map((modInfo) => ({
            name: modInfo.name,
            url: modInfo.links.websiteUrl,
            authors: modInfo.authors.map((author) => ({
                name: author.name,
                url: author.url
            }))
        }))).sort((a, b) => a.name.localeCompare(b.name));

        const markdown = dedent`
            ${modInfos.map((modInfo) => 
                `- [${modInfo.name}](${modInfo.url}) (by ${modInfo.authors.map((author) => `[${author.name}](${author.url})`).join(', ')})${modInfo.url.includes('ironchests') ? ' _**(Author contacted and permission received)**_' : ''}`
            ).join('\r\n')}
        `;
    
        await Promise.all([
            fs.writeFile(DIRECTORIES.CREDITS_FILE, dedent`
                ## Temmie's Origins (${process.env.GITHUB_REF_NAME || 'local'})
    
                ${markdown}
            `, 'utf-8'),
            MR.updateProject('temmies-origins', {
                body: dedent(MODRINTH_TEMPLATE.replace('{{mods}}', markdown))
            })
        ]);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();