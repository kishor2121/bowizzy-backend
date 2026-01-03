const UserSubscription = require("../models/UserSubscription");

exports.createOrUpdateSubscription = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { plan_type, end_date, selected_templates = [] } = req.body;

    if (!Array.isArray(selected_templates)) {
      return res.status(400).json({
        message: "selected_templates must be an array"
      });
    }

    let existing = await UserSubscription.query().findOne({ user_id });

    if (existing) {
      const updated = await UserSubscription
        .query()
        .patchAndFetchById(existing.subscription_id, {
          plan_type,
          start_date: new Date(),
          end_date,
          status: "active",
          selected_templates
        });

      return res.json(updated);
    }

    const created = await UserSubscription.query().insert({
      user_id,
      plan_type,
      start_date: new Date(),
      end_date,
      status: "active",
      selected_templates
    });

    return res.status(201).json(created);

  } catch (err) {
    console.log("Subscription error:", err);
    res.status(500).json({ message: "Failed to update subscription" });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { plan_type, end_date, status, selected_templates = [] } = req.body;

    if (!Array.isArray(selected_templates)) {
      return res.status(400).json({
        message: "selected_templates must be an array"
      });
    }

    let existing = await UserSubscription.query().findOne({ user_id });

    if (!existing) {
      const created = await UserSubscription.query().insert({
        user_id,
        plan_type,
        start_date: new Date(),
        end_date,
        status: status || "active",
        selected_templates: JSON.stringify(selected_templates) // ✅ FIX
      });

      return res.status(201).json({
        message: "Subscription created",
        data: created
      });
    }

    const updated = await UserSubscription
      .query()
      .patchAndFetchById(existing.subscription_id, {
        plan_type,
        end_date,
        status,
        selected_templates: JSON.stringify(selected_templates) // ✅ FIX
      });

    return res.json({
      message: "Subscription updated",
      data: updated
    });

  } catch (err) {
    console.log("Update subscription error:", err);
    res.status(500).json({ message: "Failed to update subscription" });
  }
};

exports.getSubscription = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const record = await UserSubscription.query().findOne({ user_id });

    if (!record) {
      return res.json({
        plan_type: "free",
        status: "active",
        selected_templates: []
      });
    }

    return res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching subscription" });
  }
};
