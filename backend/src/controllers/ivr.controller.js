// ivr controller
// TODO: Implement controller methods

exports.getAll = async (req, res, next) => {
  try {
    res.json({ success: true, data: [] })
  } catch (error) {
    next(error)
  }
}
