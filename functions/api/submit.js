function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const ALLOWED_ORIGINS = [
  "https://www.script-forge.top"
];

// 清洗origin：移除末尾斜杠
function normalizeOrigin(o) {
  if (!o) return null;
  return o.replace(/\/+$/, '');
}

function isOriginAllowed(rawOrigin) {
  const o = normalizeOrigin(rawOrigin);
  if (!o) return false;
  return ALLOWED_ORIGINS.includes(o);
}

export async function onRequestPost(context) {
  const rawOrigin = context.request.headers.get("Origin");
  const allowed = isOriginAllowed(rawOrigin);

  if (!allowed) {
    return new Response(
      JSON.stringify({ success: false, error: "来源不允许访问" }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': ''
        }
      }
    );
  }
  const allowOrigin = normalizeOrigin(rawOrigin);

  try {
    const body = await context.request.json();
    const { name, contact, subject, message, ip, country, region, city } = body;

    const emailRegex = /^[a-zA-Z0-9_%+-]+(\.[a-zA-Z0-9_%+-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    if(!contact || !emailRegex.test(contact)) {
      return new Response(
        JSON.stringify({ success: false, error: '请输入有效的邮箱地址' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': allowOrigin } }
      );
    }


    if (!name || !contact || !message) {
      return new Response(
        JSON.stringify({ success: false, error: '请填写必要信息' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': allowOrigin } }
      );
    }

    if(name.length>100 || contact.length>200 || (subject&&subject.length>150) || message.length>2000){
      return new Response(
        JSON.stringify({ success: false, error: '输入内容超出长度限制' }),
        { status:400, headers: { 'Content-Type':'application/json', 'Access-Control-Allow-Origin': allowOrigin } }
      );
    }

    const apiKey = context.env.RESEND_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: '未配置邮件服务密钥' }),
        { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': allowOrigin } }
      );
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ScriptForge Contact <onboarding@resend.dev>',
        to: ['scriptforge@outlook.com'],
        subject: `[网站留言] ${subject || '来自个人主页的新消息'}`,
        html: `
          <h2>收到来自个人主页的新留言</h2>
          <p><strong>发件人：</strong> ${escapeHtml(name)}</p>
          <p><strong>联系方式：</strong> ${escapeHtml(contact)}</p>
          <p><strong>主题：</strong> ${escapeHtml(subject) || '无'}</p>
          <p><strong>IP地址：</strong> ${escapeHtml(ip) || '无'}</p>
          <p><strong>地址：</strong> ${escapeHtml(`${country}, ${region}, ${city}`) || '无'}</p>
          <hr />
          <p><strong>留言内容：</strong></p>
          <p style="white-space: pre-wrap; background: #f4f4f4; padding: 12px; border-radius: 6px;">${escapeHtml(message)}</p>
        `,
      }),
    });

    if (resendResponse.ok) {
      return new Response(
        JSON.stringify({ success: true, message: '邮件已成功发送！' }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowOrigin,
          },
        }
      );
    } else {
      const errorData = await resendResponse.json();
      throw new Error(errorData.message || '邮件发送失败');
    }

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': allowOrigin } }
    );
  }
}

export async function onRequestOptions(context) {
  const rawOrigin = context.request.headers.get("Origin");
  const allowed = isOriginAllowed(rawOrigin);
  if (!allowed) {
    return new Response(null, { status: 204, headers: {} });
  }
  const allowOrigin = normalizeOrigin(rawOrigin);
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
