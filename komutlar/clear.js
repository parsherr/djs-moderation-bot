const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Belirtilen sayıda mesajı siler.')
        .addIntegerOption(option =>
            option.setName('sayı')
                .setDescription('Silinecek mesaj sayısı')
                .setRequired(true)),

    async execute(interaction) {
        const amount = interaction.options.getInteger('sayı');

        if (amount < 1 || amount > 200) {
            return interaction.reply({ content: 'Lütfen 1 ile 100 arasında bir sayı girin.', ephemeral: true });
        }

        try {
            const fetched = await interaction.channel.messages.fetch({ limit: sayı });
            await interaction.channel.bulkDelete(fetched, true);

            const clearEmbed = new EmbedBuilder()
                .setTitle('Mesajlar Silindi')
                .setColor('#ff0000')
                .setDescription(`${fetched.size} mesaj başarıyla silindi.`)
                .setFooter({
                    text: `Bu komutu kullanan: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            const replyMessage = await interaction.reply({ embeds: [clearEmbed], ephemeral: false });

            setTimeout(() => {
                interaction.deleteReply().catch(console.error);
            }, 5000); 
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Mesajlar silinirken bir hata oluştu.', ephemeral: true });
        }
    }
};

exports.conf = {
    aliases: ['temizle'],
    permLevel: 0,
    kategori: "Moderasyon"
};

exports.help = {
    name: "clear",
    description: "Belirtilen sayıda mesajı siler.",
    usage: "/clear [sayı]"
};