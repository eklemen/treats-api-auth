import db from '../models';
export const houseController = {};

houseController.post = (req, res) => {
    const { decoded, body: { position } } = req;
    if(
        !position ||
        !position.lat ||
        !position.long
    ) {
        return res.status(422).json({
            success: false,
            error: 'Must provide a `position` object with `lat` and `long`'
        })
    }
    const house = new db.House();
    house.creator = decoded;
    house.votes.push({ vote: 1, creator: decoded });
    house.position = position;
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

// TODO prevent revotes from same person
houseController.submitVote = (req, res) => {
    const { params: { id }, body, decoded } = req;
    db.House.findOneAndUpdate(
        { _id: id, 'votes.creator': decoded },
        { "$addToSet": { 'votes': { vote: body.vote, creator: decoded }} },
        { new: true, upsert : true },
        (error, data) => {
            console.log('err=========', error);
            console.log('data=========', data);
            console.log('decoded=========', decoded);
            if(error) {
                return res.status(500).json({
                    success: false,
                    error
                });
            }
            if(body.vote !== 1 && body.vote !== -1) {
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
    // db.House.findOne(
    //     {_id: id},
    //     { 'votes': { $elemMatch: {creator: decoded} }},
    //     (error, house) => {
    //         if(error || !house) {
    //             return res.status(500).json({
    //                 success: false,
    //                 error
    //             });
    //         }
    //         const foundVote = house.votes[0];
    //         if(foundVote && foundVote.vote === body.vote) {
    //             const v = body.vote === 1 ? 'up' : 'down';
    //             return res.status(422).json({
    //                 success: false,
    //                 error: `You have already ${v}voted this house.`
    //             });
    //         }
    //
    //         house.update({ 'house.votes.creator': decoded }, { $set: {'house.votes.vote': body.vote}}, (err, response) => {
    //             console.log('RES', response);
    //             if(err) {
    //                 return res.status(500).json({
    //                     success: false,
    //                     error: err
    //                 });
    //             }
    //             return res.status(200).json({
    //                 success: true,
    //                 data: house
    //             })
    //         });
    //         // house.votes[0] = {
    //         //     ...foundVote,
    //         //     vote: body.vote
    //         // };
    //         // house.save((err, i) => {
    //         //     if(err) {
    //         //         console.log('errrrrrr', err);
    //         //         return res.status(300).json({
    //         //             success: false,
    //         //             error: err
    //         //         })
    //         //     }
    //         //     return res.status(200).json({
    //         //         success: true,
    //         //         data: house
    //         //     })
    //         // });
    //     }
    // );
};

export default houseController;