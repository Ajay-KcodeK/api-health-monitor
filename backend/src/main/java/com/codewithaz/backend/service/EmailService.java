package com.codewithaz.backend.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    // @Async = runs in background thread
    // Email sending should never block the scheduler thread
    @Async
    public void sendDownAlert(String toEmail, String endpointName,
                              String url, Long responseTime) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            // true = multipart message (supports HTML)
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("🚨 API DOWN: " + endpointName);
            helper.setText(buildDownAlertHtml(endpointName, url, responseTime), true);
            // second param true = isHtml

            mailSender.send(message);
            log.info("DOWN alert email sent to {} for endpoint {}", toEmail, endpointName);

        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendRecoveryAlert(String toEmail, String endpointName,
                                  String url, Long responseTime) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("✅ API Recovered: " + endpointName);
            helper.setText(buildRecoveryAlertHtml(endpointName, url, responseTime), true);

            mailSender.send(message);
            log.info("Recovery alert email sent to {} for endpoint {}", toEmail, endpointName);

        } catch (Exception e) {
            log.error("Failed to send recovery email: {}", e.getMessage());
        }
    }

    // HTML email template for DOWN alert
    private String buildDownAlertHtml(String name, String url, Long responseTime) {
        name = name.replace("%", "%%");
        url = url.replace("%", "%%");
        String time = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm:ss"));

        return """
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
                  <div style="max-width:600px; margin:0 auto; background:white;
                              border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                
                    <!-- Header -->
                    <div style="background:#ef4444; padding:30px; text-align:center;">
                      <h1 style="color:white; margin:0; font-size:28px;">🚨 API is DOWN</h1>
                    </div>
                
                    <!-- Body -->
                    <div style="padding:30px;">
                      <p style="color:#374151; font-size:16px; margin-top:0;">
                        Your monitored API has stopped responding.
                      </p>
                
                      <!-- Details table -->
                      <table style="width:100%%; border-collapse:collapse; margin:20px 0;">
                        <tr style="background:#fef2f2;">
                          <td style="padding:12px 16px; color:#6b7280; font-size:14px; width:40%%;">
                            Endpoint Name
                          </td>
                          <td style="padding:12px 16px; color:#111827; font-weight:bold; font-size:14px;">
                            %s
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:12px 16px; color:#6b7280; font-size:14px;">URL</td>
                          <td style="padding:12px 16px; font-size:14px;">
                            <a href="%s" style="color:#3b82f6;">%s</a>
                          </td>
                        </tr>
                        <tr style="background:#fef2f2;">
                          <td style="padding:12px 16px; color:#6b7280; font-size:14px;">
                            Response Time
                          </td>
                          <td style="padding:12px 16px; color:#111827; font-size:14px;">
                            %s ms
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:12px 16px; color:#6b7280; font-size:14px;">
                            Detected At
                          </td>
                          <td style="padding:12px 16px; color:#111827; font-size:14px;">
                            %s
                          </td>
                        </tr>
                      </table>
                
                      <p style="color:#6b7280; font-size:13px; margin-top:24px;">
                        You will receive another email when the API recovers.
                      </p>
                    </div>
                
                    <!-- Footer -->
                    <div style="background:#f9fafb; padding:16px 30px; text-align:center;">
                      <p style="color:#9ca3af; font-size:12px; margin:0;">
                        API Health Monitor — Automated Alert
                      </p>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(name, url, url, responseTime, time);
    }

    // HTML email template for recovery alert
    private String buildRecoveryAlertHtml(String name, String url, Long responseTime) {
        name = name.replace("%", "%%");
        url = url.replace("%", "%%");
        String time = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm:ss"));

        return """
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
                  <div style="max-width:600px; margin:0 auto; background:white;
                              border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                
                    <!-- Header -->
                    <div style="background:#22c55e; padding:30px; text-align:center;">
                      <h1 style="color:white; margin:0; font-size:28px;">✅ API Recovered</h1>
                    </div>
                
                    <!-- Body -->
                    <div style="padding:30px;">
                      <p style="color:#374151; font-size:16px; margin-top:0;">
                        Great news! Your API is back online and responding normally.
                      </p>
                
                      <table style="width:100%%; border-collapse:collapse; margin:20px 0;">
                        <tr style="background:#f0fdf4;">
                          <td style="padding:12px 16px; color:#6b7280; font-size:14px; width:40%%;">
                            Endpoint Name
                          </td>
                          <td style="padding:12px 16px; color:#111827; font-weight:bold; font-size:14px;">
                            %s
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:12px 16px; color:#6b7280; font-size:14px;">URL</td>
                          <td style="padding:12px 16px; font-size:14px;">
                            <a href="%s" style="color:#3b82f6;">%s</a>
                          </td>
                        </tr>
                        <tr style="background:#f0fdf4;">
                          <td style="padding:12px 16px; color:#6b7280; font-size:14px;">
                            Response Time
                          </td>
                          <td style="padding:12px 16px; color:#22c55e; font-weight:bold; font-size:14px;">
                            %s ms
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:12px 16px; color:#6b7280; font-size:14px;">
                            Recovered At
                          </td>
                          <td style="padding:12px 16px; color:#111827; font-size:14px;">
                            %s
                          </td>
                        </tr>
                      </table>
                    </div>
                
                    <div style="background:#f9fafb; padding:16px 30px; text-align:center;">
                      <p style="color:#9ca3af; font-size:12px; margin:0;">
                        API Health Monitor — Automated Alert
                      </p>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(name, url, url, responseTime, time);
    }
}