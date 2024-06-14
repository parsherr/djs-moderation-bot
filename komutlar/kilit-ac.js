    const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
    const { EmbedBuilder } = require('discord.js');

    module.exports = {
        data: new SlashCommandBuilder()
            .setName('kilit-aç')
            .setDescription('Belirtilen kanalın kilidini açar.')
            .addChannelOption(option =>
                option.setName('kanal')
                    .setDescription('Kilidi açılacak kanal.')
                    .setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

        async execute(interaction) {
            const channel = interaction.options.getChannel('kanal');

            if (!interaction.guild) {
                return interaction.reply({ content: 'Bu komut sadece sunucularda kullanılabilir.', ephemeral: true });
            }

            const permissions = channel.permissionOverwrites.resolve(interaction.guild.id);

            if (permissions && !permissions.deny.has('SendMessages')) {
                return interaction.reply({ content: 'Bu kanalın kilidi zaten açık.', ephemeral: true });
            }

            await channel.permissionOverwrites.edit(interaction.guild.id, { 
                SendMessages: true 
            });

            const embed = new EmbedBuilder()
                .setTitle('🔓 Kanal Kilidi Açıldı')
                .setColor('#00ff00')
                .setDescription(`🔓 ${channel.name} kanalının kilidi başarıyla açıldı.`)
                .setFooter({
                    text: `Bu komutu kullanan: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({ embeds: [embed] });
        }
    };

    exports.conf = {
        aliases: ['unlock'],
        permLevel: 0,
        kategori: "Moderasyon"
    };

    exports.help = {
        name: "kilit-aç",
        description: "Belirtilen kanalın kilidini açar.",
        usage: "/kilit-aç kanal"
    };