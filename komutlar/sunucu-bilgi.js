const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sunucu-bilgi')
    .setDescription('Sunucu hakkında detaylı bilgi verir.'),

  async execute(interaction) {
    const { guild } = interaction;
    const owner = await guild.fetchOwner();

    const channels = guild.channels.cache;
    const textChannels = channels.filter(channel => channel.type === 'GUILD_TEXT').size;
    const voiceChannels = channels.filter(channel => channel.type === 'GUILD_VOICE').size;
    const categories = channels.filter(channel => channel.type === 'GUILD_CATEGORY').size;

    const totalMembers = guild.memberCount;
    const onlineMembers = guild.members.cache.filter(member => member.presence?.status === 'online').size;
    const idleMembers = guild.members.cache.filter(member => member.presence?.status === 'idle').size;
    const dndMembers = guild.members.cache.filter(member => member.presence?.status === 'dnd').size;
    const offlineMembers = guild.members.cache.filter(member => !member.presence || member.presence.status === 'offline').size;

    const embed = new EmbedBuilder()
      .setTitle('Sunucu Bilgileri')
      .setColor('#2F3136')
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: 'Kanallar', value: `📄 ${textChannels} Metin\n🔊 ${voiceChannels} Ses\n📁 ${categories} Kategori`, inline: true },
        { name: 'Sunucu Sahibi', value: `👑 ${owner.user.tag}`, inline: true },
        { name: 'Sunucu Bölgesi', value: `🌍 ${guild.region}`, inline: true },
        { name: 'Sunucu Kuruluş', value: `📅 ${guild.createdAt.toDateString()}`, inline: true },
        { name: 'Toplam Yasaklı', value: `🚫 ${guild.bans.cache.size}`, inline: true },
        { name: 'Sunucu Shard', value: `🔢 ${guild.shardId}`, inline: true },
        { name: 'Booster Sayısı', value: `💎 ${guild.premiumSubscriptionCount}`, inline: true },
        { name: 'Sesteki Üye Sayısı', value: `🔊 ${voiceChannels}`, inline: true },
        { name: 'Tüm Kullanıcılar', value: `👥 ${totalMembers}`, inline: true },
        { name: 'Çevrimiçi', value: `🟢 ${onlineMembers}`, inline: true },
        { name: 'Boşta', value: `🌙 ${idleMembers}`, inline: true },
        { name: 'Rahatsız Etmeyin', value: `⛔ ${dndMembers}`, inline: true },
        { name: 'Çevrimdışı', value: `⚫ ${offlineMembers}`, inline: true }
      )
      .setFooter({
        text: `Sorgulayan: ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      });

    await interaction.reply({ embeds: [embed] });
  },
};

exports.conf = {
  aliases: ['sunucubilgi', 'serverinfo', 'sbilgi'],
  permLevel: 0,
  kategori: 'Genel'
};

exports.help = {
  name: 'sunucu-bilgi',
  description: 'Sunucu hakkında detaylı bilgi verir.',
  usage: '/sunucu-bilgi'
};