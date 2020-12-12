const router = require("express").Router();
const db = require("../database/connect");

router.get("/", (req, res) => {
    if (req.session.usuario) {
        return res.redirect("/home");
    }
    return res.render("index");
});

router.get("/e:errorID", (req, res) => {
    if (req.session.usuario) {
        return res.redirect("/home");
    }
    if (req.params.errorID == "0") {
        return res.render("index", {
            error: "ocurrio un error, intentelo nuevamente",
        });
    }
    if (req.params.errorID == "1") {
        return res.render("index", {
            error: "El usuario y/o contraseña son incorrectos",
        });
    }
    return res.redirect("/");
});

router.post("/logIn", (req, res) => {
    if (!req.body.user || !req.body.psw) {
        res.redirect("/");
    }
    db.query(
        "select * from users where user=? and psw=?",
        [req.body.user, req.body.psw],
        (err, result) => {
            if (err) {
                return res.redirect("/e0");
            }
            if (result == "") {
                return res.redirect("/e1");
            }
            req.session.usuario = req.body.user;
            return res.redirect("/home");
        }
    );
});

router.get("/home", (req, res) => {
    if (!req.session.usuario) {
        return res.redirect("/");
    }
    db.query("select * from ducks", (err, ducks) => {
        if (err) {
            return res.render("home", {
                error:
                    "ocurrio un error al obtener la informacion, intentelo mas tarde",
            });
        }
        db.query("select * from catcolors", (err, colors) => {
            if (err) {
                return res.render("home", {
                    error:
                        "ocurrio un error al obtener la informacion, intentelo mas tarde",
                });
            }
            let colorArray = [];
            ducks.forEach((duck) => {
                colorArray.push(
                    colors.find((color) => duck.idDuckColors == color.idColors)
                );
            });
            return res.render("home", { data: ducks, color: colorArray });
        });
    });
});

router.get("/home/e:errorID", (req, res) => {
    if (!req.session.usuario) {
        return res.redirect("/");
    }
    db.query("select * from ducks", (err, ducks) => {
        if (err) {
            return res.render("home", {
                error:
                    "ocurrio un error al obtener la informacion, intentelo mas tarde",
            });
        }
        db.query("select * from catcolors", (err, colors) => {
            if (err) {
                return res.render("home", {
                    error:
                        "ocurrio un error al obtener la informacion, intentelo mas tarde",
                });
            }
            let colorArray = [];
            ducks.forEach((duck) => {
                colorArray.push(
                    colors.find((color) => duck.idDuckColors == color.idColors)
                );
            });
            if (req.params.errorID == 0) {
                return res.render("home", {
                    type: "warning",
                    error: "Ocurrio un error, intentelo nuevamente",
                    data: ducks,
                    color: colorArray,
                });
            }
            if (req.params.errorID == 1) {
                return res.render("home", {
                    type: "success",
                    error: "Se a eliminado el registro con exito",
                    data: ducks,
                    color: colorArray,
                });
            }
            if (req.params.errorID == 2) {
                return res.render("home", {
                    type: "success",
                    error: "Registro exitoso",
                    data: ducks,
                    color: colorArray,
                });
            }
            if (req.params.errorID == 3) {
                return res.render("home", {
                    type: "success",
                    error: "Registro actualizado con exito",
                    data: ducks,
                    color: colorArray,
                });
            }
            if (req.params.errorID == 4) {
                return res.render("home", {
                    type: "warning",
                    error: "No se encontro el registro",
                    data: ducks,
                    color: colorArray,
                });
            }
            return res.render("home", { data: ducks, color: colorArray });
        });
    });
});

router.get("/newRegistry/e:errorID", (req, res) => {
    if (!req.session.usuario) {
        return res.redirect("/");
    }
    db.query("select * from catcolors", (err, colors) => {
        if (err) {
            return res.redirect("/home/e0");
        }
        db.query("select * from hats", (err, hats) => {
            if (err) {
                return res.redirect("/home/e0");
            }
            if (req.params.errorID == 0) {
                return res.render("registro", {
                    type: "warning",
                    error: "Ocurrio un error, intentelo nuevamente",
                    colores: colors,
                    sombreros: hats,
                });
            }
            if (req.params.errorID == 1) {
                return res.render("registro", {
                    type: "warning",
                    error: "No deje espacios en blanco",
                    colores: colors,
                    sombreros: hats,
                });
            }
            if (req.params.errorID == 2) {
                return res.render("registro", {
                    type: "info",
                    error: "Ya existe un registro con ese nombre",
                    colores: colors,
                    sombreros: hats,
                });
            }
            return res.redirect("/newRegistry");
        });
    });
});

router.get("/newRegistry", (req, res) => {
    if (!req.session.usuario) {
        return res.redirect("/");
    }
    db.query("select * from catcolors", (err, colors) => {
        if (err) {
            return res.redirect("/home/e0");
        }
        db.query("select * from hats", (err, hats) => {
            if (err) {
                return res.redirect("/home/e0");
            }
            return res.render("registro", { colores: colors, sombreros: hats });
        });
    });
});

router.post("/change", (req, res) => {
    if (!req.session.usuario) {
        return res.redirect("/");
    }
    if (!req.body.id) {
        return res.redirect("/home");
    }
    db.query(
        "select * from ducks where idDuck=?",
        [req.body.id],
        (err, duck) => {
            if (err) {
                return res.redirect("/home/e0");
            }
            db.query("select * from catcolors", (err, colors) => {
                if (err) {
                    return res.redirect("/home/e0");
                }
                db.query("select * from hats", (err, hats) => {
                    if (err) {
                        return res.redirect("/home/e0");
                    }
                    return res.render("registro", {
                        pato: duck,
                        colores: colors,
                        sombreros: hats,
                    });
                });
            });
        }
    );
});

router.get("/close", (req, res) => {
    if (!req.session.usuario) {
        return res.redirect("/");
    } else {
        req.session.destroy();
        return res.redirect("/");
    }
});

module.exports = router;
