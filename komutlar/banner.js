const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Kendi banner\'ınızı veya belirtilen kullanıcının banner\'ını gösterir.')
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('Banner\'ını görmek istediğiniz kullanıcı')
                .setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('kullanıcı') || interaction.user;

        try {
            const userFetched = await interaction.client.users.fetch(user.id, { force: true });
            const bannerURL = userFetched.bannerURL({ dynamic: true, size: 4096 });

            if (!bannerURL) {
                return interaction.reply(`${user.tag} kullanıcısının bir banner'ı yok.`);
            }

            const bannerEmbed = new EmbedBuilder()
                .setColor("#2C2F33")
                .setTitle(`${user.tag} Banner`)
                .addFields({ name: 'Banner Linki', value: `[Banner Burada](${bannerURL})` })
                .setImage(bannerURL)
                .setFooter({
                    text: `Bu komutu kullanan: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({ embeds: [bannerEmbed] });
        } catch (error) {
            console.error("Banner alınırken hata oluştu:", error);
            await interaction.reply('Banner alınırken bir hata oluştu.');
        }
    }
};

exports.conf = {
    aliases: ['profilbanner', 'profilebanner'],
    permLevel: 0,
    kategori: "Genel"
};

exports.help = {
    name: "banner",
    description: "Kendi banner'ınızı veya belirtilen kullanıcının banner'ını gösterir.",
    usage: "/banner"
};