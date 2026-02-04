const getInterviewDateColor = (referral) => {
//   console.log("ROUND DATE:", referral.roundDate);
//   console.log("STATUS:", referral.status);
//   console.log("MAIL STATUS:", referral.mailStatus);
    // console.log("getInterviewDateColor input:", referral);


  if (!referral || !referral.roundDate) return "red"; // default

  const dateInterview = new Date(referral.roundDate);
  const accessToRatingsForm = dateInterview.toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];

  if (referral.status === "Rejected") {
    return "#dc3545"; // red
  } else if (accessToRatingsForm > today) {
    return "#6c757d"; // future = gray
  } else if (accessToRatingsForm === today) {
    return "#007bff"; // today = blue
  } else if (
    accessToRatingsForm < today &&
    referral.interviewResult === "Pending"
  ) {
    return "#fd7e14"; // pending but past = orange
  } else if (referral.status === "Selected" && referral.mailStatus === "Sent") {
    return "#198754"; // green
  }

  return "#283e46"; // fallback default
};

export default getInterviewDateColor;
