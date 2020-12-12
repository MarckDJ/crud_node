const router = require("express").Router();
const db = require("../database/connect");

router.get("/info:id", (req, res) => {
    if (!req.session.usuario) {
        return res.redirect("/");
    }
    if (!req.params.id) {
        return res.redirect("/home");
    }
    var duckCol = [];
    var hatCol = [];
    db.query(
        "select * from ducks where idDuck=? limit 1",
        [req.params.id],
        (err, duck) => {
            if (err) {
                console.log(err);
                return res.redirect("/home/e0");
            }
            if (duck == "") {
                return res.redirect("/home/e0");
            }
            db.query("select * from hats where idHat=? limit 1", [
                duck[0].idDuckHat,
            ])
                .on("error", (err) => {
                    console.log(err);
                    return res.redirect("/home/e0");
                })
                .on("result", (hat) => {
                    db.query(
                        "select * from catcolors where idColors=? or idColors=? limit 2",
                        [duck[0].idDuckColors, hat.idHatColors]
                    )
                        .on("error", (err) => {
                            console.log(err);
                            return res.redirect("/home/e0");
                        })
                        .on("result", (color) => {
                            if (duckCol.length < 2 || hatCol.length < 2) {
                                if (
                                    color.idColors == duck[0].idDuckColors &&
                                    color.idColors == hat.idHatColors
                                ) {
                                    duckCol.push(color);
                                    hatCol.push(color);
                                } else if (
                                    color.idColors == duck[0].idDuckColors
                                ) {
                                    duckCol.push(color);
                                } else {
                                    hatCol.push(color);
                                }
                            }
                        })
                        .on("end", () => {
                            duckCol.push(duck[0]);
                            hatCol.push(hat);
                            db.query(
                                "select * from cathattype where idHatType=? limit 1",
                                [hat.idHatType]
                            )
                                .on("error", (err) => {
                                    console.log(err);
                                    return res.redirect("/home/e0");
                                })
                                .on("result", (type) => {
                                    hatCol.push(type);
                                })
                                .on("end", () => {
                                    console.log(duckCol, hatCol);
                                    return res.render("info", {
                                        pato: duckCol,
                                        hat: hatCol,
                                    });
                                });
                        });
                });
        }
    );
});

router.post("/new", (req, res) => {
    if (!req.session.usuario) {
        return res.redirect("/");
    }
    if (!req.body.nombre && !req.body.color && !req.body.hat) {
        return res.redirect("/home");
    }
    if (req.body.nombre == "" || !req.body.color || !req.body.hat) {
        return res.redirect("/newRegistry/e1");
    }
    console.log([req.body.nombre, req.body.color, req.body.hat]);
    db.query(
        "select * from ducks where idDuck=?",
        [req.body.nombre],
        (err, duck) => {
            if (err) {
                console.log(err);
                return res.redirect("/newRegistry/e0");
            }
            if (duck == "") {
                db.query(
                    "insert into ducks values(?,?,?)",
                    [req.body.nombre, req.body.color, req.body.hat],
                    (err) => {
                        if (err) {
                            console.log(err);
                            return res.redirect("/newRegistry/e0");
                        }
                        return res.redirect("/home/e2");
                    }
                );
            } else {
                return res.redirect("/newRegistry/e2");
            }
        }
    );
});

router.get("/delete:id", (req, res) => {
    if (!req.session.usuario) {
        return res.redirect("/");
    }
    if (!req.params.id) {
        return res.redirect("/home");
    }
    db.query("delete from ducks where idDuck=?", [req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.redirect("/home/e0");
        }
        return res.redirect("/home/e1");
    });
});

router.post("/update:id", (req, res) => {
    if (!req.session.usuario) {
        return res.redirect("/");
    }
    if (
        !req.params.id &&
        !req.body.nombre &&
        !req.body.color &&
        !req.body.hat
    ) {
        return res.redirect("/home");
    }
    if (req.body.nombre == "" || !req.body.color || !req.body.hat) {
        return res.redirect("/newRegistry/e1");
    }
    db.query(
        "update ducks set idDuck=?, idDuckColors=?, idDuckHat=? where idDuck=?",
        [req.body.nombre, req.body.color, req.body.hat, req.params.id],
        (err) => {
            if (err) {
                console.log(err);
                return res.redirect("/home/e0");
            }
            return res.redirect("/home/e3");
        }
    );
});

module.exports = router;
