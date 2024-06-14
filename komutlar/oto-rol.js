const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('oto-rol')
        .setDescription('Sunucuya yeni katılan üyelere otomatik rol verir.')
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('Otomatik olarak verilecek rolü seçin.')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: 'Bu komutu kullanmak için `Rolleri Yönet` yetkisine sahip olmalısınız.', ephemeral: true });
        }

        const role = interaction.options.getRole('rol');

        if (!role) {
            return interaction.reply({ content: 'Lütfen bir rol seçin.', ephemeral: true });
        }

        interaction.client.autoRole = role.id;

        const embed = new EmbedBuilder()
            .setTitle('Otomatik Rol Verildi!')
            .setColor('#00ff00')
            .setDescription(`Otomatik rol sisteminiz başarıyla ayarlandı. Yeni katılan üyelere **${role.name}** rolü verilecektir.`)
            .setFooter({
                text: `Bu komutu kullanan: ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            });

        await interaction.reply({ embeds: [embed] });
    },
};

exports.conf = {
    aliases: ['oto-rol-ver'],
    permLevel: 1,
    kategori: 'Moderasyon'
};

exports.help = {
    name: 'oto-rol',
    description: 'Sunucuya yeni katılan üyelere otomatik rol verir.',
    usage: '/oto-rol <rol>'
};