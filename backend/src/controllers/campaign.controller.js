// campaign controller
// TODO: Implement controller methods

export const getAll = async (req, res, next) => {
  try {
    res.json({ success: true, data: [] })
  } catch (error) {
    next(error)
  }
};
