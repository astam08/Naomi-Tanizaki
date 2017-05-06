const { Command } = require('discord.js-commando');
const moment = require('moment');
const { stripIndents } = require('common-tags');
const colors = require('../../assets/_data/colors.json');
const username = require('../../models/UserName');

module.exports = class UserInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'user-info',
			aliases: ['user'],
			group: 'info',
			memberName: 'user',
			description: 'Get info on a user.',
			details: `Get detailed information on the specified user.`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'member',
					prompt: 'what user would you like to have information on?\n',
					type: 'member',
					default: ''
				}
			]
		});
	}

	async run(msg, { member }) {
		const _member = member || msg.member;
		const user = _member.user;
		const usernames = await username.findAll({ where: { userID: user.id } });

		return msg.embed({
			color: colors.blue,
			fields: [
				{
					name: '❯ Member Details',
					value: stripIndents`
						${_member.nickname !== null ? ` • Nickname: ${_member.nickname}` : '• No nickname'}
						• Roles: ${_member.roles.map(roles => `\`${roles.name}\``).join(' ')}
						• Joined at: ${moment.utc(_member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss ZZ')}
					`
				},
				{
					name: '❯ User Details',
					value: stripIndents`
						• Created at: ${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss ZZ')}${user.bot
							? '\n• Is a bot account'
							: ''}
						• Aliases: ${usernames.length ? usernames.map(uName => uName.username).join(', ') : user.username}
						• Status: ${user.presence.status}
						• Game: ${user.presence.game ? user.presence.game.name : 'None'}
					`
				}
			],
			thumbnail: { url: user.avatarURL }
		});
	}
};
