const NhaXuatBan = require('../models/NhaXuatBan');

const getNhaXuatBans = async (req, res) => {
    try {
        const nxbs = await NhaXuatBan.find();
        res.json(nxbs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createNhaXuatBan = async (req, res) => {
    const { TenNXB, DiaChi } = req.body;
    try {
        const exists = await NhaXuatBan.findOne({ TenNXB });
        if (exists) return res.status(400).json({ message: 'Nhà xuất bản đã tồn tại' });
        
        const nxb = await NhaXuatBan.create({ TenNXB, DiaChi });
        res.status(201).json(nxb);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateNhaXuatBan = async (req, res) => {
    try {
        const nxb = await NhaXuatBan.findById(req.params.id);
        if (!nxb) return res.status(404).json({ message: 'Không tìm thấy' });

        nxb.TenNXB = req.body.TenNXB || nxb.TenNXB;
        nxb.DiaChi = req.body.DiaChi || nxb.DiaChi;

        const updatedNXB = await nxb.save();
        res.json(updatedNXB);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteNhaXuatBan = async (req, res) => {
    try {
        const nxb = await NhaXuatBan.findById(req.params.id);
        if (!nxb) return res.status(404).json({ message: 'Không tìm thấy' });

        await nxb.deleteOne();
        res.json({ message: 'Xóa nhà xuất bản thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getNhaXuatBans,
    createNhaXuatBan,
    updateNhaXuatBan,
    deleteNhaXuatBan
};
