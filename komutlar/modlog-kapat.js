const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modlog-kapat')
        .setDescription('Moderasyon loglarının kapatılmasını sağlar.'),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({ content: "Bu komutu kullanmak için `Sunucuyu Yönet` yetkisine sahip olmalısınız.", ephemeral: false });
        }

        if (!client.modlogs.has(interaction.guild.id)) {
            return interaction.reply({ content: "Bu sunucu için zaten ayarlanmış bir modlog kanalı yok.", ephemeral: false });
        }

        client.modlogs.delete(interaction.guild.id);

        const embed = new EmbedBuilder()
            .setTitle('ModLog Kanalı Kapatıldı')
            .setDescription('Moderasyon logları artık kaydedilmeyecek.')
            .setColor('#ff0000')
            .setFooter({
                text: `Bu komutu kullanan: ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};