const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const {sign} = require('jsonwebtoken');
const { validateToken } = require("../middlewares/AuthMiddleware");
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });
    res.json("SUCCESS");
  });
});

router.post("/login", async (request, response) => {
    const { username, password } = request.body;
    const user = await Users.findOne( { where: { username: username }});

    if (user) {
        bcrypt.compare(password, user.password).then((same) => {
            if (!same) {
                return response.json({ erorr: "Wrong username or password" });
            }
            const accessToken =sign({username: user.username, id:user.id}, "importantsecret" )
            return response.json({token: accessToken, username: username, id: user.id});
        });
    } else {
        return response.json({ error: "User does not exist" });
    }
});

router.get('/auth', validateToken, (req,res)=>{
  res.json(req.user)
})


router.get("/basicinfo/:id", async(req, res) => {
  const id = req.params.id
  const basicInfo = await Users.findByPk(id, {attributes: {exclude: ["password"]}})

  res.json(basicInfo)

})
module.exports = router;