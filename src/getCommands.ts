/* eslint @typescript-eslint/no-var-requires: off */

import { readdir, lstat } from "fs/promises";
import { resolve } from "path";
import Command from "./class/bot/Command";

// Function to get a context of every API in the folder.
export default async function getCommands(dir: string): Promise<typeof Command[]> {

	// Scan directory.
	let items = await readdir(dir);
	items = items.filter(item => !item.includes(".js.map"));

	let files: typeof Command[] = [];
	for (const name of items) {

		const path = `${dir}/${name}`;

		if ((await lstat(`${dir}/${name}`)).isDirectory()) {
			files = [ ...files, ...await getCommands(`${dir}/${name}`) ];
		} else {
			files.push(require(resolve(path)).default);
		}

	}

	return files;

}
