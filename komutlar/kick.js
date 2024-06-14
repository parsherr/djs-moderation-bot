const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Belirttiğiniz kullanıcıyı sunucudan atar.')
        .addUserOption(option => 
            option.setName('kullanıcı')
                .setDescription('Atmak istediğiniz kullanıcıyı belirtin.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('sebep')
                .setDescription('Atma sebebini girin.')
                .setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('kullanıcı');
        const reason = interaction.options.getString('sebep') || 'Belirtilmemiş';

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: "Bu komutu kullanmak için `Üyeleri At` yetkisine sahip olmalısınız.", ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: "Bu komutu kullanabilmem için `Üyeleri At` yetkisine sahip olmalıyım.", ephemeral: true });
        }

        if (!user) {
            return interaction.reply({ content: "Lütfen atmak istediğiniz kullanıcıyı belirtin.", ephemeral: true });
        }

        if (user.id === interaction.user.id) {
            return interaction.reply({ content: "Kendinizi atamazsınız.", ephemeral: true });
        }

        try {
            await interaction.guild.members.kick(user.id, { reason: reason });

            const kickEmbed = new EmbedBuilder()
                .setTitle('Kullanıcı Atıldı')
                .setColor('#ff0000')
                .setDescription(`${user.tag} kullanıcısı başarıyla atıldı.`)
                .addFields(
                    { name: 'Kullanıcı ID', value: user.id, inline: true },
                    { name: 'Atan Yetkili', value: interaction.user.tag, inline: true },
                    { name: 'Atma Sebebi', value: reason, inline: true }
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setFooter({
                    text: `Bu komutu kullanan: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({ embeds: [kickEmbed] });
        } catch (error) {
            console.error("Kullanıcı atılırken hata oluştu:", error);
            await interaction.reply({ content: "Kullanıcı atılırken bir hata oluştu.", ephemeral: true });
        }
    }
};

exports.conf = {
    aliases: ['at'],
    permLevel: 0,
    kategori: "Moderasyon"
};

exports.help = {
    name: "kick",
    description: "Belirttiğiniz kullanıcıyı sunucudan atar.",
    usage: "/kick <@kullanıcı> [sebep]"
};