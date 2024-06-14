const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Belirttiğiniz neden ile AFK moduna geçersiniz.')
        .addStringOption(option => 
            option.setName('sebep')
                .setDescription('AFK olma nedeninizi girin.')
                .setRequired(false)),

    async execute(interaction) {
        const reason = interaction.options.getString('sebep') || 'Belirtilmemiş';

        interaction.client.afk.set(interaction.user.id, reason);

        const afkEmbed = new EmbedBuilder()
            .setTitle('AFK Modu')
            .setColor('#ffcc00')
            .setDescription(`${interaction.user.tag} şu nedenle AFK moduna geçti: **${reason}**`)
            .setFooter({
                text: `Bu komutu kullanan: ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

        await interaction.reply({ embeds: [afkEmbed] });
    }
};

exports.conf = {
    aliases: ['afk'],
    permLevel: 0,
    kategori: "Genel"
};

exports.help = {
    name: "afk",
    description: "Belirttiğiniz neden ile AFK moduna geçersiniz.",
    usage: "/afk [sebep]"
};