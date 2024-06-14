const { Client, GatewayIntentBits, Partials, Collection, REST, Routes, EmbedBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const fs = require("fs");
const ayarlar = require("./ayarlar.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction
    ]
});

client.commands = new Collection();
client.slashCommands = new Collection();
client.afk = new Collection();
client.modlogs = new Collection();





const commandFiles = fs.readdirSync('./komutlar').filter(file => file.endsWith('.js'));

const commands = [];

for (const file of commandFiles) {
    const command = require(`./komutlar/${file}`);
    if (command.data) {
        commands.push(command.data.toJSON());
        client.slashCommands.set(command.data.name, command);
    }
}

const rest = new REST({ version: '10' }).setToken(ayarlar.token);

client.once('ready', async () => {
    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
    } catch (error) {
        console.error(error);
    }

    client.user.setPresence({ activities: [{ name: 'Gelişmiş Moderasyon Botu' }] });

    let totalUsers = 0;
    client.guilds.cache.forEach(guild => {
        totalUsers += guild.memberCount;
    });

    console.log(`Bot İsmi: ${client.user.tag}`);
    console.log(`Bot ID: ${client.user.id}`);
    console.log(`Toplam Kullanıcılar: ${totalUsers}`);
    console.log(`Toplam Komut: ${client.slashCommands.size}`);
   
});

  
client.on("messageCreate", async (message) => {
    if (client.kufurEngel && !message.author.bot) {
        const kufurList = [
            "oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amsk", "sikim", "sikiyim", 
            "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "göt", "sik", "yarrak", "am", 
            "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "ak", "amq", "amını", "anneni",
            "kaşar", "pezevenk", "yarak", "fuck", "ibne", "skim", "amına", "taşşak", "yarak", "bitch", "nigga", "aw", "yarra", "skiyim", "götveren"
        ];

        const regex = new RegExp(`\\b(${kufurList.join("|")})\\b`, "i");

        if (regex.test(message.content)) {
            message.delete();

            try {
                await message.member.timeout(10 * 60 * 1000, "Küfür ettiği için susturuldu."); // 10 dakika (600000 ms)
                message.channel
                    .send(`${message.author}, bu sunucuda küfür etmek yasaktır! Küfür ettiği için 10 dakika boyunca susturuldunuz.`)
                    .then((msg) => {
                        setTimeout(() => msg.delete(), 5000);
                    });
            } catch (error) {
                console.error(`Kullanıcı susturulamadı: ${error}`);
                message.channel
                    .send(`Küfür eden kişiye ceza verilirken bir hata oluştu.`)
                    .then((msg) => {
                        setTimeout(() => msg.delete(), 5000);
                    });
            }
        }
    }
});
client.on('messageCreate', async message => {
    if (client.reklamEngel && !message.author.bot) {
        const Reklamlist = [
            "http://",
            "https://",
            "www.",
            ".com",
            ".net",
            ".org",
            ".info",
            ".biz",
            ".co",
            ".xyz",
            ".tk",
            ".ml",
            ".ga",
            ".com.tr",
            ".net.tr",
            ".org.tr",
            ".info.tr",
            ".gov.tr",
            ".edu.tr",
            ".k12.tr",
            ".bel.tr",
            ".av.tr",
            ".name.tr",
            ".web.tr",
            ".gen.tr",
            "discord.gg",
            "discordapp.com/invite",
            "bit.ly",
            "tinyurl.com",
            "goo.gl",
            "t.co",
            "instagram.com",
            "facebook.com",
            "twitter.com",
            "youtube.com",
            "twitch.tv",
            "dailymotion.com",
            "vimeo.com"
        ];

        if (Reklamlist.some(reklam => message.content.toLowerCase().includes(reklam))) {
            try {
                await message.delete();
                await message.channel.send(`${message.author}, Bu sunucuda reklam yapmak yasaktır`).then(msg => {
                    setTimeout(() => msg.delete(), 5000);
                });

                if (message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                    const timeoutDuration = 5 * 60 * 1000; 
                    await message.member.timeout(timeoutDuration, 'Reklam yapmak yasaktır');
                    await message.channel.send(`${message.author} kullanıcısına reklam yaptığı için 5 dakika süreyle timeout uygulandı.`);
                } else {
                    await message.channel.send(`${message.author}, reklam yaptığınız için timeout uygulanamadı. Lütfen yetkili birine başvurun.`);
                }
            } catch (error) {
                console.error('Reklam engelleme sırasında hata oluştu:', error);
                await message.channel.send('Reklam engelleme sırasında bir hata oluştu. Lütfen tekrar deneyin veya yetkilerinizin doğru olduğundan emin olun.');
            }
        }
    }
});
client.on('guildMemberAdd', async member => {
    if (client.autoRole) {
        const role = member.guild.roles.cache.get(client.autoRole);
        if (role) {
            try {
                await member.roles.add(role);
            } catch (error) {
                console.error(`Rol verme hatası: ${error}`);
            }
        }
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        if (!interaction.replied) {
            await interaction.reply({ content: 'Komut çalıştırılırken bir hata oluştu.', ephemeral: true });
        }
    }
});

client.on('messageCreate', async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;

    if (client.afk.has(message.author.id)) {
        client.afk.delete(message.author.id);
        const afkEmbed = new EmbedBuilder()
            .setDescription(`${message.author.tag}, AFK modundan çıkarıldınız!`)
            .setColor('#ffcc00');
        message.channel.send({ embeds: [afkEmbed] });
    }

    message.mentions.users.forEach(mentionedUser => {
        if (client.afk.has(mentionedUser.id)) {
            const afkReason = client.afk.get(mentionedUser.id);
            const afkMentionedEmbed = new EmbedBuilder()
                .setTitle('Kullanıcı AFK')
                .setColor('#ffcc00')
                .setDescription(`${mentionedUser.tag} şu nedenle AFK: **${afkReason}**`)
                .setFooter({
                    text: `Bu komutu isteyen: ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true })
                });

            message.reply({ embeds: [afkMentionedEmbed] });
        }
    });
});

client.on('messageDelete', async (message) => {
    const logChannelId = client.modlogs.get(message.guild.id);
    if (!logChannelId) return;

    const logChannel = client.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setDescription(`🗑️ **@${message.author.tag}** tarafından gönderilen mesaj **#${message.channel.name}** kanalında silindi:\n\n${message.content || 'Mesaj içeriği bulunamadı.'}`)
        .setColor('#2C2F33')
        .setFooter({ text: `${message.guild.name} • ${new Date().toLocaleString()}`, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
    const logChannelId = client.modlogs.get(oldMessage.guild.id);
    if (!logChannelId) return;

    const logChannel = client.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setAuthor({ name: newMessage.author.tag, iconURL: newMessage.author.displayAvatarURL({ dynamic: true }) })
        .setDescription(`✏️ **@${newMessage.author.tag}** tarafından gönderilen mesaj **#${newMessage.channel.name}** kanalında düzenlendi:\n\n**Eski Mesaj:**\n${oldMessage.content || 'Eski mesaj yok.'}\n\n**Yeni Mesaj:**\n${newMessage.content || 'Yeni mesaj yok.'}\n\n[Mesaja Git](${newMessage.url})`)
        .setColor('#2C2F33')
        .setFooter({ text: `${newMessage.guild.name} • ${new Date().toLocaleString()}`, iconURL: newMessage.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});

client.on('guildMemberAdd', member => {
    const logChannelId = client.modlogs.get(member.guild.id);
    if (!logChannelId) return;

    const logChannel = client.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`${member.user.tag} sunucuya katıldı.`)
        .setColor('#00ff00')
        .setFooter({ text: `${member.guild.name} • ${new Date().toLocaleString()}`, iconURL: member.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});

client.on('guildMemberRemove', member => {
    const logChannelId = client.modlogs.get(member.guild.id);
    if (!logChannelId) return;

    const logChannel = client.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`${member.user.tag} sunucudan ayrıldı.`)
        .setColor('#ff0000')
        .setFooter({ text: `${member.guild.name} • ${new Date().toLocaleString()}`, iconURL: member.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const logChannelId = client.modlogs.get(oldMember.guild.id);
    if (!logChannelId) return;

    const logChannel = client.channels.cache.get(logChannelId);
    if (!logChannel) return;

    if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`**@${newMember.user.tag}** kullanıcısının rolleri güncellendi.`)
            .addFields(
                { name: 'Eski Roller', value: `${oldMember.roles.cache.map(role => role.name).join(', ') || 'Eski roller bulunamadı.'}`, inline: true },
                { name: 'Yeni Roller', value: `${newMember.roles.cache.map(role => role.name).join(', ') || 'Yeni roller bulunamadı.'}`, inline: true }
            )
            .setColor('#ffcc00')
            .setFooter({ text: `${newMember.guild.name} • ${new Date().toLocaleString()}`, iconURL: newMember.guild.iconURL({ dynamic: true }) })
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }

    if (oldMember.communicationDisabledUntil !== newMember.communicationDisabledUntil) {
        let description;
        const duration = newMember.communicationDisabledUntil
            ? Math.round((newMember.communicationDisabledUntil.getTime() - Date.now()) / 60000)
            : 0;

        if (newMember.communicationDisabledUntil) {
            description = `🔇 **@${newMember.user.tag}** kullanıcısı ${duration} dakika boyunca susturuldu.`;
        } else {
            description = `🔊 **@${newMember.user.tag}** kullanıcısının susturulması kaldırıldı.`;
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(description)
            .setColor(newMember.communicationDisabledUntil ? '#2C2F33' : '#2C2F33')
            .setFooter({ text: `${newMember.guild.name} • ${new Date().toLocaleString()}`, iconURL: newMember.guild.iconURL({ dynamic: true }) })
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
});


client.on('guildBanAdd', async (ban) => {
    const logChannelId = client.modlogs.get(ban.guild.id);
    if (!logChannelId) return;

    const logChannel = client.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setAuthor({ name: ban.user.tag, iconURL: ban.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`🚫 **@${ban.user.tag}** kullanıcısı sunucudan yasaklandı.`)
        .setColor('#ff0000')
        .setFooter({ text: `${ban.guild.name} • ${new Date().toLocaleString()}`, iconURL: ban.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});

client.on('guildBanRemove', async (ban) => {
    const logChannelId = client.modlogs.get(ban.guild.id);
    if (!logChannelId) return;

    const logChannel = client.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setAuthor({ name: ban.user.tag, iconURL: ban.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`🔓 **@${ban.user.tag}** kullanıcısının sunucudaki yasağı kaldırıldı.`)
        .setColor('#00ff00')
        .setFooter({ text: `${ban.guild.name} • ${new Date().toLocaleString()}`, iconURL: ban.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});
client.on('guildMemberKick', async (member) => { 
    const logChannelId = client.modlogs.get(member.guild.id);
    if (!logChannelId) return;

    const logChannel = client.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`👢 ${member.user.tag} kullanıcısı sunucudan atıldı.`)
        .setColor('#2C2F33')
        .setFooter({ text: `${member.guild.name} • ${new Date().toLocaleString()}`, iconURL: member.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
});

client.login(ayarlar.token);