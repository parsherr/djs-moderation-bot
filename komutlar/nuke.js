const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nuke')
    .setDescription('Belirtilen kanaldaki tüm mesajları siler.')
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Nuke işlemi yapılacak kanalı seçin.')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({ content: 'Bu komutu kullanmak için `Mesajları Yönet` yetkisine sahip olmalısınız.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('kanal', true);

    if (!channel.isText()) {
      return interaction.reply({ content: 'Bu komut sadece metin kanalları için kullanılabilir.', ephemeral: true });
    }

    try {
      let fetched;
      do {
        fetched = await channel.messages.fetch({ limit: 100 });
        await channel.bulkDelete(fetched);
      } while (fetched.size >= 2);

      const embed = new EmbedBuilder()
        .setTitle('Kanal Nuke Edildi!')
        .setDescription(`Bu kanal başarıyla nuke edildi! 💥`)
        .setColor('#2F3136')
        .setFooter({
          text: `Komutu kullanan: ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        });

      await channel.send({ embeds: [embed] });
      await interaction.reply({ content: 'Kanal başarıyla nuke edildi!', ephemeral: true });
    } catch (error) {
      console.error('Mesajlar silinirken hata oluştu:', error);
      interaction.reply({ content: 'Mesajlar silinirken bir hata oluştu. Lütfen tekrar deneyin veya yetkilerinizin doğru olduğundan emin olun.', ephemeral: true });
    }
  },
};

exports.conf = {
  aliases: ['nuke', 'kanal-temizle'],
  permLevel: 3,
  kategori: 'Moderasyon'
};

exports.help = {
  name: 'nuke',
  description: 'Belirtilen kanaldaki tüm mesajları siler.',
  usage: '/nuke <kanal>'
};