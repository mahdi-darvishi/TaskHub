export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = req.file.path;

  res.status(200).json({
    message: "File uploaded successfully",
    filePath: filePath,
  });
};
