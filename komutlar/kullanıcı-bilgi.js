const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kullanıcı-bilgi')
    .setDescription('Belirtilen kullanıcının bilgilerini gösterir.')
    .addUserOption(option =>
      option.setName('kullanıcı')
        .setDescription('Bilgilerini görmek istediğiniz kullanıcıyı seçin.')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const member = interaction.guild.members.cache.get(user.id);

    const formatDate = (date) => {
      return date.toLocaleDateString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' - ' + date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const calculateAccountAge = (createdAt) => {
      const now = new Date();
      const diff = now - createdAt;
      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
      const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return `${years} Yıl ${months} Ay ${days} Gün ${hours} Saat ${minutes} Dakika ${seconds} Saniye`;
    };

    const joinedAt = formatDate(member.joinedAt);
    const createdAt = formatDate(user.createdAt);
    const accountAge = calculateAccountAge(user.createdAt);

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag} Kişisinin Süre Bilgileri`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setColor('#2F3136') 
      .addFields(
        { name: 'Takma Adı', value: member.nickname ? member.nickname : user.username, inline: true },
        { name: 'Sunucuya Katılım', value: `📅 ${joinedAt}`, inline: true },
        { name: 'Discorda Katılım', value: `📅 ${createdAt}`, inline: true },
        { name: 'Discorda Katıldığı Günden İtibaren Geçen Zaman', value: `🕒 ${accountAge}`, inline: false },
        { name: `Roller [${member.roles.cache.size - 1}]`, value: member.roles.cache.map(role => role.name).join(', '), inline: false }
      )
      .setFooter({
        text: `Bu Komutu kullanan: ${interaction.user.tag} | Son güncelleme: ${formatDate(new Date())}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      });

    await interaction.reply({ embeds: [embed] });
  },
};

exports.conf = {
  aliases: ['kullanıcıbilgi', 'userinfo'],
  permLevel: 0,
  kategori: 'Genel'
};

exports.help = {
  name: 'kullanıcı-bilgi',
  description: 'Belirtilen kullanıcının bilgilerini gösterir.',
  usage: '/kullanıcı-bilgi <kullanıcı>'
};