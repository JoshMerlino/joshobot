export interface ICommandUsageTerm {
	required: boolean;
	argument: string;
	expects?: string;
}

export default class CommandUsage {

	terms: ICommandUsageTerm[] = [];

	push(term: ICommandUsageTerm): void {
		this.terms.push(term);
	}

	render(root: string): { key: string; root: string; usage: string; } {

		const key = this.terms
			.filter(term => term.hasOwnProperty("expects"))
			.map(term => ` • ${term.required ? "*":""}\`${term.argument.toUpperCase()}\` __${term.expects}__`)
			.join("\n");

		const usage = this.terms.map(term => {
			return `${term.required ? "<":"["}${term.argument.toUpperCase()}${term.required ? ">":"]"}`;
		}).join(" ");

		return { key, root, usage };
	}

}
