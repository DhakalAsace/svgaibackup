import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createErrorResponse } from '@/lib/error-handler'

export async function POST(request: NextRequest) {
  try {
    // Verify this is an internal request
    const headersList = await headers()
    const internalKey = process.env.INTERNAL_API_KEY
    const authHeader = headersList.get('authorization')
    
    // Only allow internal requests
    if (!internalKey || authHeader !== `Bearer ${internalKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { to, from, subject, html } = body

    if (!to || !from || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In production, integrate with your email service provider
    // Examples: SendGrid, AWS SES, Resend, etc.
    
    // For now, we'll just log the email (replace with actual implementation)
    if (process.env.NODE_ENV === 'production') {
      // Example with SendGrid:
      /*
      const sgMail = require('@sendgrid/mail')
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      
      const msg = {
        to,
        from,
        subject,
        html,
      }
      
      await sgMail.send(msg)
      */

      // Example with Resend:
      /*
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      await resend.emails.send({
        from,
        to,
        subject,
        html,
      })
      */

      console.log('Email alert would be sent in production:', {
        to,
        from,
        subject,
        preview: html.substring(0, 200) + '...'
      })
    } else {
      // Development: Log email details
      console.log('=== MONITORING EMAIL ALERT ===')
      console.log('To:', to)
      console.log('From:', from)
      console.log('Subject:', subject)
      console.log('Body preview:', html.substring(0, 500) + '...')
      console.log('==============================')
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully'
    })

  } catch (error) {
    const errorResponse = createErrorResponse(
      error,
      'Failed to send email',
      500
    )
    
    return NextResponse.json(errorResponse.response, { status: errorResponse.status })
  }
}