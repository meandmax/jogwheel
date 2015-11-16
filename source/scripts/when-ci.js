import chalk from 'chalk';
import minimist from 'minimist';

function isLeader(jobNumber = '') {
	const fragments = jobNumber.split('.');
	return fragments[fragments.length - 1] === '1';
}

function isTrusted() {
	return process.env.TRAVIS_SECURE_ENV_VARS === 'true';
}

function isNoPullRequest() {
	return process.env.TRAVIS_PULL_REQUEST === 'false';
}

function main(options) {
	const job = process.env.TRAVIS_JOB_NUMBER;

	if (!job) {
		console.log(`  ${chalk.yellow('⚠')}   Skipping, "$TRAVIS_JOB_NUMBER" is not defined.`);
		throw new Error(1);
	} else {
		console.log(`  ${chalk.green('✔')}   Job number is "${job}".`);
	}

	if (options.leader) {
		if  (!isLeader(job)) {
			console.log(`  ${chalk.yellow('⚠')}   Skipping, job "${job}" is not the leader. ${chalk.gray('[--leader]')}`);
			throw new Error(1);
		} else if (options.leader) {
			console.log(`  ${chalk.green('✔')}   Job "${job}" is the leader. ${chalk.gray('[--leader]')}`);
		}
	}

	if (options['pull-request'] === false) {
		if (!isNoPullRequest()) {
			console.log(`  ${chalk.yellow('⚠')}   Skipping, "${job}" is a pull request. ${chalk.gray('[--no-pull-request]')}`);
			throw new Error(1);
		} else {
			console.log(`  ${chalk.green('✔')}   Job "${job}" is no pull request. ${chalk.gray('[--no-pull-request]')}`);
		}
	}

	if (options.trusted) {
		if (!isTrusted(job)) {
			console.log(`  ${chalk.yellow('⚠')}   Skipping, job "${job}" has no secure env variables. ${chalk.grey('[--trusted]')}`);
			throw new Error(1);
		} else if (options.trusted) {
			console.log(`  ${chalk.green('✔')}   Job "${job}" has secure env variables. ${chalk.grey('[--trusted]')}`);
		}
	}

	if (options.master) {
		if (process.env.TRAVIS_BRANCH !== "master" || !isNoPullRequest()) {
			console.log(`  ${chalk.yellow('⚠')}   Skipping, job "${job}" on branch "${process.env.TRAVIS_BRANCH}", not master. ${chalk.grey('[--master]')}`);
			throw new Error(1);
		} else if (options.trusted) {
			console.log(`  ${chalk.green('✔')}   Job "${job}" is on branch master. ${chalk.grey('[--trusted]')}`);
		}
	}
}

try {
	main(minimist(process.argv.slice(2)));
} catch (err) {
	if (err.message !== '1') {
		console.error(err.message);
		console.trace(err.trace);
	}
	process.exit(1);
}