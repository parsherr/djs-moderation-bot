const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Botun gecikme süresini gösterir.'),

    async execute(interaction) {
        const msg = await interaction.reply({ content: "Ping hesaplanıyor...", fetchReply: true });

        const pingEmbed = new EmbedBuilder()
            .setTitle('🏓 Pong!')
            .setColor('#2C2F33')
            .setDescription(`
                **Mesaj Gecikmesi:** ${msg.createdTimestamp - interaction.createdTimestamp}ms
                **API Gecikmesi:** ${Math.round(interaction.client.ws.ping)}ms
            `)
            .setFooter({
                text: `Bu komutu isteyen: ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

        await interaction.editReply({ content: ' ', embeds: [pingEmbed] });
    }
};

exports.conf = {
    aliases: ['gecikme', 'latency'],
    permLevel: 0,
    kategori: "Genel"
};

exports.help = {
    name: "ping",
    description: "Botun gecikme süresini gösterir.",
    usage: "/ping"
};