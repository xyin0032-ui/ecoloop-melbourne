export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      })
    }

    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Only POST requests are allowed.',
        }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      )
    }

    try {
      const body = await request.json()

      const {
        to,
        subject,
        message,
        attachmentName,
        attachmentContent,
      } = body

      if (
        !to ||
        !subject ||
        !message ||
        !attachmentName ||
        !attachmentContent
      ) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Please complete all fields.',
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          },
        )
      }

      const resendResponse = await fetch(
        'https://api.resend.com/emails',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'onboarding@resend.dev',
            to: [to],
            subject,
            text: message,
            attachments: [
              {
                filename: attachmentName,
                content: attachmentContent,
              },
            ],
          }),
        },
      )

      const data = await resendResponse.json()

      if (!resendResponse.ok) {
        return new Response(
          JSON.stringify({
            success: false,
            message:
              data.message ||
              'Unable to send email.',
          }),
          {
            status: resendResponse.status,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          },
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Email sent successfully.',
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      )
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Unable to send email.',
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      )
    }
  },
}