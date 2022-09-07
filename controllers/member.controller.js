const {Member} = require("../db/models");

exports.listMembers = async (req, res) => {

    req.query.page ? page = req.query.page : page = 0;
    let size = 10;

    //block try catch; try to work with some instructions, catch to return an mistake in case it exists
    try {
        //Instruction to find all the members in the database
        const allMembers = await Member.findAndCountAll({
            limit: size,
            offset: page ? page * size : 0,
        });

        let limit = Math.floor(allMembers.count / size);

        let next = (Number(page) + 1 > limit) 
            ? null 
            : `http://localhost:3000/members?page=${Number(page)+1}`;

        let prev = (Number(page) - 1 < 0) 
            ? null 
            : `http://localhost:3000/members?page=${Number(page)-1}`;

        //Response
        return res.status(200).json({
            members: allMembers.rows,
            prev,
            next
        });
    } catch (err) { res.status(500).json(err); }
};

exports.listMembersAttributes = async (req, res) => {
    //block try catch; try to work with some instructions, catch to return an error in case it exists
    try {
        //Instruction to find some attributes of the members in the database
        const allMembers = await Member.findAll({
            attributes: ['nameMember', 'image']
        });
        //response
        res.json(allMembers)
    } catch (err) { res.status(500).json(err); }
};

exports.createMember = async (req, res) => {
    //block try catch; try to work with some instructions, catch to return an mistake in case it exists
    try {
        //data of the new member
        const { nameMember, facebookUrl, instagramUrl, linkedinUrl, image, description } = req.body;
        //condition to ensure about the type of the data
        if(typeof(nameMember) != 'string'){
            res.status(400).json({msg: 'The name must to be a string'});
        }
        //Instruction to create a member in the database
        const newMember = await Member.create({
            nameMember,
            facebookUrl,
            instagramUrl,
            linkedinUrl,
            image,
            description
        });
        //instruction to save the new member in the data base
        await newMember.save();
        //response
        res.status(201).json('Member created successfully');
    } catch (err) { res.status(500).json(err); }
}

exports.editMember = async (req, res) => {
    //instruction to obtain and save the id of the member
    const {id} = req.params;
    //data to be updated
    let { nameMember, facebookUrl, instagramUrl, linkedinUrl, image, description } = req.body;

    //object to store the new date
    let dataToUpdate = {}
    //validations
    if (nameMember != undefined) { dataToUpdate.nameMember = nameMember };
    if (facebookUrl != undefined) { dataToUpdate.facebookUrl = facebookUrl };
    if (instagramUrl != undefined) { dataToUpdate.instagramUrl = instagramUrl };
    if (linkedinUrl != undefined) { dataToUpdate.linkedinUrl = linkedinUrl };
    if (image != undefined) { dataToUpdate.image = image };
    if (description != undefined) { dataToUpdate.description = description };
    
    //block try catch; try to work with some instructions, catch to return an mistake in case it exists
    try {
        //instruction to find the member in the database with the primary key (id)
        const member = await Member.findByPk(id);
        //validation to ensure that the member exists
        if (!member) {
            //response
            res.status(404).json({ msg: "Member doesn't exist" });
        }
        //instruction to update the information of the member
        await member.update(dataToUpdate);
        //response
        return res.status(200).json({
            member: member
        })
    } catch (err) { res.status(500).json(err); }
}

exports.deleteMember = async (req, res) => {
    //block try catch; try to work with some instructions, catch to return an mistake in case it exists
    try {
        //instruction to obtain and save the id of the member
        const {id} = req.params;
        //instruction to find the member in the database with the primary key (id)
        const member = await Member.findByPk(id);
        //validation to ensure that the member exists
        if (!member) {
            //response
            res.status(404).json({ msg: "Member doesn't exist" });
        }
        //instruction to delete the member of the database
        await member.destroy();
        //response
        return res.status(200).json({
            member: member
        })
    } catch (err) { res.status(500).json(err); }
}