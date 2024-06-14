const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rol-al')
    .setDescription('Bir üyeden rol alır.')
    .addUserOption(option =>
      option.setName('üye')
        .setDescription('Rolü alınacak üyeyi seçin.')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('rol')
        .setDescription('Alınacak rolü seçin.')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({ content: 'Bu komutu kullanmak için `Rolleri Yönet` yetkisine sahip olmalısınız.', ephemeral: true });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({ content: 'Botun `Rolleri Yönet` yetkisine sahip olması gerekir.', ephemeral: true });
    }

    const targetMember = interaction.options.getMember('üye', true);
    const role = interaction.options.getRole('rol', true);

    if (!targetMember) {
      return interaction.reply({ content: 'Lütfen bir üye seçin.', ephemeral: true });
    }
    if (!role) {
      return interaction.reply({ content: 'Lütfen bir rol seçin.', ephemeral: true });
    }

    if (!targetMember.roles.cache.has(role.id)) {
      return interaction.reply({ content: `${targetMember.user.tag} kullanıcısında zaten **${role.name}** rolü yok!`, ephemeral: true });
    }

    if (interaction.guild.members.me.roles.highest.comparePositionTo(role) <= 0) {
      return interaction.reply({ content: 'Bu rolü almak için yeterli yetkiye sahip değilim. Lütfen bot rolünün, alınacak rolden daha yüksek olduğundan emin olun.', ephemeral: true });
    }

    try {
      await targetMember.roles.remove(role.id);
      const embed = new EmbedBuilder()
        .setTitle('Rol Alındı!')
        .setColor('#ff0000')
        .setDescription(`${targetMember.user.tag} kullanıcısından **${role.name}** rolü başarıyla alındı!`)
        .setFooter({
          text: `Bu komutu kullanan: ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Rol alınırken hata oluştu:', error);
      interaction.reply({ content: 'Rol alınırken bir hata oluştu. Lütfen tekrar deneyin veya yetkilerinizin doğru olduğundan emin olun.', ephemeral: true });
    }
  },
};

exports.conf = {
  aliases: ['rolal', 'rol-kaldır'],
  permLevel: 1,
  kategori: 'Moderasyon'
};

exports.help = {
  name: 'rol-al',
  description: 'Belirtilen üyeden rol alır.',
  usage: '/rol-al @üye [rol]'
};