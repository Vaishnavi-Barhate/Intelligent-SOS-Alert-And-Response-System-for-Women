const User = require("../models/User");

exports.findNearbyUsers = async (longitude, latitude, radius) => {
  return await User.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        $maxDistance: radius
      }
    }
  });
};
