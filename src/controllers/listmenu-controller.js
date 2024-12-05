const prisma = require("../config/prisma");
const createError = require("../utils/createError");
const convertNumber = require("../utils/convertNumber");

exports.getListMenuById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listMenus = await prisma.listMenu.findUnique({
      where: { listMenuId: Number(id) },
    });
    res.status(200).json(listMenus);
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.updatedListMenu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      isEdit,
      remark,
      note,
      docNumber,
      issuedDate,
      dueDate,
      clientName,
      taxInvoice,
      address,
      remarkNumber,
      currency,
    } = req.body;

    const findListMenu = await prisma.listMenu.findUnique({
      where: { listMenuId: Number(id) },
    });

    if (!findListMenu) {
      return createError(400, "ListMenu not found");
    }

    const newListMenu = await prisma.listMenu.update({
      where: { listMenuId: Number(id) },
      data: {
        isEdit,
        remark,
        remarkNumber,
        note,
        docNumber,
        issuedDate,
        dueDate,
        clientName,
        currency,
        taxInvoice,
        address,
      },
    });

    res.status(200).json(newListMenu);
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.getAllListById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lists = await prisma.list.findMany({
      where: {
        listMenuId: Number(id),
      },
      include: {
        product: true,
      },
    });
    res.status(200).json(lists);
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.createList = async (req, res, next) => {
  try {
    const {
      productId,
      number,
      weight,
      pricePerWeight,
      unit,
      discount,
      listMenuId,
    } = req.body;

    if (!productId || !number || !weight || !pricePerWeight || !unit) {
      return createError(400, "All Input required");
    }

    let actualPrice;
    if (unit === "PIECE") {
      actualPrice = number * pricePerWeight;
    } else {
      actualPrice = number * pricePerWeight * weight;
    }

    const discountAmount = Number((actualPrice * (discount || 0)) / 100);

    const netPrice = Number(
      actualPrice - (actualPrice * (discount || 0)) / 100
    );

    const vat = Number((netPrice * 7) / 100);
    const totalPrice = Number(Number(netPrice) + Number(vat));

    const oldListMenu = await prisma.listMenu.findUnique({
      where: { listMenuId },
    });

    // Create List Menu
    let listMenu;
    if (oldListMenu) {
      // Convert the decimal fields to numbers
      const [convertedOldListMenu] = convertNumber(
        [oldListMenu],
        ["netPrice", "actualPrice", "discountPrice", "vat", "totalPrice"]
      );

      const newDiscount = Number(
        (convertedOldListMenu.discountPrice || 0) + discountAmount
      );

      const newActualPrice = Number(
        (convertedOldListMenu.actualPrice || 0) + actualPrice
      );

      const newNetPrice = Number(
        (convertedOldListMenu.netPrice || 0) + Number(netPrice)
      );

      const newVat = Number(newNetPrice * 0.07);

      const newTotalPrice = Number(newNetPrice + newVat);

      listMenu = await prisma.listMenu.update({
        where: { listMenuId },
        data: {
          netPrice: Number(newNetPrice),
          actualPrice: Number(newActualPrice),
          discountPrice: Number(newDiscount),
          totalPrice: Number(newTotalPrice),
          vat: Number(newVat),
          isEdit: true,
        },
      });
    } else {
      listMenu = await prisma.listMenu.create({
        data: {
          netPrice,
          actualPrice,
          discountPrice: discountAmount,
          vat,
          totalPrice,
          isEdit: true,
        },
      });
    }

    const data = {
      number: Number(number),
      weight: Number(weight),
      pricePerWeight: Number(pricePerWeight),
      unit,
      discount: Number(discount || 0),
      actualPrice: Number(actualPrice),
      netPrice: Number(netPrice),
      productId: Number(productId),
      listMenuId: Number(listMenu.listMenuId),
    };

    // Create List
    const newList = await prisma.list.create({
      data: data,
    });

    res.status(201).json(newList);
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.deleteList = async (req, res, next) => {
  try {
    const { id } = req.params;

    //Check if list id exists?
    const checkId = await prisma.list.findUnique({
      where: { listId: Number(id) },
      include: {
        listMenu: true,
      },
    });

    if (!checkId) {
      return createError(400, "List not found");
    }

    const [convertedCheckId] = convertNumber(
      [checkId],
      ["netPrice", "actualPrice", "discountPrice", "vat", "totalPrice"]
    );

    const newNetPrice = Number(
      convertedCheckId.listMenu.netPrice - convertedCheckId.netPrice
    );

    const newActualPrice = Number(
      convertedCheckId.listMenu.actualPrice - convertedCheckId.actualPrice
    );

    const discountAmount = Number(
      convertedCheckId.actualPrice - convertedCheckId.netPrice
    );

    const newVat = Number(newNetPrice * 0.07);

    const newTotalPrice = Number(Number(newNetPrice) - Number(newVat));

    const updatedListMenu = await prisma.listMenu.update({
      where: { listMenuId: convertedCheckId.listMenuId },
      data: {
        netPrice: Number(newNetPrice),
        actualPrice: Number(newActualPrice),
        discountPrice: Number(discountAmount),
        vat: Number(newVat),
        totalPrice: Number(newTotalPrice),
      },
    });

    const delList = await prisma.list.delete({
      where: {
        listId: Number(id),
      },
    });

    res.status(200).json(delList);
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.updateList = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { productId, number, weight, pricePerWeight, unit, discount } =
      req.body;
    const findList = await prisma.list.findUnique({
      where: { listId: Number(id) },
      include: {
        listMenu: true,
      },
    });

    if (!findList) {
      return createError(400, "List not found");
    }

    const [convertedFindList] = convertNumber(
      [findList],
      ["netPrice", "actualPrice", "discountPrice", "vat", "totalPrice"]
    );

    //if Change Unit type
    let newActualPrice;
    if (unit === "PIECE") {
      newActualPrice = number * pricePerWeight;
    } else {
      newActualPrice = number * pricePerWeight * weight;
    }

    const discountAmount = Number((newActualPrice * (discount || 0)) / 100);

    const newNetPrice = Number(
      newActualPrice - (newActualPrice * (discount || 0)) / 100
    );

    newActualPrice = Number(newActualPrice);

    const listMenuNewNetPrice = Number(
      convertedFindList.listMenu.netPrice -
        convertedFindList.netPrice +
        Number(newNetPrice)
    );

    const listMenuNewActualPrice = Number(
      convertedFindList.listMenu.actualPrice -
        convertedFindList.actualPrice +
        Number(newActualPrice)
    );

    const newVat = Number(listMenuNewNetPrice * 0.07);

    const newTotalPrice = Number(Number(listMenuNewNetPrice) + Number(newVat));

    // Update List Menu
    const updatedListMenu = await prisma.listMenu.update({
      where: { listMenuId: Number(convertedFindList.listMenuId) },
      data: {
        netPrice: Number(listMenuNewNetPrice),
        actualPrice: Number(listMenuNewActualPrice),
        discountPrice: Number(discountAmount),
        vat: Number(newVat),
        totalPrice: Number(newTotalPrice),
      },
    });

    // Update List
    const updatedList = await prisma.list.update({
      where: { listId: Number(id) },
      data: {
        number,
        weight,
        pricePerWeight,
        unit,
        discount: discount || 0,
        actualPrice: newActualPrice,
        netPrice: newNetPrice,
      },
    });

    res.status(200).json(updatedList);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
