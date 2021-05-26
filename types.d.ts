export interface Config extends Record<string, unknown> {
	prefix: string;
	unmuteQueue: Record<string, {
		mutedBy: string;
		unmuteAt: number;
		reason?: string;
	}>;
}
