const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rol-ver')
    .setDescription('Bir üyeye rol verir.')
    .addUserOption(option =>
      option.setName('üye')
        .setDescription('Rolü verilecek üyeyi seçin.')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('rol')
        .setDescription('Verilecek rolü seçin.')
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

    if (targetMember.roles.cache.has(role.id)) {
      return interaction.reply({ content: `${targetMember.user.tag} kullanıcısında zaten **${role.name}** rolü var!`, ephemeral: true });
    }

    if (interaction.guild.members.me.roles.highest.comparePositionTo(role) <= 0) {
      return interaction.reply({ content: 'Bu rolü vermek için yeterli yetkiye sahip değilim. Lütfen bot rolünün, verilecek rolden daha yüksek olduğundan emin olun.', ephemeral: true });
    }

    try {
      await targetMember.roles.add(role.id);
      const embed = new EmbedBuilder()
        .setTitle('Rol Verildi!')
        .setColor('#00ff00')
        .setDescription(`${targetMember.user.tag} kullanıcısına **${role.name}** rolü başarıyla verildi!`)
        .setFooter({
          text: `Bu komutu kullanan: ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Rol verilirken hata oluştu:', error);
      interaction.reply({ content: 'Rol verilirken bir hata oluştu. Lütfen tekrar deneyin veya yetkilerinizin doğru olduğundan emin olun.', ephemeral: true });
    }
  },
};

exports.conf = {
  aliases: ['rolver', 'rol-at'],
  permLevel: 1,
  kategori: 'Moderasyon'
};

exports.help = {
  name: 'rol-ver',
  description: 'Belirtilen üyeye rol verir.',
  usage: '/rol-ver @üye [rol]'
};