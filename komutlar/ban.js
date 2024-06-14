const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Belirttiğiniz kullanıcıyı sunucudan yasaklar.')
        .addUserOption(option => 
            option.setName('kullanıcı')
                .setDescription('Yasaklamak istediğiniz kullanıcıyı belirtin.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('sebep')
                .setDescription('Yasaklama sebebini girin.')
                .setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('kullanıcı');
        const reason = interaction.options.getString('sebep') || 'Belirtilmemiş';

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: "Bu komutu kullanmak için `Üyeleri Yasakla` yetkisine sahip olmalısınız.", ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: "Bu komutu kullanabilmem için `Üyeleri Yasakla` yetkisine sahip olmalıyım.", ephemeral: true });
        }

        if (!user) {
            return interaction.reply({ content: "Lütfen yasaklamak istediğiniz kullanıcıyı belirtin.", ephemeral: true });
        }

        if (user.id === interaction.user.id) {
            return interaction.reply({ content: "Kendinizi yasaklayamazsınız.", ephemeral: true });
        }

        try {
            await interaction.guild.members.ban(user.id, { reason: reason });

            const banEmbed = new EmbedBuilder()
                .setTitle('Kullanıcı Yasaklandı')
                .setColor('#ff0000')
                .setDescription(`${user.tag} kullanıcısı başarıyla yasaklandı.`)
                .addFields(
                    { name: 'Kullanıcı ID', value: user.id, inline: true },
                    { name: 'Yasaklayan Yetkili', value: interaction.user.tag, inline: true },
                    { name: 'Yasaklama Sebebi', value: reason, inline: true }
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setFooter({
                    text: `Bu komutu kullanan: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({ embeds: [banEmbed] });
        } catch (error) {
            console.error("Kullanıcı yasaklanırken hata oluştu:", error);
            await interaction.reply({ content: "Kullanıcı yasaklanırken bir hata oluştu.", ephemeral: true });
        }
    }
};

exports.conf = {
    aliases: ['yasakla'],
    permLevel: 0,
    kategori: "Moderasyon"
};

exports.help = {
    name: "ban",
    description: "Belirttiğiniz kullanıcıyı sunucudan yasaklar.",
    usage: "/ban <@kullanıcı> [sebep]"
};