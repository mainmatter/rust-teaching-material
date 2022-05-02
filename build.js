import {execa} from 'execa';
import {unlink, rename, readFile, writeFile} from 'node:fs/promises';
import {globby} from "globby";

async function run() {
    let args = ['markdown/workshop/', '--static', '--theme', 'themes/simplabs.css'];
    await execa('reveal-md', args, {stdio: "inherit", preferLocal: true});

    await unlink('_static/index.html');
    await rename('_static/README.html', '_static/index.html');

    let paths = await globby(['_static/*.html']);
    for (let path of paths) {
        let content = await readFile(path, 'utf8');

        content = content.replaceAll('href="/_assets', 'href="./_assets')
        content = content.replaceAll('.md', '.html')
        content = content.replaceAll('README.html', 'index.html')

        await writeFile(path, content, 'utf8');
    }
}

run().catch(error => {
    console.error(error)
})