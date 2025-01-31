import { User } from '../Models/User.js';
import { File } from '../Models/File.js';



class UserHandler{

// Route: Get User Profile
static  async getProfile (req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found', valid: false });
        }
        return res.status(200).json({ user: user.toObject(), message: 'User profile retrieved', valid: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error', valid: false });
    }
}

// Route: Get User Stats
static async  getFilesStats(req, res) {
    try {
        const files = await File.find({ owner_id: req.user.id });

        const fileTypeCount = files.reduce((acc, file) => {
            const fileType = file.file_type;
            acc[fileType] = (acc[fileType] || 0) + 1;
            return acc;
        }, {});
        return res.status(200).json({
            file_type_count: fileTypeCount,
            total_files: files.length,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error', valid: false });
    }
}

}
export default UserHandler;
