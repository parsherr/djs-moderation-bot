const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yardım')
    .setDescription('Botun mevcut tüm komutlarını ve açıklamalarını gösterir.'),

  async execute(interaction) {
    const commands = [
      { name: 'afk', description: 'AFK moduna geçer.' },
      { name: 'avatar', description: 'Kullanıcının avatarını gösterir.' },
      { name: 'ban', description: 'Belirtilen kullanıcıyı sunucudan yasaklar.' },
      { name: 'banner', description: 'Kullanıcının bannerını gösterir.' },
      { name: 'clear', description: 'Belirtilen sayıda mesajı siler.' },
      { name: 'kick', description: 'Belirtilen kullanıcıyı sunucudan atar.' },
      { name: 'kilit-ac', description: 'Kilitli kanalı açar.' },
      { name: 'kilitle', description: 'Belirtilen kanalı kilitler.' },
      { name: 'kullanıcı-bilgi', description: 'Belirtilen kullanıcının bilgilerini gösterir.' },
      { name: 'küfürengel', description: 'Küfür engelleme sistemini açar veya kapatır.' },
      { name: 'modlog-kapat', description: 'Modlog kanalını kapatır.' },
      { name: 'modlog', description: 'Modlog kanalını ayarlar.' },
      { name: 'nuke', description: 'Belirtilen kanaldaki tüm mesajları siler.' },
      { name: 'oto-rol', description: 'Sunucuya yeni katılan üyelere otomatik rol verir.' },
      { name: 'ping', description: 'Botun gecikme süresini gösterir.' },
      { name: 'reklam-engel', description: 'Reklam engelleme sistemini açar veya kapatır.' },
      { name: 'rol-al', description: 'Belirtilen üyeden rol alır.' },
      { name: 'rol-ver', description: 'Belirtilen üyeye rol verir.' },
      { name: 'sunucu-bilgi', description: 'Sunucu hakkında detaylı bilgi verir.' },
      { name: 'mute', description: 'Belirtilen kullanıcıyı belirli bir süre boyunca susturur.' },
      { name: 'unban', description: 'Belirtilen kullanıcının yasağını kaldırır.' },
      { name: 'unmute', description: 'Belirtilen kullanıcının susturmasını kaldırır.' },
      { name: 'yavaş-mod', description: 'Belirli bir kanalda yavaş mod süresini ayarlar.' },
    ];

    const embed = new EmbedBuilder()
      .setTitle('Yardım Menüsü')
      .setColor('#2F3136')
      .setDescription('Botun mevcut tüm komutları ve açıklamaları:')
      .setFooter({
        text: `Komutu kullanan: ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      });

    commands.forEach(cmd => {
      embed.addFields({ name: `/${cmd.name}`, value: cmd.description || 'Açıklama yok', inline: false });
    });

    await interaction.reply({ embeds: [embed], ephemeral: false });
  },
};

exports.conf = {
  aliases: ['yardim', 'help'],
  permLevel: 0,
  kategori: 'Genel'
};

exports.help = {
  name: 'yardım',
  description: 'Botun mevcut tüm komutlarını ve açıklamalarını gösterir.',
  usage: '/yardım'
};