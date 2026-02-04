const Referrals = require("../../models/addingReferralModels");
const model_One = require("../../models/schedule");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const model_ratings = require("../../models/ratingsModel");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
async function scheduleOne(req, res) {
  console.log(req.body, "schedule one");

  const signaturesPath = path.join(__dirname, "../../mailSignatures.json");
  const allSignatures = JSON.parse(fs.readFileSync(signaturesPath, "utf-8"));

  try {
    const { scheduleDate, totalCandidates, mailSent, sentBy } = req.body;

    const mail_data = {
      mailSent,
      Total_Referral_id: totalCandidates,
      roundDate: scheduleDate,
      sentBy: sentBy,
    };

    const saveOne = new model_One(mail_data);
    const passInterviewDate = Referrals;

    const sch_one = await saveOne.save();

    const candidateIds = totalCandidates.split(",").map((id) => id.trim());

    if (!candidateIds.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({
        error: "Invalid candidate ID(s) in the request",
        message:
          "One or more of the provided candidate IDs are invalid ObjectId values.",
      });
    }

    const objectIds = candidateIds.map((id) => new mongoose.Types.ObjectId(id));

    const candidates = await Referrals.find({ _id: { $in: objectIds } }).select(
      "referral_email status referral_fname referral_lname role_applied"
    );

    if (candidates.length === 0) {
      return res.status(404).json({
        error: "No candidates found",
        message:
          "No candidates matching the provided IDs were found in the database.",
      });
    }

    const userMail = req.body.userMail?.trim().toLowerCase();
    const senderCredentials = {
      "chinmayee.s@qualesce.com": process.env["SENDER_PASSWORD"],
      "thulasi.v@qualesce.com": process.env["SENDER_PASSWORD_2"],
    };

    const senderPassword = senderCredentials[userMail];

    const candidateName = candidates.map((candidate) => ({
      email: candidate.referral_email,
      first: candidate.referral_fname,
      last: candidate.referral_lname,
      role: candidate.role_applied,
    }));

    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: userMail,
        pass: senderPassword,
      },
    });
    // console.log(process.env["SENDER_EMAIL"],"sender mail")
    const sendMail = async (transporter, emailConfig) => {
      try {
        const info = await transporter.sendMail(emailConfig);
        // console.log("Email sent:", info.messageId);
      } catch (error) {
        console.error("Error sending email:", error);
      }
    };

    function referralEmailTemplate(firstName, htmlBody, lastName) {
      return `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Referral Email</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
                .container { padding: 20px; max-width: fit-content; margin: auto; line-height:23px }
                p { font-size: 16px; color: #333; margin: 15px 0px; }
                .signature { font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <p>Dear ${firstName} ${lastName},</p>
                ${htmlBody}
            </div>
        </body>
        </html>`;
    }

    // Get user-specific signature from JSON
    const userSignature = allSignatures[userMail] || allSignatures["default"];
    const formattedScheduleDate = new Date(scheduleDate).toLocaleDateString(
      "en-GB",
      {
        weekday: "long", // e.g., Monday
        year: "numeric", // e.g., 2025
        month: "long", // e.g., June
        day: "numeric", // e.g., 29
      }
    );

    const feedbacks = await model_ratings
      .find({
        referralId: { $in: objectIds },
      })
      .select("referralId feedback");
    console.log(feedbacks, "feedback");

    const feedbackMap = {};
    feedbacks.forEach((entry) => {
      feedbackMap[entry.referralId.toString()] =
        entry.feedback ||
        "Due to the high number of applications we are, unfortunately, not able to provide individual feedback to your application at this early stage of the process";
    });

    for (let i = 0; i < candidateName.length; i++) {
      const candidate = candidateName[i];
      // console.log(roundDate);
      // console.log(formattedScheduleDate, "candidate role");
      const candidateId = objectIds[i].toString();
      const referralFeedback =
        feedbackMap[candidateId] ||
        "Due to the high number of applications we are, unfortunately, not able to provide individual feedback to your application at this early stage of the process";
      const originalHtmlBody = req.body.body;
      const htmlWithRole = originalHtmlBody
        .replace(/{{\s*role\s*}}/gi, candidate.role)
        .replace(/{{\s*date_day\s*}}/gi, formattedScheduleDate)
        .replace(/{{\s*feedback\s*}}/gi, referralFeedback);

      // --- Attachment logic ---
      const extractDataUrls = (html) => {
        const regex = /href="(data:([^;]+);base64,([^"]+))"/gi;
        let matches;
        const dataUrls = [];
        while ((matches = regex.exec(html)) !== null) {
          dataUrls.push({
            fullUrl: matches[1],
            mimeType: matches[2],
            base64: matches[3],
            startIndex: matches.index,
            length: matches[0].length,
          });
        }
        return dataUrls;
      };

      const createAttachmentsFromDataUrls = (dataUrls) => {
        return dataUrls.map((item, index) => {
          let extension = "";
          switch (item.mimeType) {
            case "application/pdf":
              extension = ".pdf";
              break;
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              extension = ".docx";
              break;
            case "application/msword":
              extension = ".doc";
              break;
            default:
              extension = "";
          }
          return {
            filename: `document_${index + 1}${extension}`,
            content: Buffer.from(item.base64, "base64"),
            contentType: item.mimeType,
          };
        });
      };

      const replaceDataUrlsWithFileNames = (html, dataUrls) => {
        let newHtml = html;
        for (let i = dataUrls.length - 1; i >= 0; i--) {
          const { fullUrl } = dataUrls[i];
          const ext =
            dataUrls[i].mimeType === "application/pdf"
              ? ".pdf"
              : dataUrls[i].mimeType ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              ? ".docx"
              : dataUrls[i].mimeType === "application/msword"
              ? ".doc"
              : "";
          const replacement = `href="document_${i + 1}${ext}"`;
          newHtml = newHtml.replace(`href="${fullUrl}"`, replacement);
        }
        return newHtml;
      };

      const dataUrls = extractDataUrls(htmlWithRole);
      const attachments = createAttachmentsFromDataUrls(dataUrls);
      const cleanedHtmlBody = replaceDataUrlsWithFileNames(
        htmlWithRole,
        dataUrls
      );

      const fullBodyWithSignature = cleanedHtmlBody + userSignature;

      const referralHtmlBody = referralEmailTemplate(
        candidate.first,
        fullBodyWithSignature,
        candidate.last
      );

      const emailConfig = {
        from: {
          name: "Referral from Qualesce!",
          address: userMail,
        },
        to: candidate.email,
        subject: req.body.subject,
        text: "Referral text",
        html: referralHtmlBody,
        attachments,
      };

      await sendMail(transporter, emailConfig);
    }

    const fetchStatus = await Referrals.findOne({ _id: { $in: objectIds } });
    console.log("Fetched document:", fetchStatus);

    if (fetchStatus.status === "Submitted") {
      await Referrals.updateMany(
        { _id: { $in: objectIds } },
        {
          $set: {
            mailStatus: "Sent",
            currentRound: "Group Discussion",
            status: "Group Discussion",
            roundDate: sch_one.roundDate,
            interviewResult: "Pending",
          },
        }
      );
    } else {
      if (fetchStatus.status === "Rejected") {
        await Referrals.updateMany(
          { _id: { $in: objectIds } },
          {
            $set: {
              mailStatus: "Sent",
              roundDate: sch_one.roundDate,
              interviewResult: "Rejected",
            },
          }
        );
      } else {
        await Referrals.updateMany(
          { _id: { $in: objectIds } },
          {
            $set: {
              mailStatus: "Sent",
              roundDate: sch_one.roundDate,
              interviewResult: "Pending",
            },
          }
        );
      }
      // await Referrals.updateMany(
      //   { _id: { $in: objectIds } },
      //   {
      //     $set: {
      //       mailStatus: "Sent",
      //       roundDate: sch_one.roundDate,
      //       interviewResult: "Rejected",
      //     },
      //   }
      // );
    }

    return res.status(201).json({
      message: "Schedule created successfully",
      data: sch_one,
    });
  } catch (error) {
    console.log("Error in Schedule Mail in controllers", error.name);
    console.log(error.message);
    return res.status(500).json({
      error: "An error occurred while saving the schedule",
      message: error.message,
    });
  }
}

async function getAllSchedulesMailList(req, res) {
  try {
    const mailedReferrals = await model_One.find();

    res.status(200).json(mailedReferrals);
  } catch (error) {
    console.error("Error updating referral counts:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { scheduleOne, getAllSchedulesMailList };
