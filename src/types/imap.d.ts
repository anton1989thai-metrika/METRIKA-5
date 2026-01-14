import 'imap'

declare module 'imap' {
  interface Config {
    socketTimeout?: number
  }
}
