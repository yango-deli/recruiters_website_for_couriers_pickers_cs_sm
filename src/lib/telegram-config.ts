function trimEnv(value: string | undefined): string {
  return value?.trim() ?? "";
}

export function isTelegramConfigured(): boolean {
  return Boolean(trimEnv(process.env.TELEGRAM_BOT_TOKEN) && trimEnv(process.env.TELEGRAM_CHAT_ID));
}
