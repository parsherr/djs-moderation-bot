const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Belirttiğiniz kullanıcının sunucudaki yasağını kaldırır.')
        .addStringOption(option => 
            option.setName('kullanıcı_id')
                .setDescription('Yasağını kaldırmak istediğiniz kullanıcının ID\'sini belirtin.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('sebep')
                .setDescription('Yasağı kaldırma sebebini girin.')
                .setRequired(false)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: "Bu komutu kullanmak için `Üyeleri Yasakla` yetkisine sahip olmalısınız.", ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: "Bu komutu kullanabilmem için `Üyeleri Yasakla` yetkisine sahip olmalıyım.", ephemeral: true });
        }

        const userId = interaction.options.getString('kullanıcı_id');
        const reason = interaction.options.getString('sebep') || 'Belirtilmemiş';

        if (!userId) {
            return interaction.reply({ content: "Lütfen yasağını kaldırmak istediğiniz kullanıcının ID'sini belirtin.", ephemeral: true });
        }

        try {
            const bans = await interaction.guild.bans.fetch();
            const user = bans.get(userId);

            if (!user) {
                return interaction.reply({ content: "Bu kullanıcı sunucuda yasaklanmamış.", ephemeral: true });
            }

            await interaction.guild.members.unban(userId, reason);

            const unbanEmbed = new EmbedBuilder()
                .setTitle('Kullanıcı Yasağı Kaldırıldı')
                .setColor('#00ff00')
                .setDescription(`${user.user.tag} kullanıcısının yasağı başarıyla kaldırıldı.`)
                .addFields(
                    { name: 'Kullanıcı ID', value: userId, inline: true },
                    { name: 'Yasağı Kaldıran Yetkili', value: interaction.user.tag, inline: true },
                    { name: 'Yasağı Kaldırma Sebebi', value: reason, inline: true }
                )
                .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
                .setFooter({
                    text: `Bu komutu kullanan: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({ embeds: [unbanEmbed] });
        } catch (error) {
            console.error("Kullanıcının yasağı kaldırılırken hata oluştu:", error);
            await interaction.reply({ content: "Kullanıcının yasağı kaldırılırken bir hata oluştu.", ephemeral: true });
        }
    }
};

exports.conf = {
    aliases: ['unban', 'banaç', 'bankaldır'],
    permLevel: 0,
    kategori: "Moderasyon"
};

exports.help = {
    name: "unban",
    description: "Belirttiğiniz kullanıcının sunucudaki yasağını kaldırır.",
    usage: "/unban <kullanıcı_id> [sebep]"
};