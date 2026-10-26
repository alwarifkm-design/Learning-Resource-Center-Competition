// تشفير بـ SHA-256 — يعمل في المتصفح بدون مكتبات خارجية
async function sha256(msg) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('')
}

export const hashPassword     = (p) => sha256(`iqra_salt_2024_${p}`)
export const hashSecurityCode = (c) => sha256(`security_${c}`)
