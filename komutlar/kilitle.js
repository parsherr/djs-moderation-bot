const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kilitle')
        .setDescription('Belirtilen kanalı kilitler.')
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Kilitlenecek kanal.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const channel = interaction.options.getChannel('kanal');

        if (!interaction.guild) {
            return interaction.reply({ content: 'Bu komut sadece sunucularda kullanılabilir.', ephemeral: true });
        }

        const permissions = channel.permissionOverwrites.resolve(interaction.guild.id);

        if (permissions && permissions.deny.has('SendMessages')) {
            return interaction.reply({ content: 'Bu kanal zaten kilitli.', ephemeral: true });
        }

        await channel.permissionOverwrites.edit(interaction.guild.id, { 
            SendMessages: false 
        });

        const embed = new EmbedBuilder()
            .setTitle('🔒 Kanal Kilitlendi')
            .setColor('#ff0000')
            .setDescription(`🔒 ${channel.name} kanalı başarıyla kilitlendi.`)
            .setFooter({
                text: `Bu komutu kullanan: ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

        await interaction.reply({ embeds: [embed] });
    }
};

exports.conf = {
    aliases: ['lock'],
    permLevel: 0,
    kategori: "Moderasyon"
};

exports.help = {
    name: "kilitle",
    description: "Belirtilen kanalı kilitler.",
    usage: "/kilitle kanal"
};