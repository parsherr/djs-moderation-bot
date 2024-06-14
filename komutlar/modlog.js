const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modlog')
        .setDescription('Moderasyon loglarının kaydedileceği kanalı ayarlar.')
        .addChannelOption(option => 
            option.setName('kanal')
                .setDescription('Moderasyon loglarının kaydedileceği kanal.')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        ),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({ content: "Bu komutu kullanmak için `Sunucuyu Yönet` yetkisine sahip olmalısınız.", ephemeral: false });
        }

        const logChannel = interaction.options.getChannel('kanal');

        if (!logChannel || logChannel.type !== ChannelType.GuildText) {
            return interaction.reply({ content: "Lütfen geçerli bir metin kanalı belirtin.", ephemeral: false });
        }

        client.modlogs.set(interaction.guild.id, logChannel.id);

        const embed = new EmbedBuilder()
            .setTitle('ModLog Kanalı Ayarlandı')
            .setDescription(`Moderasyon logları artık ${logChannel} kanalına kaydedilecek.`)
            .setColor('#00ff00')
            .setFooter({
                text: `Bu komutu kullanan: ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};