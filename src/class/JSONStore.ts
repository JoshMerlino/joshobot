import { statSync, writeFileSync } from "fs";
import { sync as mkdirp } from "mkdirp";
import { resolve } from "path";

export default class JSONStore {

	// Internal value of the JSONStore.
	private __value: Record<string, unknown> = {};

	constructor(private path: string) {

		// Try to parse JSON.
		try {
			this.__value = require(path);

		// If it fails, use a blank object.
		} catch (e) {
			this.__value = {};
		}

	}

	// Static method to create a new store from a file.
	static from(path: string): JSONStore {
		mkdirp(resolve(path, "../"));
		return new this(path);
	}

	// Getter to well get the value when called.
	get value(): Record<string, unknown> {
		return this.__value;
	}

	// Setter to update the value in the store and save to the filesystem
	set value(newValue: Record<string, unknown>) {
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
