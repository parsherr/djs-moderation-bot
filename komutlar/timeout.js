const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

function parseDuration(duration) {
    const durationPattern = /(\d+)([dhs]?|gün|saat|dk|dakika)\s*/g;
    let totalMinutes = 0;

    let match;
    while ((match = durationPattern.exec(duration)) !== null) {
        const amount = parseInt(match[1]);
        const unit = match[2];

        switch (unit) {
            case 'd':
            case 'gün':
                totalMinutes += amount * 1440;
                break;
            case 'h':
            case 'saat':
                totalMinutes += amount * 60;
                break;
            case 'm':
            case 'dk':
            case 'dakika':
            case '':
                totalMinutes += amount;
                break;
            default:
                return null;
        }
    }

    return totalMinutes;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Belirttiğiniz kullanıcıyı belirli bir süre için susturur.')
        .addUserOption(option => 
            option.setName('kullanıcı')
                .setDescription('Susturmak istediğiniz kullanıcıyı belirtin.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('süre')
                .setDescription('Susturma süresini girin (Örn. 10dk, 1saat, 1gün, vb.).')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('sebep')
                .setDescription('Susturma sebebini girin.')
                .setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('kullanıcı');
        const rawDuration = interaction.options.getString('süre');
        const duration = parseDuration(rawDuration);
        const reason = interaction.options.getString('sebep') || 'Belirtilmemiş';

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: "Bu komutu kullanmak için `Üyeleri Yönet` yetkisine sahip olmalısınız.", ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: "Bu komutu kullanabilmem için `Üyeleri Yönet` yetkisine sahip olmalıyım.", ephemeral: true });
        }

        if (!user) {
            return interaction.reply({ content: "Lütfen susturmak istediğiniz kullanıcıyı belirtin.", ephemeral: true });
        }

        if (!rawDuration || isNaN(duration) || duration <= 0 || duration > 10080) { 
            return interaction.reply({ content: "Lütfen geçerli bir süre belirtin (örneğin, `10dk`, `1saat`, `1gün` veya birleşik olarak `1gün 1dk 1saat`).", ephemeral: true });
        }

        if (!interaction.guild.members.cache.get(user.id)) {
            return interaction.reply({ content: "Bu kullanıcı bu sunucuda bulunmuyor.", ephemeral: true });
        }

        if (user.id === interaction.user.id) {
            return interaction.reply({ content: "Kendinizi susturamazsınız.", ephemeral: true });
        }

        if (!interaction.guild.members.cache.get(user.id).manageable) {
            return interaction.reply({ content: "Bu kullanıcıyı susturamıyorum, yetkilerimi kontrol edin.", ephemeral: true });
        }

        try {
            const member = await interaction.guild.members.cache.get(user.id);
            await member.timeout(duration * 60 * 1000, reason); 
            const timeoutEmbed = new EmbedBuilder()
                .setTitle('Kullanıcı Susturuldu')
                .setColor('#ff0000')
                .setDescription(`${user.tag} kullanıcısı başarıyla susturuldu.`)
                .addFields(
                    { name: 'Kullanıcı ID', value: user.id, inline: true },
                    { name: 'Susturan Yetkili', value: interaction.user.tag, inline: true },
                    { name: 'Susturma Sebebi', value: reason, inline: true },
                    { name: 'Susturma Süresi', value: `${rawDuration}`, inline: true }
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setFooter({
                    text: `Bu komutu kullanan: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                });

            await interaction.reply({ embeds: [timeoutEmbed] });
        } catch (error) {
            console.error("Kullanıcı susturulurken hata oluştu:", error);
            return interaction.reply({ content: "Kullanıcı susturulurken bir hata oluştu.", ephemeral: true });
        }
    }
};

exports.conf = {
    aliases: ['sustur', 'timeout', 'mute'],
    permLevel: 0,
    kategori: "Moderasyon"
};

exports.help = {
    name: "mute",
    description: "Belirttiğiniz kullanıcıyı belirli bir süre için susturur.",
    usage: "/mute <@kullanıcı> <süre> [sebep]"
};