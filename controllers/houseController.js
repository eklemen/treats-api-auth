import db from './../models';
import Vote from '../models/vote';
export const houseController = {};

houseController.post = (req, res) => {
    // const { userId } = req.body;
    const house = new db.House();
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
    // TODO: figure out correct popualate
        // .populate({
        //     path: '_votes',
        //     model: 'Vote'
        // })
        .then( houses => {
            return res.status(200).json({
                success: true,
                data: houses
            });
        }).catch( err => {
        return res.status(500).json({
            message: err
        });
    });
};

export default houseController;