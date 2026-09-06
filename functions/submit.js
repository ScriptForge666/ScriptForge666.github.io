export async function onRequestPost(context) {
  try {
    // 1. 解析前端提交的数据
    const body = await context.request.json();
    const { name, contact, subject, message } = body;

    // 2. 校验必填字段
    if (!name || !contact || !message) {
      return new Response(
        JSON.stringify({ success: false, error: '请填写必要信息' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. 从环境变量获取 Resend API Key
    const apiKey = context.env.RESEND_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: '未配置邮件服务密钥' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. 调用 Resend API 发送邮件到你的 Outlook 邮箱
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ScriptForge Contact <onboarding@resend.dev>', // Resend 提供的默认发件域名
        to: ['scriptforge@outlook.com'],                    // 接收通知的 Outlook 邮箱
        subject: `[网站留言] ${subject || '来自个人主页的新消息'}`,
        html: `
          <h2>收到来自个人主页的新留言</h2>
          <p><strong>发件人：</strong> ${name}</p>
          <p><strong>联系方式：</strong> ${contact}</p>
          <p><strong>主题：</strong> ${subject || '无'}</p>
          <hr />
          <p><strong>留言内容：</strong></p>
          <p style="white-space: pre-wrap; background: #f4f4f4; padding: 12px; border-radius: 6px;">${message}</p>
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
            'Access-Control-Allow-Origin': '*',
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
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// 支持跨域 OPTIONS 预检请求
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}