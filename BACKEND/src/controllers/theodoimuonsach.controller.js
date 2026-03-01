const validateObjectId = require('../utils/validateObjectId');
const { muonSachService, traSachService } = require('../services/theodoimuonsach.service');

const muonSach = async (req, res, next) => {
  try {
    const { sachId } = req.body;

    if (!sachId || !validateObjectId(sachId)) {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ'
      });
    }

    const docGiaId = req.user.id;

    const phieuMuon = await muonSachService(docGiaId, sachId);

    res.status(201).json({
      success: true,
      message: 'Mượn sách thành công',
      data: phieuMuon
    });
  } catch (error) {
    switch (error.message) {
      case 'LIMIT_EXCEEDED':
        return res.status(400).json({
          success: false,
          message: 'Độc giả đã vượt quá số sách được phép mượn'
        });

      case 'UNPAID_FINE':
        return res.status(403).json({
          success: false,
          message: 'Độc giả có sách quá hạn chưa đóng tiền phạt'
        });

      case 'BOOK_NOT_AVAILABLE':
        return res.status(400).json({
          success: false,
          message: 'Sách không tồn tại hoặc đã hết'
        });

      default:
        next(error);
    }
  }
};

const traSach = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || !validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ'
      });
    }

    const ketQua = await traSachService(id);

    res.status(200).json({
      success: true,
      message: 'Trả sách thành công',
      data: ketQua
    });
  } catch (error) {
    switch (error.message) {
      case 'BORROW_NOT_FOUND':
        return res.status(404).json({
          success: false,
          
          message: 'Không tìm thấy phiếu mượn'
        });

      case 'ALREADY_RETURNED':
        return res.status(400).json({
          success: false,
          message: 'Sách đã được trả trước đó'
        });

      case 'UNPAID_FINE':
        return res.status(403).json({
          success: false,
          message: 'Sách đã quá hạn. Vui lòng đóng tiền phạt trước khi xác nhận trả'
        });

      default:
        next(error);
    }
  }
};

module.exports = { muonSach, traSach };
