// Centralized category definitions - used by MenuProductsPage, Header, etc.

export const CATEGORY_KEYS = {
  TRA_SUA: 'TraSua',
  TRA_TRAI_CAY: 'TraTraiCay',
  CA_PHE: 'CaPhe',
  KHAC: 'Khac',
};

export const SUB_CATEGORY_KEYS = {
  TRA_SUA_TRUYEN_THONG: 'TraSuaTruyenThong',
  TRA_SUA_NUONG: 'TraSuaNuong',
  BANH_NGOT: 'BanhNgot',
  CA_PHE_DONG_GOI: 'CaPheDongGoi',
  DO_LUU_NIEM: 'DoLuuNiem',
};

export const CATEGORY_LABELS = {
  TraSua: 'Trà Sữa',
  TraSuaTruyenThong: 'Trà Sữa Truyền Thống',
  TraSuaNuong: 'Trà Sữa MoRa',
  TraTraiCay: 'Trà Trái Cây',
  CaPhe: 'Cà Phê',
  Khac: 'Khác',
  BanhNgot: 'Bánh Ngọt',
  CaPheDongGoi: 'Cà Phê Đóng Gói',
  DoLuuNiem: 'Đồ Lưu Niệm',
};

export const CATEGORY_FILTERS = {
  TraSua: (p) => ['TraSua', 'Trà Sữa', 'Milk Tea'].includes(p.category),
  TraSuaTruyenThong: (p) => p.category === 'TraSua' && (!p.subCategory || p.subCategory === 'TraSuaTruyenThong'),
  TraSuaNuong: (p) => p.category === 'TraSua' && p.subCategory === 'TraSuaNuong',
  TraTraiCay: (p) => ['TraTraiCay', 'Trà Trái Cây'].includes(p.category),
  CaPhe: (p) => ['CaPhe', 'Cà Phê'].includes(p.category),
  Khac: (p) => ['Khac', 'Khác'].includes(p.category) || ['BanhNgot', 'CaPheDongGoi', 'DoLuuNiem'].includes(p.subCategory),
  BanhNgot: (p) => p.subCategory === 'BanhNgot',
  CaPheDongGoi: (p) => p.subCategory === 'CaPheDongGoi',
  DoLuuNiem: (p) => p.subCategory === 'DoLuuNiem',
};

export const ADMIN_CATEGORIES = [
  {
    value: 'TraSua', label: 'Trà Sữa', subCategories: [
      { value: 'TraSuaTruyenThong', label: 'Truyền Thống' },
      { value: 'TraSuaNuong', label: 'MoRa Nướng' },
    ]
  },
  { value: 'TraTraiCay', label: 'Trà Trái Cây', subCategories: [] },
  { value: 'CaPhe', label: 'Cà Phê', subCategories: [] },
  {
    value: 'Khac', label: 'Khác', subCategories: [
      { value: 'BanhNgot', label: 'Bánh Ngọt' },
      { value: 'CaPheDongGoi', label: 'Cà Phê Đóng Gói' },
      { value: 'DoLuuNiem', label: 'Đồ Lưu Niệm' },
    ]
  },
];
