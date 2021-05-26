import { statSync, writeFileSync } from "fs";
import { sync as mkdirp } from "mkdirp";
import { resolve } from "path";

export default class JSONStore<T extends Record<string, unknown> = Record<string, never>> {

	// Internal value of the JSONStore.
	private __value: T;

	constructor(private path: string, defaults: T = <T>{}) {

		// Try to parse JSON.
		try {
			this.__value = { ...defaults, ...require(path) };

		// If it fails, use a blank object.
		} catch (e) {
			this.__value = <T>{ ...defaults };
		}

	}

	// Static method to create a new store from a file.
	static from<T extends Record<string, unknown>>(path: string, defaults: T): JSONStore<T> {
		mkdirp(resolve(path, "../"));
		return new this(path, defaults);
	}

	// Getter to well get the value when called.
	get value(): T {
		return this.__value;
	}

	// Setter to update the value in the store and save to the filesystem
	set value(newValue: T) {
		console.log(this.path);
		this.__value = { ...this.__value, ...newValue };
		writeFileSync(this.path, JSON.stringify(this.__value), "utf8");
	}

	// Getter to get the age of the store (since last modified)
	get age(): number {

		// Stat file
		try {
			const stat = statSync(this.path);
			return Math.floor(Date.now() - stat.mtimeMs);

		// Return current timestamp
		} catch (e) {
			return Date.now();
		}

	}

}
