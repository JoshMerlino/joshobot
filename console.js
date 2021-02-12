console.info = function(){
	console.log(chalk.blue("[INFO]"), stackTrace(arguments))
};

console.error = function(...arguments){
	arguments.join(" ").match(/\(node:([0-9])*\)|Warning\:/g) ? console.warn([...arguments].join(" ")) : console.log(chalk.red("[ERROR]"), stackTrace([...arguments].join(" ")));
};

console.warn = function(){
	console.log(chalk.yellow("[WARN]"), stackTrace([...arguments].join(" ")));
};

let stackTrace = function(args) {
	args = args.match(/\(node:([0-9])*\)|Warning\:/g) ? `${chalk.cyan(args.match(/\(node:([0-9])*\)|Warning\:/g)[0])} ${args.replace(/\(node:([0-9])*\)\s|Warning\:\s/g, "")}`: args
	args = args.replace(/at\s/gm, chalk.magenta("@ "));
	args = args.split("\n")[0] + "\n" + chalk.grey(args.split("\n").splice(1).join("\n"))
	return args;
}
