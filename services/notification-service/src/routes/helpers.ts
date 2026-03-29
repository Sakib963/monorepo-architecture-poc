export function actionError(code: string, message: string, traceId: string) {
  return { ok: false, code, message, traceId };
}
