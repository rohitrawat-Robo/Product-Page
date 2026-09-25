import transporter from "../config/mailer.js";
import bcrypt from "bcryptjs";
import { User, Organization } from "../models/index.js";

const otpStore = new Map();

const OTP_EXPIRY = 5 * 60 * 1000;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      organizationName,
      loginUrl,
      email,
      password,
    } = req.body;

    // --------------------------------------------------
    // 1. Required field validation
    // --------------------------------------------------

    if (
      !firstName ||
      !organizationName ||
      !loginUrl ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "First name, organization name, login URL, email and password are required.",
      });
    }

    // --------------------------------------------------
    // 2. Normalize values
    // --------------------------------------------------

    const normalizedEmail = email.trim().toLowerCase();

    const normalizedOrganizationName =
      organizationName.trim();

    const normalizedLoginUrl = loginUrl
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // --------------------------------------------------
    // 3. Validate login URL
    // --------------------------------------------------

    if (!normalizedLoginUrl) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid organization URL name.",
      });
    }

    // --------------------------------------------------
    // 4. Validate URL length
    // --------------------------------------------------

    if (normalizedLoginUrl.length < 3) {
      return res.status(400).json({
        success: false,
        message:
          "Organization URL name must contain at least 3 characters.",
      });
    }

    // --------------------------------------------------
    // 5. Check whether email already exists
    // --------------------------------------------------

    const existingUser = await User.findOne({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // --------------------------------------------------
    // 6. Check organization name
    // --------------------------------------------------

    const existingOrganizationName =
      await Organization.findOne({
        where: {
          name: normalizedOrganizationName,
        },
      });

    if (existingOrganizationName) {
      return res.status(409).json({
        success: false,
        message:
          "An organization with this name already exists.",
      });
    }

    // --------------------------------------------------
    // 7. Check organization URL
    // --------------------------------------------------

    const existingOrganizationUrl =
      await Organization.findOne({
        where: {
          slug: normalizedLoginUrl,
        },
      });

    if (existingOrganizationUrl) {
      return res.status(409).json({
        success: false,
        message:
          "This organization URL is already in use. Please choose another one.",
      });
    }

    // --------------------------------------------------
    // 8. Prevent URL from matching email ID
    // --------------------------------------------------

    const emailUsername = normalizedEmail.split("@")[0];

    if (normalizedLoginUrl === emailUsername) {
      return res.status(409).json({
        success: false,
        message:
          "Organization URL cannot be the same as your email ID.",
      });
    }

    // --------------------------------------------------
    // 9. Hash password
    // --------------------------------------------------

    const passwordHash = await bcrypt.hash(password, 12);

    // --------------------------------------------------
    // 10. Create organization
    // --------------------------------------------------

    const organization = await Organization.create({
      name: normalizedOrganizationName,
      slug: normalizedLoginUrl,
      status: "trial",
      isActive: true,
      isDeleted: false,
    });

    // --------------------------------------------------
    // 11. Create user
    // --------------------------------------------------

    const user = await User.create({
      organizationId: organization.id,

      firstName: firstName.trim(),

      lastName:
        lastName?.trim() || null,

      phone:
        phone?.trim() || null,

      email: normalizedEmail,

      passwordHash,

      role: "user",

      status: "active",

      isActive: true,

      isDeleted: false,
    });

    // --------------------------------------------------
    // 12. Response
    // --------------------------------------------------

    return res.status(201).json({
      success: true,
      message:
        "Organization and user registered successfully.",

      data: {
        userId: user.id,

        organizationId: organization.id,

        organizationName: organization.name,

        loginUrl: organization.slug,

        firstName: user.firstName,

        lastName: user.lastName,

        email: user.email,
      },
    });
  } catch (error) {
    console.error("REGISTER USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to register organization and user.",
      error: error.message,
    });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const otp = generateOTP();

    otpStore.set(normalizedEmail, {
      otp,
      expiresAt: Date.now() + OTP_EXPIRY,
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: normalizedEmail,

      subject: "Global Infoventures Pvt. Ltd. - Verify Your Email",

      text: `
Welcome to Global Infoventures Pvt. Ltd..

Your email verification code is: ${otp}

This OTP is valid for 5 minutes.

Please do not share this OTP with anyone.

If you did not request this verification code, you can safely ignore this email.

Regards,
Global Infoventures Pvt. Ltd. Team
Global Infoventures Pvt. Ltd.
      `,

      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Global Infoventures Pvt. Ltd. Email Verification</title>
          </head>

          <body style="
            margin:0;
            padding:0;
            background:#f4f7fb;
            font-family:Arial, Helvetica, sans-serif;
            color:#1f2937;
          ">

            <div style="
              width:100%;
              padding:40px 0;
              background:#f4f7fb;
            ">

              <div style="
                max-width:600px;
                margin:0 auto;
                background:#ffffff;
                border-radius:16px;
                overflow:hidden;
                border:1px solid #e5e7eb;
                box-shadow:0 8px 30px rgba(0,0,0,0.06);
              ">

                <!-- Header -->
                <div style="
                  padding:28px 32px;
                  background:#111827;
                  text-align:center;
                ">

                  <div style="
                    font-size:28px;
                    font-weight:700;
                    color:#ffffff;
                    letter-spacing:-0.5px;
                  ">
                    Global Infoventures Pvt. Ltd.
                  </div>

                  <div style="
                    margin-top:6px;
                    font-size:12px;
                    color:#9ca3af;
                    letter-spacing:1.5px;
                    text-transform:uppercase;
                  ">
                    Technology & Beyond
                  </div>

                </div>

                <!-- Content -->
                <div style="
                  padding:40px 32px;
                ">

                  <h2 style="
                    margin:0 0 14px;
                    color:#111827;
                    font-size:24px;
                    font-weight:700;
                  ">
                    Verify your email
                  </h2>

                  <p style="
                    margin:0;
                    color:#6b7280;
                    font-size:15px;
                    line-height:1.7;
                  ">
                    Welcome to Global Infoventures Pvt. Ltd.. Use the verification code below
                    to verify your email address and continue setting up
                    your account.
                  </p>

                  <!-- OTP Box -->
                  <div style="
                    margin:32px 0;
                    padding:26px 20px;
                    text-align:center;
                    background:#f8fafc;
                    border:1px solid #e2e8f0;
                    border-radius:12px;
                  ">

                    <div style="
                      margin-bottom:12px;
                      color:#64748b;
                      font-size:11px;
                      font-weight:700;
                      letter-spacing:2px;
                      text-transform:uppercase;
                    ">
                      Verification Code
                    </div>

                    <div style="
                      font-size:36px;
                      font-weight:700;
                      letter-spacing:8px;
                      color:#111827;
                    ">
                      ${otp}
                    </div>

                  </div>

                  <p style="
                    margin:0 0 10px;
                    color:#6b7280;
                    font-size:13px;
                    line-height:1.6;
                  ">
                    This verification code is valid for
                    <strong style="color:#374151;">
                      5 minutes
                    </strong>.
                  </p>

                  <p style="
                    margin:0;
                    color:#6b7280;
                    font-size:13px;
                    line-height:1.6;
                  ">
                    For your security, please do not share this code
                    with anyone.
                  </p>

                  <!-- Divider -->
                  <div style="
                    height:1px;
                    background:#e5e7eb;
                    margin:32px 0 24px;
                  "></div>

                  <p style="
                    margin:0;
                    color:#9ca3af;
                    font-size:12px;
                    line-height:1.6;
                  ">
                    If you did not request this verification code,
                    you can safely ignore this email.
                  </p>

                </div>

                <!-- Footer -->
                <div style="
                  padding:22px 32px;
                  background:#f8fafc;
                  border-top:1px solid #e5e7eb;
                  text-align:center;
                ">

                  <p style="
                    margin:0 0 6px;
                    color:#374151;
                    font-size:12px;
                    font-weight:600;
                  ">
                    Global Infoventures Pvt. Ltd.
                  </p>

                  <p style="
                    margin:0;
                    color:#9ca3af;
                    font-size:11px;
                  ">
                    Global Infoventures Pvt. Ltd.
                  </p>

                  <p style="
                    margin:8px 0 0;
                    color:#9ca3af;
                    font-size:11px;
                  ">
                    Technology & Beyond
                  </p>

                </div>

              </div>

            </div>

          </body>
        </html>
      `,
    });

    console.log(`OTP sent to ${normalizedEmail}`);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP.",
    });
  }
};
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const record = otpStore.get(normalizedEmail);

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired.",
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(normalizedEmail);

      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    if (record.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    otpStore.delete(normalizedEmail);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP.",
    });
  }
};
