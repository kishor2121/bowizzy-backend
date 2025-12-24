const UserVerificationRequest = require("../models/userVerificationRequest");
const User = require("../models/User");



exports.sendVerificationRequest = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const userVerificationInfo = await User.query()
      .select('is_verified')
      .findOne({ user_id });

    if(!userVerificationInfo){
      return res.status(404).json({ message: "User not found" })
    }

    if(userVerificationInfo.is_verified){
      return res.status(409).json({ message: "User is already verified" })
    }

    const pendingRequest = await UserVerificationRequest
      .query()
      .findOne({
        user_id,
        verification_status: 'PENDING'
      });

    if(pendingRequest){
        return res.status(409).json({ message: "The user verification for the current user is already submitted" })
    }

    const requestCreated = await UserVerificationRequest
      .query()
      .insertAndFetch({ user_id });

    return res.status(201).json(requestCreated);

  } catch (err) {
    res.status(500).json({ message: "Error sending request for user verification" });
  }
};

exports.acceptVerificationRequest = async (req, res) => {
  try {
    const { user_id } = req.body;

    const userVerificationInfo = await User.query()
      .select("is_verified")
      .findById(user_id);

    if (!userVerificationInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userVerificationInfo.is_verified) {
      return res.status(409).json({ message: "User is already verified" });
    }

    const pendingRequest = await UserVerificationRequest.query()
      .findOne({
        user_id,
        verification_status: "PENDING"
      });

    if (!pendingRequest) {
      return res.status(404).json({
        message: "No pending verification request found for this user"
      });
    }

    let updatedUser;
    let updatedVerificationRequest;

    await User.transaction(async (trx) => {
      updatedUser = await User.query(trx)
        .patchAndFetchById(user_id, { is_verified: true });

      updatedVerificationRequest = await UserVerificationRequest.query(trx)
        .patchAndFetchById(pendingRequest.id, {
          verification_status: "APPROVED"
        });
    });

    return res.status(200).json({
      message: "User verification approved successfully",
      user: updatedUser,
      verification_request: updatedVerificationRequest
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error approving user verification request"
    });
  }
};

