# hubot-mail-listener-ng

hubot-mail-listener adds an **IMAP** listener plugin to hubot that reports
unread or incoming new emails (sender, subject, date, text message).

## Why Fork?

This version is a fork of [hubot-mail-listener](https://github.com/gangstead/hubot-mail-listener)
which is posting emails a Slack attachments. But not everyone uses Slack. For this reason this fork
uses plain markdown-formatted messages.

## Installation

Edit the `package.json` for your hubot and add the hubot-mail-listener
dependency.

```javascript
"dependencies": {
  "hubot-mail-listener-ng": ">= 1.2.0",
  ...
}
```

## Configuration

The following variables are required to let the script work:

* `HUBOT_MAIL_LISTENER_NG_ROOMS`, comma separated list of rooms where incoming emails should be posted
* `HUBOT_MAIL_LISTENER_NG_USERNAME`, username
* `HUBOT_MAIL_LISTENER_NG_PASSWORD`, password
* `HUBOT_MAIL_LISTENER_NG_HOST`, mail host

The following variables are optional:

* `HUBOT_MAIL_LISTENER_NG_PORT`, mail host port, default to `993`
* `HUBOT_MAIL_LISTENER_NG_SECURE`, whether to use secure connection, default to `true`
* `HUBOT_MAIL_LISTENER_NG_MAILBOX`, mail box to monitor, default to `INBOX`
* `HUBOT_MAIL_LISTENER_NG_MARK_SEEN`, whether to mark seen email as read, default to `true`
* `HUBOT_MAIL_LISTENER_NG_FETCH_UNREAD`, whether to fetch unread emails on start, default to `true`

## See Also

This work is an updated and coffeescript free version of: https://github.com/matteoagosti/hubot-mail-notifier
