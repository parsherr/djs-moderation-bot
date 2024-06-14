const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yavaş-mod')
    .setDescription('Belirli bir kanalda yavaş mod süresini ayarlar.')
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Yavaş mod süresini ayarlamak istediğiniz kanalı seçin.')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('süre')
        .setDescription('Yavaş mod süresi (saniye cinsinden). 0 ile 21600 arasında bir değer olmalıdır.')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: 'Bu komutu kullanmak için `Kanalları Yönet` yetkisine sahip olmalısınız.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('kanal', true);
    const slowmodeDuration = interaction.options.getInteger('süre', true);

    if (slowmodeDuration < 0 || slowmodeDuration > 21600) {
      return interaction.reply({ content: 'Yavaş mod süresi 0 ile 21600 saniye arasında olmalıdır.', ephemeral: true });
    }

    try {
      await channel.setRateLimitPerUser(slowmodeDuration);
      const embed = new EmbedBuilder()
        .setTitle('Yavaş Mod Ayarlandı!')
        .setColor('#00ff00')
        .setDescription(`${channel.name} kanalında yavaş mod süresi başarıyla **${slowmodeDuration}** saniye olarak ayarlandı.`)
        .setFooter({
          text: `Bu komutu kullanan: ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Yavaş mod ayarlanırken hata oluştu:', error);
      interaction.reply({ content: 'Yavaş mod ayarlanırken bir hata oluştu. Lütfen tekrar deneyin veya yetkilerinizin doğru olduğundan emin olun.', ephemeral: true });
    }
  },
};

exports.conf = {
  aliases: ['yavaşmod', 'slowmode'],
  permLevel: 1,
  kategori: 'Moderasyon'
};

exports.help = {
  name: 'yavaş-mod',
  description: 'Belirli bir kanalda yavaş mod süresini ayarlar.',
  usage: '/yavaş-mod <kanal> <süre>'
};