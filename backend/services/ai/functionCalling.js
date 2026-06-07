import { getMenu, getBestSeller, getLowSugarDrinks } from '../db/menuService.js';
import { getPromotions, getBranches } from '../db/promotionService.js';
import { getOrderStatus } from '../db/orderService.js';

export const tools = [
  {
    functionDeclarations: [
      {
        name: "getMenu",
        description: "Lấy danh sách các món đồ uống, trà sữa, bánh và giá tiền trong menu của cửa hàng.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      },
      {
        name: "getBestSeller",
        description: "Lấy danh sách 5 món bán chạy nhất của cửa hàng.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      },
      {
        name: "getLowSugarDrinks",
        description: "Lấy danh sách các món ít ngọt, healthy hoặc gợi ý giảm đường.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      },
      {
        name: "getPromotions",
        description: "Lấy danh sách các mã giảm giá, voucher và chương trình khuyến mãi hiện có.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      },
      {
        name: "getBranches",
        description: "Lấy danh sách thông tin địa chỉ và giờ mở cửa các chi nhánh của MoRa Tea.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      },
      {
        name: "getOrderStatus",
        description: "Kiểm tra trạng thái đơn hàng thông qua mã đơn hàng (ID).",
        parameters: {
          type: "OBJECT",
          properties: {
            orderId: {
              type: "STRING",
              description: "Mã đơn hàng (Order ID) dài 24 ký tự chữ và số. Ví dụ: 65a4c5e3f...",
            },
          },
          required: ["orderId"],
        },
      }
    ],
  },
];

export const executeFunction = async (functionName, args) => {
  switch (functionName) {
    case 'getMenu':
      return await getMenu();
    case 'getBestSeller':
      return await getBestSeller();
    case 'getLowSugarDrinks':
      return await getLowSugarDrinks();
    case 'getPromotions':
      return await getPromotions();
    case 'getBranches':
      return await getBranches();
    case 'getOrderStatus':
      return await getOrderStatus(args.orderId);
    default:
      throw new Error(`Unknown function: ${functionName}`);
  }
};
