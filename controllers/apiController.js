let config = require("../config");
let pgp = require("pg-promise")();
let db = pgp(config.getDbConnectionString());

module.exports = (app) => {
    app.get("/api/rooms",  (req, res) => {
        db.any("SELECT DISTINCT room FROM controller_sensor")
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    description: "Can’t find any room",
                    error: err,
                });
            });
    });

    app.get("/api/room/:number/sensors", function (req, res) {
        db.any(
            "SELECT sensor.sensorname FROM sensor INNER JOIN controller_sensor ON controller_sensor.id_sensor=sensor.id " +
            "WHERE controller_sensor.room=" + req.params.number + ":: varchar"
        )
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch(function (err) {
                return next(err);
            });
    });

    app.get("/api/controllers",  (req, res) => {
        db.any("SELECT * FROM controller")
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    description: "Can’t find any controllers",
                    error: err,
                });
            });
    });

    app.get("/api/controller_sensors/:controller_id",  (req, res) => {
        db.any("SELECT sensor.* from controller_sensor join sensor on id_sensor=sensor.id where id_controller=" + req.params.controller_id + ";")
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    description: "Can’t find any sensors for controller",
                    error: err,
                });
            });
    });

    //Ma ei leidnud kus tänased andmed on, aga tegin päringu mis võtab viimased sensorite andmed.
    app.get("/api/room44_data",  (req, res) => {
        db.any("with last_data as (SELECT controllersensorid, valuetype, max(date_time)\n" +
            "\tFROM public.data_archive where room='44' group by controllersensorid, valuetype)\n" +
            "select data_archive.* from last_data join data_archive on data_archive.controllersensorid=last_data.controllersensorid and last_data.max=data_archive.date_time\n" +
            " and last_data.valuetype=data_archive.valuetype;")
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    description: "Can’t find room 44 data",
                    error: err,
                });
            });
    });
}