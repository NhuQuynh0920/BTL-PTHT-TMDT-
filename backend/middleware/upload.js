import multer from 'multer';

const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(new Error('Chỉ hỗ trợ định dạng JPG, PNG và WebP.'));
      return;
    }
    cb(null, true);
  },
});

export const optionalUpload = (fieldName) => (req, res, next) => {
  if (req.is('multipart/form-data')) {
    return upload.single(fieldName)(req, res, next);
  }
  next();
};

export default upload;