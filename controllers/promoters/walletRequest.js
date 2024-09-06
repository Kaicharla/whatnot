const wallet=require("../../models/wallet");
const WalletRequest=require("../../models/walletRequest");
const Promoter=require("../../models/promoters"); 

// add Promoter Wallet Request
exports.addPromoterWalletRequest = async function (req, res) {
    const promoterId=req.userId;
    const amount=req.body.amount;
    console.log(promoterId)
  try {
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    const logDate = istDateTime.toISO({ includeOffset: true });
    const time = istDateTime.toFormat("hh:mm a");

    const promoter = await Promoter.findOne(
      { _id: promoterId },
        "name wallet notification_bell fcmToken accountNumber"
    );
    if(promoter ){
        //console.log(promoter,promoter.wallet,amount,promoter._id);
       // console.log(promoter.accountNumber!="" , promoter.accountNumber,promoter,"jkjkjjjjj")
        if(promoter.accountNumber!="" && promoter.accountNumber){

        if (parseFloat(promoter.wallet) >= parseFloat(req.body.amount)) {
            const walletRequest = await WalletRequest.create({
              date: logDate.slice(0, 10),
              time,
              promoterId: promoter._id,
              promoterName: promoter.name,
              amount: req.body.amount,
              logCreatedDate: logDate,
              logModifiedDate: logDate,
            });
            await Promoter.findByIdAndUpdate(
              { _id: promoter._id },
              {
                $set: {
                  wallet: (
                    parseFloat(promoter.wallet) - parseFloat(req.body.amount)
                  ).toFixed(2),
                  logModifiedDate: logDate,
                },
              },
              { new: true }
            );
            return res.status(200).json({ message: "Withdrawal request submitted" });
          } else {
            res
              .status(400)
              .json({ message: "Insufficient funds in the wallet for withdrawal" });
          }
        }
        else{
          return res.status(400).json({ message: "please add bank account details" });
        }
    
    }else{
        return res.status(400).json({ message: "user not found" });
  }
    
    
  
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Something went wrong" });
  }
};

// add Promoter Wallet Request
exports.getAllWithdrawalRequest = async function (req, res) {
  try {
    const promoter = await Promoter.findOne({ _id: req.userId }, "wallet");
    const walletRequest = await WalletRequest.find({
      promoterId: req.userId,
    }).sort({ logCreatedDate: -1 });
    if (walletRequest) {
      return res.status(200).json({
        message: "Successful",
        walletRequest,
        wallet: (promoter && promoter.wallet) || 0,
      });
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Something went wrong" });
  }
};
