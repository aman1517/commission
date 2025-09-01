const User = require("../models/userModel");

// @desc    Get all users
// @route   GET /api/users
// @access  Public
// const getUsers = async (req, res) => {
//   const users = await User.find();
//   res.json(users);
// };
const getUsers = async (req, res) => {
  try {
    const {userName,limt,seachData,status } = req.query;
    let filter = {};
    
    let query=false

    if (userName) filter.userName = userName; // match exact username
    if(status && status!=='undefined' && status!=="null") filter.status=status
    if(seachData && seachData!=='undefined' && seachData!=='null'){
     query = {
       $or: [
      { name:   { $regex: seachData, $options: "i" } },
      { email:  { $regex: seachData, $options: "i" } },
      { phone:  { $regex: seachData, $options: "i" } },
      { userName: { $regex: seachData, $options: "i" } }
    ]
     };
       
    }
       let limtData=limt?limt:10
        const users = await User.find(query?query:filter).sort({ createdAt: -1 }).limit(limtData);
        const totalPosp= await User.countDocuments()
      
    res.json({users:users,totalPosp:totalPosp});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginDetails=async(req,res)=>{
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    if(userName==process.env.AccountsUserName  && password==process.env.AccountPassword){

      res.json({isLogin:"Account",status:true,message: "Login successful",})
      return;

    }else if(userName==process.env.AdminUserName && password==process.env.AdminPassword){
       res.json({isLogin:"Admin",status:true,message: "Login successful",})
      return;

    }

    // Check if user exists
    const user = await User.findOne({ userName, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Success (don’t return password!)
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        status: user.status
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
}



// @desc    Create a user
// @route   POST /api/users
// @access  Public
// const createUser = async (req, res) => {
//   const data = req.body;
//   console.log(data,"Aman")
//   const user = await User.create( data );
//   res.status(201).json(user);
// };

// const createUsers = async (req, res) => {
//   try {
//     const data = req.body; // This should be an array of user objects
//     console.log(data, "Incoming Users");

//     // Create multiple users
//     const users = await User.insertMany(data);

//     res.status(201).json(users);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// Checking duplicate when multiple Posp created

const createUsers = async (req, res) => {
  try {
    let  data = req.body; // array of users

    if(data?.userName){
      data=[data]
    }

   
    
    const uniqueFields = ["email", "userName", "phone"]; // fields that must be unique

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "No users provided" });
    }

    // Collect all values for unique fields from incoming data
    const uniqueFieldValues = {};
    uniqueFields.forEach(field => {
      uniqueFieldValues[field] = data.map(u => u[field]);
    });

    // Build $or query to check for duplicates in DB
    const orQueries = uniqueFields.map(field => ({
      [field]: { $in: uniqueFieldValues[field] }
    }));

    // Find all existing users that match any unique field
    const existingUsers = await User.find({ $or: orQueries }).lean();

    // Make a set for quick lookup
    const existingSet = {};
    uniqueFields.forEach(field => {
      existingSet[field] = new Set(existingUsers.map(u => u[field]));
    });

    // Separate success and failed users
    const success = [];
    const failed = [];

    data.forEach(user => {
      const duplicateFields = uniqueFields.filter(field =>
        existingSet[field].has(user[field])
      );

      if (duplicateFields.length > 0) {
        failed.push({
          data: user,
          reason: `Duplicate on ${duplicateFields.join(", ")}`
        });
      } else {
        success.push(user);
      }
    });

    // Insert only non-duplicate users
    let insertedDocs = [];
    if (success.length > 0) {
      insertedDocs = await User.insertMany(success);
    }

    res.status(207).json({
      message: "Batch insert completed with duplicate checks",
      successCount: insertedDocs.length,
      failedCount: failed.length,
      success: insertedDocs,
      failed
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,       // return the updated document
      runValidators: true // validate according to schema
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getUsers, updateUser,createUsers,loginDetails };
