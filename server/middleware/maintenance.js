export const maintenance = (req, res, next) => {
  // check if the time if 1PM to 2PM of India
  const date = new Date();
  const hours = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: false,
    timeZone: "Asia/Kolkata",
  }).format(date);

  if (parseInt(hours) === 11) {
    return res.status(503).json({
      message: "Server is under maintenance, please try again later",
    });
  }

  next();
};
