import User from "../models/user";

export const getTest = (ctx: any) => {
    ctx.body = 'Testing';
}

export const postTest = async (ctx: any) => {
    let user = ctx.request.body;

    if (typeof user.email !== 'string' || typeof user.firstName !== 'string' || typeof user.lastName !== 'string') {
        ctx.throw(400, 'Invalid info!');
    }

    try {
        await User.insertMany([{ email: user.email, firstName: user.firstName, lastName: user.lastName }]);
    }

    catch(e) {
        console.log(e.errmsg);
        ctx.throw(400, 'Email already exists in the database!');
    }

    ctx.response.body = 'Done!';
}