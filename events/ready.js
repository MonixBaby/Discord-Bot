module.exports = async bot => {
	// LOG ready event
	bot.logger.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=', 'ready');
	bot.logger.log(`${bot.user.tag}, ready to serve [${bot.users.cache.size}] users in [${bot.guilds.cache.size}] servers.`, 'ready');
	bot.logger.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=', 'ready');

	bot.appInfo = await bot.fetchApplication();
	// dashboard comes online (moved here so user information can be retrieved from bot to dashboard)
	require('../modules/website/dashboard')(bot);
	setInterval(async () => {
		bot.appInfo = await bot.fetchApplication();
	}, 60000);
	// Sets Bot's activity to !help and status to 'Online'
	const activities = [`${bot.guilds.cache.size} servers!`, `${bot.users.cache.size} users!`];
	let j = 0;
	setInterval(() => bot.user.setActivity(`${activities[j++ % activities.length]}`, { type: 'WATCHING' }), 10000);
	bot.user.setStatus('Online');
	// Check if any servers added the bot while offline
	bot.guilds.cache.forEach(async item => {
		let settings;
		try {
			settings = await bot.getGuild(item);
		} catch (e) {
			console.log(e);
		}
		if (settings.guildID == undefined) {
			try {
				const newGuild = {
					guildID: item.id,
					guildName: item.name,
				};
				await bot.CreateGuild(newGuild);
				bot.logger.log(`[GUILD JOIN] ${item.name} (${item.id}) added the bot.`);
			} catch (e) {
				console.error(e);
			}
		}
	});
};
