import db from '../models';
export const houseController = {};

houseController.post = (req, res) => {
    const { decoded } = req;
    const house = new db.House();
    house.creator = decoded;
    house.votes.push({ vote: 1, creator: decoded });
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

houseController.getOne = (req, res) => {
    const { id } = req.params;
    db.House.findById(id)
        .then( house => {
            if(house === null) {
                return res.status(404).json({
                    success: false,
                    error: `Not Found: No house with id: '${id}'`
                })
            }
            return res.status(200).json({
                success: true,
                data: house
            });
        }).catch( err => {
        return res.status(500).json({
            message: err
        });
    });
};

houseController.submitVote = (req, res) => {
    const { params: { id }, body, decoded } = req;
    db.House.findByIdAndUpdate({_id: id},
        { "$push": { votes: { ...body, creator: decoded }} },
        (error, data) => {
            if(error) {
                return res.status(500).json({
                    success: false,
                    error
                });
            }
            if(body.vote !== 1 || body.vote !== 1) {
                return res.status(422).json({
                    success: false,
                    error: 'Invalid Data: vote must be 1 or -1 only.'
                });
            }
            if(data === null){
                return res.status(404).json({
                    success: false,
                    error: `House with id: '${id}' not found.`
                });
            }
            return res.status(200).json({
                success: true,
                data
            })
    })
};

export default houseController;