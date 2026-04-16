const YeuThich = require('../models/YeuThich');
const Sach = require('../models/Sach');

const toggleFavorite = async (req, res) => {
    try {
        const sachId = req.params.sachId;
        const readerId = req.user._id;

        const existingFavorite = await YeuThich.findOne({ 
            MaDocGia: readerId, 
            MaSach: sachId 
        });

        if (existingFavorite) {
            await YeuThich.findByIdAndDelete(existingFavorite._id);
            return res.status(200).json({ 
                success: true, 
                isFavorite: false,
                message: 'Đã xóa khỏi danh sách yêu thích' 
            });
        } else {
            await YeuThich.create({ 
                MaDocGia: readerId, 
                MaSach: sachId 
            });
            return res.status(201).json({ 
                success: true, 
                isFavorite: true,
                message: 'Đã thêm vào danh sách yêu thích' 
            });
        }
    } catch (error) {
        console.error('Lỗi khi toggle yêu thích:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi xử lý yêu thích' });
    }
};

const getFavorites = async (req, res) => {
    try {
        const readerId = req.user._id;
        
        const favorites = await YeuThich.find({ MaDocGia: readerId })
            .populate({
                path: 'MaSach',
                populate: { path: 'MaNXB' }
            })
            .sort({ createdAt: -1 });

        const favoriteBooks = favorites
            .filter(f => f.MaSach) 
            .map(f => f.MaSach);

        res.status(200).json(favoriteBooks);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách yêu thích:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi tải danh sách yêu thích' });
    }
};

const checkFavorite = async (req, res) => {
    try {
        const sachId = req.params.sachId;
        const readerId = req.user._id;

        const favorite = await YeuThich.findOne({ 
            MaDocGia: readerId, 
            MaSach: sachId 
        });

        res.status(200).json({ isFavorite: !!favorite });
    } catch (error) {
        console.error('Lỗi khi kiểm tra yêu thích:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi kiểm tra trạng thái yêu thích' });
    }
};

module.exports = {
    toggleFavorite,
    getFavorites,
    checkFavorite
};
