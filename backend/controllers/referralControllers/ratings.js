const Referrals = require("../../models/addingReferralModels");
const model_ratings = require("../../models/ratingsModel");
const mailData = require("../../mails.json");
const referralUsers = require("../../models/referralUser");

async function ratings(req, res) {
  console.log("Received rating request:", req.body);

  try {
    const {
      finalValue,
      isFeedback,
      referralId,
      status,
      userIdAccess,
      nextStageName,
      rejectedIn,
    } = req.body;

    // Step 1: Create the rating
    const rateOne = await model_ratings.create({
      finalRating: finalValue,
      feedback: isFeedback,
      referralId,
      prevStatus: status,
      ratedBy: userIdAccess,
      nextStatus: nextStageName,
      rejectedIn,
    });

    // Step 2: Determine candidate status
    const isRejected = rateOne.nextStatus === "Rejected";
    const statusData = isRejected ? rateOne.nextStatus : nextStageName;
    const currentRoundData = isRejected ? status : nextStageName;
    const interviewResultData = isRejected ? "Rejected" : "Pending";

    // Step 3: Determine interview status (logic can be expanded as needed)
    let interviewStatus = "Rejected"; // Default
    if (rateOne.finalRating > 6) {
      console.log("1st condition");
      if (rateOne.prevStatus === "Group Discussion") {
        interviewStatus = "Completed";
      } else if (rateOne.prevStatus === "Technical Assessment") {
        interviewStatus = "Completed"; // Add logic if different outcome is needed
      }
    }

    // Step 4: Update the referral's interview round data
    await Referrals.updateOne(
      {
        _id: referralId,
        "interviewRounds.round": rateOne.prevStatus,
      },
      {
        $set: {
          status: rateOne.nextStatus,
          currentRound: rateOne.nextStatus,
          interviewResult: interviewResultData,
          "interviewRounds.$.rating": rateOne.finalRating,
          "interviewRounds.$.status": interviewStatus,
        },
      }
    );

    // Step 5: Update rejected info if applicable
    if (nextStageName === "Rejected") {
      console.log("Are you coming here");
      await Referrals.findByIdAndUpdate(referralId, {
        rejectedIn: rejectedIn,
        currentRound: rejectedIn,
        interviewResult: "Rejected",
      });
    }

    // Step 6: Set mailStatus to "Not Sent" if final round is reached
    if (nextStageName === "HR Round" || nextStageName === "Selected") {
      ("are you coming here");
      await Referrals.updateOne(
        { _id: referralId },
        {
          $set: {
            mailStatus: "Not Sent",
            roundDate: null,
          },
        }
      );
    } else if (nextStageName === "Rejected" && status === "HR Round") {
      await Referrals.updateOne(
        { _id: referralId },
        {
          $set: {
            mailStatus: "Not Sent",
            // roundDate: null,
            interviewResult: nextStageName,
          },
        }
      );
    } else if (nextStageName === "Rejected") {
      await Referrals.updateOne(
        { _id: referralId },
        {
          $set: {
            mailStatus: "Not Sent",
            // roundDate: null,
            interviewResult: nextStageName,
          },
        }
      );
    }

    // console.log(" updated one", updatedOneRes)
    // Final response
    res.status(201).json({ message: "Rating processed successfully" });
  } catch (error) {
    console.error("Error in ratings controller:", error.name, error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function fetchRatings(req, res) {
  console.log(req.params, "params");
  try {
    const { id, val } = req.params;
    const referral = await model_ratings
      .findOne({ referralId: id })
      .select("prevStatus nextStatus");
    console.log(referral, "referral");

    console.log("current round val", val);
    //  console.log("prevStatus", prevStatus)
    //  console.log("nextStatus", nextStatus)

    // if(referral.nextStatus === "HR Round") {
    //     await Referrals.updateMany(
    //   { _id: { $in: objectIds } },
    //   {
    //     $set: {
    //       mailStatus: " NOt Sent Sent"
    //     },
    //   }
    // );
    // }
    // If nextStatus is HR Round, update the mailStatus in Referrals collection

    if (referral?.nextStatus === "HR Round") {
      await Referrals.updateOne(
        { _id: id },
        { $set: { mailStatus: "Not Sent" } }
      );
      console.log("Mail status set to Not Sent for HR Round");
    }

    // if()
    const fetchRate = await model_ratings.find({
      referralId: id,
      $or: [{ prevStatus: val }, { nextStatus: null, rejectedIn: val }],
    });

    console.log("fetchRate", fetchRate);

    res.json(fetchRate);
  } catch (error) {
    console.log("In rating controllers", error.name, ":", error.message);
    res.status(500).json({ error: error.message });
  }
}

// async function fetchRatings(req, res) {
//   try {
//     const { id, val } = req.params;

//     const fetchRate = await model_ratings.find({
//       referralId: id, // using string directly
//       $or: [
//         { nextStatus: val },
//         { rejectedIn: val },
//         { prevStatus: val }
//       ]
//     });

//     res.json(fetchRate);
//   } catch (error) {
//     console.error("In rating controller", error.name, ":", error.message);
//     res.status(500).json({ error: error.message });
//   }
// }

async function updateRatings(req, res) {
  console.log("update ratings", req.body);

  // die();
  console.log(req.params);
  try {
    const {
      finalValue,
      isFeedback,
      referralId,
      status,
      userIdAccess,
      isReason,
      nextStageName,
      rejectedIn,
    } = req.body;

    // console.log("req", req.params);

    const { id, val } = req.params; // values from URL
    const updateData = {
      ...(finalValue !== undefined && { finalRating: finalValue }),
      ...(isFeedback !== undefined && { feedback: isFeedback }),
      ...(userIdAccess !== undefined && { ratedBy: userIdAccess }),
      ...(nextStageName !== undefined && { nextStatus: nextStageName }),
      // ...(isReason !== undefined && { isReason: isReason }),
      ...(rejectedIn !== undefined && { rejectedIn: rejectedIn }),
    };

    console.log("update data", updateData);

    // let searchStatus = val;
    // if (val === "Rejected" && rejectedIn) {
    //   searchStatus = rejectedIn;
    // }
    // const foundDoc = await model_ratings.findOne({
    //   referralId: id,
    //   nextStatus: searchStatus,
    // console.log("id", id);
    // console.log("val", val);
    // console.log("nextStatus", val);
    // });
    const foundDoc = await model_ratings.findOne({
      referralId: id,
      $or: [{ prevStatus: val }, { nextStatus: "Rejected", rejectedIn: val }],
    });
    // console.log("Found /document:", foundDoc);

    //**to fetch data from add referrals collection
    const findFromAddReferrals = await Referrals.findOne({
      _id: id,
    });

    console.log("find From Referrals", findFromAddReferrals);

    if (!foundDoc) {
      return res.status(404).json({ message: "Rating not found" });
    }

    if (isReason && userIdAccess) {
      if (!foundDoc.updateDetails) {
        foundDoc.updateDetails = [];
      }
      foundDoc.updateDetails.push({
        isReason: isReason,
        updatedBy: userIdAccess,
      });
    }

    Object.assign(foundDoc, updateData);
    // console.log(Object.assign(foundDoc, updateData));

    let ratingUpdate = await foundDoc.save();

    console.log("ratingupdate 271", ratingUpdate);
    // process.exit(1);

    // process.exit(1);

    // this will update in adding_referrals

    let statusData;
    let currentRoundData;
    let interviewResultData;
    let rejectedInData;
    let mailStatusData;
    let interviewStatus;
    let roundDateUpdate;
    if (ratingUpdate.nextStatus === "Rejected") {
      console.log("Candidate Rejected in", ratingUpdate.prevStatus);

      statusData = ratingUpdate.nextStatus;
      currentRoundData = ratingUpdate.prevStatus;
      interviewResultData = ratingUpdate.nextStatus;
      rejectedInData = ratingUpdate.prevStatus;
      mailStatusData = "Not Sent";
      roundDateUpdate = findFromAddReferrals.roundDate;
    } else if (ratingUpdate.finalRating >= 6) {
      console.log(" Candidate Passed – rating ≥ 6");
      console.log("findFromAddReferrals", findFromAddReferrals);
      // process.exit(1);
      // statusData = ratingUpdate.nextStatus;
      // currentRoundData = ratingUpdate.nextStatus;
      // interviewResultData = "Pending";
      // rejectedInData = null;
      // roundDateUpdate = findFromAddReferrals.roundDate;
      // console.log(" Promoted to:", statusData);
      console.log("Mail Status & Interview Status will be checked...");
      if (
        ratingUpdate.prevStatus === "Group Discussion" &&
        findFromAddReferrals.status === "HR Round"
      ) {
        statusData = findFromAddReferrals.status;
        currentRoundData = findFromAddReferrals.currentRound;
        interviewResultData = findFromAddReferrals.interviewResult;
        rejectedInData = null;
        mailStatusData = findFromAddReferrals.mailStatus;
        roundDateUpdate = null;
      } else if (
        ratingUpdate.prevStatus === "Technical Assessment" &&
        findFromAddReferrals.status === "HR Round"
      ) {
        statusData = findFromAddReferrals.status;
        currentRoundData = findFromAddReferrals.currentRound;
        interviewResultData = findFromAddReferrals.interviewResult;
        rejectedInData = null;
        mailStatusData = findFromAddReferrals.mailStatus;
        roundDateUpdate = null;
      }

      if (
        (ratingUpdate.nextStatus === "Technical Assessment" &&
        ratingUpdate.prevStatus === "Group Discussion") || (ratingUpdate.nextStatus === "HR Round" &&
        ratingUpdate.prevStatus === "Technical Assessment")
      ) {
        console.log(findFromAddReferrals.status);
        if (findFromAddReferrals.status === "HR Round") {
          console.log(
            "current round in Hr round and rating got edited in Technical"
          );
          console.log("details",ratingUpdate)
          // mailStatusData = "Not Sent";
          mailStatusData = findFromAddReferrals.mailStatus;
          // roundDate = ratingUpdate.roundDate
          roundDateUpdate = findFromAddReferrals.roundDate;
          interviewStatus = "Completed";
        } else if (findFromAddReferrals.status === "Rejected") {
          console.log(
            "GD and Technical rounds are done; the candidate was rejected in GD, but the user later rated above 6.",
            ratingUpdate
          );
          console.log(
            "the current candidate complete details",
            findFromAddReferrals.interviewRounds
          );
          let allRoundsOfIndividual = findFromAddReferrals.interviewRounds;
          let gdRound = allRoundsOfIndividual.find(
            (round) => round.round === "Group Discussion"
          );
          let taRound = allRoundsOfIndividual.find(
            (round) => round.round === "Technical Assessment"
          );
          let hrRound = allRoundsOfIndividual.find(
            (round) => round.round === "HR Round"
          );
          if (
            ratingUpdate.prevStatus === "Group Discussion" &&
            taRound.status === "Completed"
          ) {
            console.log("hello");
            statusData = "HR Round";
            currentRoundData = "HR Round";
            mailStatusData = "Not Sent";
            interviewStatus = "Completed";
            rejectedInData = null;
            interviewResultData = "Pending";
            roundDateUpdate = null;
          } else {
            statusData = ratingUpdate.nextStatus;
            currentRoundData = ratingUpdate.nextStatus;
            interviewResultData = "Pending";
            rejectedInData = null;
            roundDateUpdate = findFromAddReferrals.roundDate;
            mailStatusData = "Sent";

            console.log(" Promoted to:", statusData);
          }

          console.log("ta round", taRound);
        } else {
          console.log(" Mail Sent after GD – Promoted to Technical");
          console.log(" Interview Status:", interviewStatus);
        }
      } else if (ratingUpdate.nextStatus === "HR Round") {
        mailStatusData = "Not Sent";
        statusData = ratingUpdate.nextStatus;
        currentRoundData = ratingUpdate.nextStatus;
        interviewResultData = "Pending";
        rejectedInData = null;
        // roundDateUpdate = findFromAddReferrals.roundDate;
        rejectedInData = null;
        roundDateUpdate = null;
        console.log("Mail Not Sent – Promoted to HR Round");
        console.log("Round Date cleared since HR is next");
      }
    } else if (ratingUpdate.finalRating < 6) {
      console.log(" When we try to edit the person rating less than 6");
      statusData = "Rejected";
      currentRoundData = null;
      interviewResultData = "Rejected";
      rejectedInData = ratingUpdate.rejectedIn;
      interviewStatus = "Rejected";
      mailStatusData = "Not Sent";
      roundDateUpdate = null;
    }

    const updateDataInAddReferrals = {
      status: statusData,
      currentRound: currentRoundData,
      interviewResult: interviewResultData,
      rejectedIn: rejectedInData,
      mailStatus: mailStatusData,
      roundDate: roundDateUpdate,
      "interviewRounds.$.rating": ratingUpdate.finalRating,
      "interviewRounds.$.status": interviewStatus,
    };

    console.log("Final update object:", updateDataInAddReferrals);

    // process.exit(1);

    await Referrals.updateOne(
      {
        _id: id,
        "interviewRounds.round": ratingUpdate.prevStatus,
      },
      {
        $set: updateDataInAddReferrals,
      }
    );

    // console.log(dataAddingReferrals);
    // process.exit();

    console.log(ratingUpdate, "ratings updated");
    // process.exit()
    res.status(200).json({ message: "Rating updated", data: ratingUpdate });
  } catch (error) {
    console.log("In rating update controllers", error.name, ":", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getMail(req, res) {
  // console.log(req.params, "mail params!");
  const type = req.params.type;
  if (mailData[type]) {
    res.json(mailData[type]);
  } else {
    res.status(404).json({ error: "Mail type not found" });
  }
}

async function rateDetails(req, res) {
  try {
    console.log(req.params, "rate details params!");
    const { val, id } = req.params;
    console.log("Id", id);
    console.log("val", val);

    const findDetails = await model_ratings.findOne({
      referralId: id,
      // $or: [{ nextStatus: val }, { nextStatus: "Rejected", rejectedIn: val }],
      $or: [{ prevStatus: val }, { nextStatus: "Rejected", rejectedIn: val }],
    });

    if (!findDetails) {
      return res.status(404).json({ message: "Rating details not found" });
    }

    console.log(findDetails, "rate details for user");
    // console.log(findDetails.ratedBy, "rated by for user");
    const rateBy = await referralUsers.findById(findDetails.ratedBy);
    console.log(rateBy.userName, "rated by admin details");
    // console.log(findDetails.updateDetails, "rate update details for user");
    const updatedByUsers = [];

    for (let i = 0; i < findDetails.updateDetails.length; i++) {
      const updateBy = await referralUsers.findById(
        findDetails.updateDetails[i].updatedBy
      );
      updatedByUsers.push(updateBy.userName);
    }

    console.log(updatedByUsers, "updated by admins");

    res.status(200).json({
      data: findDetails,
      ratedBy: rateBy.userName,
      updatedBy: updatedByUsers,
    });
  } catch (error) {
    console.error("Error fetching rate details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getThatReferDeatils(req, res) {
  try {
    const { id } = req.params; // id = referralId

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Referral ID is required." });
    }

    // Find all rating documents where referralId matches
    const ratings = await model_ratings.find({ referralId: id });

    if (!ratings || ratings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No ratings found for this referral.",
      });
    }

    return res.status(200).json({ success: true, data: ratings });
  } catch (error) {
    console.error("Error fetching referral ratings:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

module.exports = {
  ratings,
  fetchRatings,
  updateRatings,
  getMail,
  rateDetails,
  getThatReferDeatils,
};
