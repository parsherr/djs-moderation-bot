const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Belirttiğiniz kullanıcının timeout süresini kaldırır.')
        .addUserOption(option => 
            option.setName('kullanıcı')
                .setDescription('Timeout süresini kaldırmak istediğiniz kullanıcıyı belirtin.')
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('kullanıcı');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: "Bu komutu kullanmak için `Üyeleri Yönet` yetkisine sahip olmalısınız.", ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: "Bu komutu kullanabilmem için `Üyeleri Yönet` yetkisine sahip olmalıyım.", ephemeral: true });
        }

        if (!user) {
            return interaction.reply({ content: "Lütfen timeout süresini kaldırmak istediğiniz kullanıcıyı belirtin.", ephemeral: true });
        }

        const member = interaction.guild.members.cache.get(user.id);

        if (!member || !member.communicationDisabledUntil) {
            return interaction.reply({ content: "Bu kullanıcı şu anda susturulmamış.", ephemeral: true });
        }

        try {
            await member.timeout(null);  

            const unmuteEmbed = new EmbedBuilder()
                .setTitle('Kullanıcı Susturulması Kaldırıldı')
                .setColor('#00ff00')
                .setDescription(`${user.tag} kullanıcısının susturulması başarıyla kaldırıldı.`)
                .addFields(
                    { name: 'Kullanıcı ID', value: user.id, inline: true },
                    { name: 'Susturmayı Açan Yetkili', value: interaction.user.tag, inline: true }
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setFooter({
                    text: `Bu komutu kullanan: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({ embeds: [unmuteEmbed] });
        } catch (error) {
            console.error("Kullanıcının susturulması kaldırılırken hata oluştu:", error);
            return interaction.reply({ content: "Kullanıcının susturulması kaldırılırken bir hata oluştu.", ephemeral: true });
        }
    }
};

exports.conf = {
    aliases: ['unsilence', 'unmute'],
    permLevel: 0,
    kategori: "Moderasyon"
};

exports.help = {
    name: "unmute",
    description: "Belirttiğiniz kullanıcının susturulma (timeout) süresini kaldırır.",
    usage: "/unmute <@kullanıcı>"
};