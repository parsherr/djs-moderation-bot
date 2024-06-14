const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kufur-engel')
        .setDescription('Küfür engelleme sistemini açar veya kapatır.')
        .addStringOption(option => 
            option.setName('durum')
                .setDescription('Küfür engelleme sistemini açmak veya kapatmak için kullanın.')
                .setRequired(true)
                .addChoices(
                    { name: 'Aç', value: 'ac' },
                    { name: 'Kapat', value: 'kapat' }
                )),

    async execute(interaction) {
        // TimeoutMembers ve daha üst yetkilere sahip kullanıcıları kontrol et
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'Bu komutu kullanmak için `Üyeleri Susturma` yetkisine sahip olmalısınız.', ephemeral: true });
        }

        const durum = interaction.options.getString('durum');

        if (durum === 'ac') {
            interaction.client.kufurEngel = true;
            const embed = new EmbedBuilder()
                .setTitle('Küfür Engelleme Sistemi')
                .setColor('#00ff00')
                .setDescription('Küfür engelleme sistemi başarıyla **açıldı**.')
                .setFooter({
                    text: `Bu komutu isteyen: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({ embeds: [embed] });
        } else if (durum === 'kapat') {
            interaction.client.kufurEngel = false;
            const embed = new EmbedBuilder()
                .setTitle('Küfür Engelleme Sistemi')
                .setColor('#ff0000')
                .setDescription('Küfür engelleme sistemi başarıyla **kapandı**.')
                .setFooter({
                    text: `Bu komutu kullanan: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({ embeds: [embed] });
        }
    }
};

exports.conf = {
    aliases: ['kufurengel'],
    permLevel: 0,
    kategori: "Moderasyon"
};

exports.help = {
    name: "kufur-engel",
    description: "Küfür engelleme sistemini açar veya kapatır.",
    usage: "/kufur-engel [durum]"
};