/* eslint-disable no-useless-catch */
const TheoDoiMuonSach = require('../models/theodoimuonsach.model');
const Sach = require('../models/sach.model');
const { MAX_BORROW_LIMIT, BORROW_DAYS } = require('../utils/constants');

const muonSachService = async (docGiaId, sachId) => {
  try {
    const activeBorrows = await TheoDoiMuonSach.countDocuments({
      docGia: docGiaId,
      trangThai: 'dang_muon'
    });

    if (activeBorrows >= MAX_BORROW_LIMIT) {
      throw new Error('LIMIT_EXCEEDED');
    }

    const now = new Date();

    const overdue = await TheoDoiMuonSach.exists({
      docGia: docGiaId,
      trangThai: 'dang_muon',
      hanTra: { $lt: now },
      finePaid: false
    });

    if (overdue) {
      throw new Error('UNPAID_FINE');
    }

    const sach = await Sach.findOneAndUpdate(
      {
        _id: sachId,
        soQuyen: { $gt: 0 }
      },
      { $inc: { soQuyen: -1 } },
      { new: true }
    );

    if (!sach) {
      throw new Error('BOOK_NOT_AVAILABLE');
    }

    const hanTra = new Date();
    hanTra.setDate(hanTra.getDate() + BORROW_DAYS);

    const borrow = await TheoDoiMuonSach.create({
      docGia: docGiaId,
      sach: sachId,
      hanTra
    });

    return borrow;
  } catch (error) {
    throw error;
  }
};

const traSachService = async (borrowId) => {
  try {
    const borrow = await TheoDoiMuonSach.findById(borrowId);

    if (!borrow) {
      throw new Error('BORROW_NOT_FOUND');
    }

    if (borrow.trangThai === 'da_tra') {
      throw new Error('ALREADY_RETURNED');
    }

    const now = new Date();

    if (borrow.hanTra < now && !borrow.finePaid) {
      throw new Error('UNPAID_FINE');
    }

    await Sach.findByIdAndUpdate(borrow.sach, { $inc: { soQuyen: 1 } });

    borrow.trangThai = 'da_tra';
    borrow.ngayTra = now;

    await borrow.save();

    return borrow;
  } catch (error) {
    throw error;
  }
};

module.exports = { muonSachService, traSachService };
