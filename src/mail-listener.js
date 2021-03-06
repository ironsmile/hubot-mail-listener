'use strict';

const _ = require('lodash');
const MailListener = require('mail-listener2');
const moment = require('moment');
const showdown = require('showdown');
const jsdom = require('jsdom');

const config = {
  rooms: (process.env.HUBOT_MAIL_LISTENER_NG_ROOMS || '').split(','),
  username: process.env.HUBOT_MAIL_LISTENER_NG_USERNAME,
  password: process.env.HUBOT_MAIL_LISTENER_NG_PASSWORD,
  host: process.env.HUBOT_MAIL_LISTENER_NG_HOST,
  port: process.env.HUBOT_MAIL_LISTENER_NG_PORT || 993,
  tls: _.get(process.env, 'HUBOT_MAIL_LISTENER_NG_SECURE', true),
  tlsOptions: { rejectUnauthorized: false },
  mailbox: process.env.HUBOT_MAIL_LISTENER_NG_MAILBOX || 'INBOX',
  searchFilter: (process.env.HUBOT_MAIL_LISTENER_NG_SEARCH_FILTER || '').split(','),
  trustedEmails: (process.env.HUBOT_MAIL_LISTENER_NG_TRUSTED_EMAILS || '').split(','),
  markSeen: _.get(process.env, 'HUBOT_MAIL_LISTENER_NG_MARK_SEEN', true),
  fetchUnreadOnStart: process.env.HUBOT_MAIL_LISTENER_NG_FETCH_UNREAD
};

module.exports = (robot) => {
  if (config.rooms[0].length <= 0) {
    robot.logger.error('Please set the HUBOT_MAIL_LISTENER_NG_ROOMS environment variable.');
    return null;
  }

  if (!config.username) {
    robot.logger.error('Please set the HUBOT_MAIL_LISTENER_NG_USERNAME environment variable.');
    return null;
  }

  if (!config.password) {
    robot.logger.error('Please set the HUBOT_MAIL_LISTENER_NG_PASSWORD environment variable.');
    return null;
  }

  if (!config.host) {
    robot.logger.error('Please set the HUBOT_MAIL_LISTENER_NG_HOST environment variable.');
    return null;
  }

  if (!config.fetchUnread) {
    config.fetchUnreadOnStart = true;
  }

  if (config.searchFilter[0].length <= 0) {
    config.searchFilter = [ 'UNSEEN' ];
  }

  const mailListener = new MailListener(config);
  mailListener.start();

  mailListener.on('server:connected', () =>
    robot.logger.info(`hubot-mail-listener-ng connected as ${config.username} to ${config.host}:${config.port}`));

  mailListener.on('error', (err) => robot.logger.error('hubot-mail-listener-ng error', err));

  return mailListener.on('mail', (mail) => {
    const from = [];
    let trusted = false;
    for (const sender of Array.from(mail.from)) {
      from.push(`${sender.name} <${sender.address}>`);
      if (config.trustedEmails.indexOf(sender.address) !== -1) {
        trusted = true;
      }
    }
    let text = '';
    if (trusted) {
      text = `---
${mail.text}`;
    } else {
      text = `
\`\`\`
${mail.text}
\`\`\``;
      if (!mail.text && mail.html) {
        const converter = new showdown.Converter();
        const dom = new jsdom.JSDOM();
        text = `---
${converter.makeMarkdown(mail.html, dom.window.document)}`;
      }
    }
    const date = moment(mail.date);

    const message = `New email:
> _Subject:_ ${mail.subject}
> _Author:_ ✉️ ${from.join(',')}
> _Date:_ ${date.format('LLLL')}

${text}
`;

    robot.logger.info(`Publishing email with subject '${mail.subject}' to chat rooms`);

    return Array.from(config.rooms).map((room) =>
      robot.messageRoom(room, message));
  });
};
