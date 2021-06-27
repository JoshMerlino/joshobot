declare type APIResponse = Record<string, unknown>;

declare interface Endpoint {
	route: string | string[];
	default(req: Request, res: Response): unknown;
}

declare interface Middleware {
	default(req: Request, res: Response, next: NextFunction): void | Promise<void>;
}

declare interface Runtime {
	default(app: Express): void | Promise<void>;
}

declare interface GuildConfig extends Record<string, unknown> {
    prefix: string & { length: 1 };
}

declare interface CommandArgument {
	required: boolean;
	argument: string;
}

declare interface Command {
	alias: string | string[];
	description?: string;
	category: string;
	permission?: PermissionString;
	args?: CommandArgument[];
	handler(message: Message, context: Context<Command>): unknown | Promise<unknown>;
}

declare interface RunnableCommand extends Command {
    alias: string;
	config: Store<GuildConfig>;
}

declare module "nested-keys";
