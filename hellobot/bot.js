var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message) {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(message) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            case 'meme':
                bot.sendMessage({
                    to: channelID,
                    message: 'Monday!'
                });
            break;
            // Just add any case commands if you want to..
         }
    }
    let myRole = message.guild.roles.find("name", "Capos");
    // assuming role.id is an actual ID of a valid role
    if(message.member.roles.has(myRole.id)) {
        console.log('Yay, the author of the message has the role');
    } else {
        console.log('Nope, noppers, nadda');
    }

    // // Check if they have one of many roles
    // if(message.member.roles.some(r=>["Dev", "Mod", "Server Staff", "Proficient"].includes(r.name)) ) {
    // // has one of the roles
    // } else {
    // // has none of the roles
    // }
    // let roleId = myRole.id;
    // let membersWithRole = message.guild.roles.get(roleID).members;
    // console.log('Got ${membersWithRole.size} members with that role')

    // let role = message.guild.find("name", "Winners");
    // let member = message.member 

    // // or the person they metioned: let member = message.mentions.members.first();

    // // Add the role
    // member.addRole(role).catch(console.error);

    // // remove a role
    // // member.removeRole(role).catch(console.error);

    // // Getting all permissions for a member on a channel.
    // let perms = message.channel.permissionsFor(message.member);

    // // Checks for manage Messages permissions
    // let can_manage_chans = message.channel.permissions(message.member).hasPermissions("MANNAGE_MESSAGE");

    // // View permissions as an object (useful for debugging or eval)
    // message.channel.permissionsFor(message.member).serialize();

});

