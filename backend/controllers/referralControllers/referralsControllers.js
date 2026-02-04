const Referrals = require("../../models/addingReferralModels");
const referralUsers = require("../../models/referralUser");

async function addingReferrals(req, res) {
  const referral_email = req.body.referral_email; // declared early to use in catch

  try {
    const {
      referral_fname,
      referral_lname,
      role_applied,
      department,
      employment_type,
      referred_by,
    } = req.body;

    const referralData = {
      referral_fname,
      referral_lname,
      referral_email,
      role_applied,
      department,
      employment_type,
      referred_by,
    };

    if (req.file) {
      referralData.resume_file = {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        data: req.file.buffer,
        uploadedAt: new Date(),
      };
    }

    const newReferral = new Referrals(referralData);
    const savedReferral = await newReferral.save();

    const updatedSignupReferrals = await referralUsers.findOneAndUpdate(
      { userName: referred_by },
      { $inc: { referralCount: 1 } },
      { new: true }
    );

    if (!updatedSignupReferrals) {
      return res.status(404).json({
        error: "Referring user not found!",
      });
    }

    return res.status(201).json({
      message: "Referral added successfully",
      data: savedReferral,
    });
  } catch (error) {
    console.error("Error saving referral:", error);

    if (error.code === 11000) {
      try {
        const existing = await Referrals.findOne({ referral_email });

        if (existing) {
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          console.log(existing.createdAt, "check date");
          if (existing.createdAt < threeMonthsAgo) {
            // Remove the old one
            await Referrals.findOneAndDelete({ referral_email });

            // Try again with new data
            const {
              referral_fname,
              referral_lname,
              role_applied,
              department,
              employment_type,
              referred_by,
            } = req.body;

            const referralData = {
              referral_fname,
              referral_lname,
              referral_email,
              role_applied,
              department,
              employment_type,
              referred_by,
            };

            if (req.file) {
              referralData.resume_file = {
                filename: req.file.originalname,
                mimetype: req.file.mimetype,
                data: req.file.buffer,
                uploadedAt: new Date(),
              };
            }

            const newReferral = new Referrals(referralData);
            const savedReferral = await newReferral.save();

            const updatedSignupReferrals = await referralUsers.findOneAndUpdate(
              { userName: referred_by },
              { $inc: { referralCount: 1 } },
              { new: true }
            );

            return res.status(201).json({
              message: "Referral replaced after 3 months",
              data: savedReferral,
            });
          } else {
            return res.status(409).json({
              error:
                "Referral with this email already exists and is less than 3 months old.",
            });
          }
        }
      } catch (innerErr) {
        return res
          .status(500)
          .json({ error: "Unexpected error handling duplicate email." });
      }
    }

    return res.status(400).json({ error: error.message });
  }
}

async function getAllRefferals(req, res) {
  try {
    const referrals = await Referrals.find();

    // Group referrals by referred_by (username)
    const referralCounts = {};
    console.log("get all referrals", referralCounts);

    referrals.forEach((ref) => {
      const referrer = ref.referred_by;
      if (referrer) {
        referralCounts[referrer] = (referralCounts[referrer] || 0) + 1;
      }
    });

    // Update all users' referral counts
    const allUsers = await referralUsers.find();
    // console.log(allUsers);

    for (const user of allUsers) {
      const count = referralCounts[user.userName] || 0;
      // console.log("count", count);

      await referralUsers.updateOne(
        { _id: user._id },
        { $set: { referralCount: count } }
      );
    }

    res.status(200).json(referrals);
  } catch (error) {
    console.error("Error updating referral counts:", error);
    res.status(500).json({ error: error.message });
  }
}
// async function getIndividualLicenseDetails(req, res) {
//   try {
//     const { id } = req.params;
//     const licenseDetails = await License.findById(id);
//     if (!licenseDetails) {
//       return res.status(404).json({ message: "License not found" });
//     }

//    res.status(200).json(licenseDetails);
//   } catch (error) {
//     console.error("Error fetching license details:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// }

async function updateIndividualReferrals(req, res) {
  try {
    const { id } = req.params;
    // console.log(id);
    const updatedReferrals = await Referrals.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedReferrals) {
      return res.status(404).json({ message: "Referral not found" });
    }
    // console.log("update", updatedReferrals);

    res.status(200).json(updatedReferrals);
  } catch (error) {
    // console.log("update");
    console.error("Error updating Referral:", error);
    res.status(400).json({ error: error.message });
  }
}

async function updateReferrals(req, res) {
  // console.log(req.body, "update referrals stage");
  try {
    const { newStatus } = req.body;
    const result = await Referrals.updateMany(
      { stage: "New" }, // Find all referrals where stage is 'new'
      { $set: { stage: newStatus } } // Update stage to the provided newStatus ('old')
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({
        message: `${result.modifiedCount} referrals updated to '${newStatus}'`,
      });
    } else {
      res.status(404).json({ message: 'No referrals with stage "new" found.' });
    }
  } catch (error) {
    console.error("Error updating Referral stage:", error);
    res.status(400).json({ error: error.message });
  }
}

async function postResume(req, res) {
  // console.log("Fields:", req.body); // form fields
  // console.log("File:", req.file);   // uploaded file info

  if (!req.body) {
    return res.status(400).json({ error: "No data received" });
  }
  try {
    const { id } = req.params;

    if (req.file) {
      req.body.resume_file = {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        data: req.file.buffer, // directly assign buffer here
      };
      // console.log("req.body.resume_file", req.body.resume_file);
    }

    const updatedReferrals = await Referrals.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedReferrals) {
      return res.status(404).json({ message: "Referral not found" });
    }
    // console.log("updatereferrals", updatedReferrals);
    res.json({ message: "Referral updated Resume", data: updatedReferrals });
  } catch (error) {
    console.error("Error updating Referral:", error);
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  addingReferrals,
  getAllRefferals,
  updateIndividualReferrals,
  updateReferrals,
  postResume,
};
