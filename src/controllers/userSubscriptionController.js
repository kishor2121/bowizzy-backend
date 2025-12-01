const UserSubscription = require("../models/UserSubscription");

exports.createOrUpdateSubscription = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { plan_type, end_date } = req.body;

    let existing = await UserSubscription.query().findOne({ user_id });

    if (existing) {
      // UPDATE
      const updated = await UserSubscription
        .query()
        .patchAndFetchById(existing.subscription_id, {
          plan_type,
          start_date: new Date(),
          end_date,
          status: "active"
        });

      return res.json(updated);
    }

    // CREATE NEW
    const created = await UserSubscription.query().insert({
      user_id,
      plan_type,
      start_date: new Date(),
      end_date,
      status: "active"
    });

    res.status(201).json(created);

  } catch (err) {
    console.log("Subscription error:", err);
    res.status(500).json({ message: "Failed to update subscription" });
  }
};

exports.getSubscription = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const record = await UserSubscription.query().findOne({ user_id });

    if (!record) {
      return res.json({
        plan_type: "free",
        status: "active"
      });
    }

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching subscription" });
  }
};
