const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Kendi avatarınızı veya belirtilen kullanıcıyı gösterir.')
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('Avatarını görmek istediğiniz kullanıcı')
                .setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('kullanıcı') || interaction.user;

        const avatarURL = user.displayAvatarURL({ dynamic: true, size: 4096 });
        const avatarEmbed = new EmbedBuilder()
            .setColor("#2C2F33")
            .setTitle(`${user.tag} Avatar`)
            .addFields({ name: 'Avatar Linki', value: `[Avatar Burada](${avatarURL})` })
            .setImage(avatarURL)
            .setFooter({
                text: `Bu komutu kullanan: ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

        await interaction.reply({ embeds: [avatarEmbed] });
    }
};

exports.conf = {
    aliases: ['pp', 'profilepicture'],
    permLevel: 0,
    kategori: "Genel"
};

exports.help = {
    name: "avatar",
    description: "Kendi avatarınızı veya belirtilen kullanıcıyı gösterir.",
    usage: "/avatar"
};