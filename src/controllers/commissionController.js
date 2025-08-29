const Commission = require("../models/commissionModel");

// Get all commissions
// const getCommissions = async (req, res) => {
//   const commissions = await Commission.find();
//   res.json(commissions);
// };

// GET /api/commissions
// const getCommissions = async (req, res) => {
//   try {
//     const { id, status, date, pospId } = req.query;
//     let filter = {};

//     if (id) filter.id = Number(id); // match numeric id
//     if (status) filter.status = status;
//     if (pospId) filter.pospId = pospId; // ✅ new line

//     if (date) {
//       const start = new Date(date);
//       const end = new Date(date);
//       end.setHours(23, 59, 59, 999);
//       filter.date = { $gte: start, $lte: end };
//     }

//     const commissions = await Commission.find(filter);
//     res.json(commissions);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// Pagination

// const getCommissions = async (req, res) => {
//   try {
//     const { id, status, date, pospId, page = 1, limit = 10 } = req.query;
//     let filter = {};

//     if (id) filter.id = Number(id);
//     if (status) filter.status = status;
//     if (pospId) filter.pospId = pospId;

//     if (date) {
//       const start = new Date(date);
//       const end = new Date(date);
//       end.setHours(23, 59, 59, 999);
//       filter.date = { $gte: start, $lte: end };
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const commissions = await Commission.find(filter)
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await Commission.countDocuments(filter);

//     res.json({
//       data: commissions,
//       total,
//       page: parseInt(page),
//       totalPages: Math.ceil(total / limit)
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


const getCommissions = async (req, res) => {
  try {
    const { id, status, date, pospId, page = 1, limit = 10,invoiceMonth } = req.query;
    let filter = {};

    if (id) filter.id = Number(id);
    if (status && status!=='undefined' && status!=="null"){
      filter.status = { $ne: 'Paid' };
    } 
    if (pospId) filter.pospId = pospId;
    if(invoiceMonth && invoiceMonth!=='undefined' && invoiceMonth!=="null") filter.invoiceMonth=invoiceMonth

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }
  
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const commissions = await Commission.find(filter).sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Commission.countDocuments(filter);

    // NEW: Calculate summary
    // Optional: we can reuse 'filter' or use all data not paginated
    const allData = await Commission.find(filter);
    const totalPendingCount = allData.filter(v => v.status === 'Pending').length;
    const totalPendingAmount = allData
      .filter(v => v.status === 'Pending' || v.status === 'Invoice Submitted')
      .reduce((sum, x) => sum + x.totalCommission, 0);

    const totalPaidAmount = allData
      .filter(v => v.status === 'Paid')
      .reduce((sum, x) => sum + x.totalCommission, 0);

    res.json({
      data: commissions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      summary: {
        totalPendingCount,
        totalPendingAmount,
        totalPaidAmount
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// Create a commission
const createCommission = async (req, res) => {
  try {
    const commission = await Commission.create(req.body);
    res.status(201).json(commission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a commission (PATCH)
// const updateCommission = async (req, res) => {
//   console.log(res,"Aman")
//   try {
//     const commission = await Commission.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//     if (!commission) {
//       return res.status(404).json({ error: "Commission not found" });
//     }
//     res.json(commission);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };


const updateCommission = async (req, res) => {
 
  
  try {
    let filter = null;

    // 1) Check if MongoDB _id is provided
    
    // 2) Otherwise, use custom id field
     if (req.body.id) {
      filter = { id: req.body.id };
    }else if (req.body._id) {
      filter = { _id: req.body._id };
    } 
   
    

    // If nothing provided, return error
    if (!filter) {
      return res.status(400).json({ error: "No id or _id provided" });
    }

    // Find and update
    const commission = await Commission.findOneAndUpdate(
      filter,
      req.body,
      { new: true, runValidators: true }
    );

    if (!commission) {
      return res.status(404).json({ error: "Commission not found" });
    }

    res.json(commission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};





// Delete a commission
const deleteCommission = async (req, res) => {
  try {
    const commission = await Commission.findByIdAndDelete(req.params.id);
    if (!commission) {
      return res.status(404).json({ error: "Commission not found" });
    }
    res.json({ message: "Commission deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getCommissions, createCommission, updateCommission, deleteCommission };
