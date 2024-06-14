const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reklam-engel')
        .setDescription('Reklam engelleme sistemini açar veya kapatır.')
        .addStringOption(option => 
            option.setName('durum')
                .setDescription('Reklam engelleme sistemini açmak veya kapatmak için kullanın.')
                .setRequired(true)
                .addChoices(
                    { name: 'Aç', value: 'ac' },
                    { name: 'Kapat', value: 'kapat' }
                )),

    async execute(interaction) {
        const durum = interaction.options.getString('durum');

        if (durum === 'ac') {
            interaction.client.reklamEngel = true;
            const embed = new EmbedBuilder()
                .setTitle('Reklam Engelleme Sistemi')
                .setColor('#00ff00')
                .setDescription('Reklam engelleme sistemi başarıyla **açıldı**.')
                .setFooter({
                    text: `Bu komutu isteyen: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({ embeds: [embed] });
        } else if (durum === 'kapat') {
            interaction.client.reklamEngel = false;
            const embed = new EmbedBuilder()
                .setTitle('Reklam Engelleme Sistemi')
                .setColor('#ff0000')
                .setDescription('Reklam engelleme sistemi başarıyla **kapandı**.')
                .setFooter({
                    text: `Bu komutu kullanan: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({ embeds: [embed] });
        }
    }
};

exports.conf = {
    aliases: ['reklamengel'],
    permLevel: 0,
    kategori: "Moderasyon"
};

exports.help = {
    name: "reklam-engel",
    description: "Reklam engelleme sistemini açar veya kapatır.",
    usage: "/reklam-engel [durum]"
};