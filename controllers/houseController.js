import db from './../models';
export const houseController = {};

houseController.post = (req, res) => {
    const { userId } = req.body;
    const house = new db.House({
        _creator: userId
    });
    house.save().then( newHouse => {
        return res.status(200).json({
            success: true,
            data: newHouse
        })
    }).catch( err => {
        return res.status(500).json({
            message: err
        })
    })
};

houseController.getAll = (req, res) => {
    db.House.find({})
        .populate({
            path: '_votes',
            match: { 'isDeleted': false }
        })
        .then( house => {
            return res.status(200).json({
                success: true,
                data: house
            });
        }).catch( err => {
        return res.status(500).json({
            message: err
        });
    });
}

export default houseController;