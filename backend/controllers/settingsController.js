import SiteSetting from '../models/SiteSetting.js';

// @desc    Get website settings (creates default if none exist)
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
    try {
        let settings = await SiteSetting.findOne();
        if (!settings) {
            settings = await SiteSetting.create({});
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tải cấu hình trang web' });
    }
};

// @desc    Update website settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
    try {
        let settings = await SiteSetting.findOne();

        if (settings) {
            settings.heroTitle = req.body.heroTitle ?? settings.heroTitle;
            settings.heroSubtitle = req.body.heroSubtitle ?? settings.heroSubtitle;
            settings.heroDesc = req.body.heroDesc ?? settings.heroDesc;
            settings.heroBtn = req.body.heroBtn ?? settings.heroBtn;
            settings.heroLink = req.body.heroLink ?? settings.heroLink;
            settings.heroBannerLeft = req.body.heroBannerLeft ?? settings.heroBannerLeft;
            settings.heroBannerRight = req.body.heroBannerRight ?? settings.heroBannerRight;
            settings.contactPhone = req.body.contactPhone ?? settings.contactPhone;
            settings.contactEmail = req.body.contactEmail ?? settings.contactEmail;
            settings.contactAddress = req.body.contactAddress ?? settings.contactAddress;

            const updatedSettings = await settings.save();
            res.json(updatedSettings);
        } else {
            // Unlikely to happen due to getSettings initialization, but fallback
            settings = await SiteSetting.create(req.body);
            res.json(settings);
        }
    } catch (error) {
        res.status(404).json({ message: 'Lỗi cập nhật cấu hình trang web' });
    }
};
