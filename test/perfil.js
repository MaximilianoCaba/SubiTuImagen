const expect = require("chai").expect;
const request = require("request");
const base_url = "http://localhost:8000";
const express = require('express');
const mongoose = require('mongoose');

const Usuario = require('./models/usuario');
const Image = require('./models/image');
const Alerta = require('./models/alerta')

var mockgoose = require('mockgoose');
mockgoose(mongoose);

const imagenRepository = require('../modules/repository/imagen');
const usuarioRepository = require('../modules/repository/user');

const perfilService = require('../modules/services/user_routes/perfil')


describe("Buscador de imagenes", function () {

    before(function (done) {
        mongoose.connect('mongodb://localhost/test', function (err) {
            mockgoose(mongoose);
            done(err);
        });
    });


    beforeEach(function (done) {

        mockgoose.reset();


        Usuario.Usuario.create(
            {
                _id: 1234,
                username: "maxi",
                password: "wasfagtatatat",
                email: "maxi@maxi.com",
                avatar: "q1241515151.jpg",
                userdate: "11/10/2016",
                role: "admin_role",
                alerts: 3,
                facebook: {
                    id: "12415125132452135",
                    token: "32ajbvias9aug9a9g9saugasg",
                },
                google: {
                    id: "21649871649164921",
                    token: "asnfhabf7yaf89afb7safba97b97safb",
                }
            }, function (error, usuario1) {
                if (error) {
                    console.log('Error creating documents in beforeEach: ' + error);

                }


                Image.Image.create(
                    {
                        _id: 1,
                        title: "racing club",
                        creator: 1234,
                        name: "97762q2427radad8.jpg",
                        extension: "jpg",
                        coment: "esto es un comentario",
                        dateupload: "11/10/2016",
                        hourupload: "21:20",
                        cantComents: 2,
                        likes: 1,
                        category: "Deporte",
                        tags: ["racing", "avellaneda"]

                    },
                    {
                        _id: 2,
                        title: "Independiente",
                        creator: 1234,
                        name: "97762q2427r8.jpg",
                        extension: "jpg",
                        coment: "esto es un comentario",
                        dateupload: "11/10/2016",
                        hourupload: "21:30",
                        cantComents: 5,
                        likes: 0,
                        category: "Deporte",
                        tags: ["independiente", "avellaneda"]

                    }, function (error, imagen1, imagen2) {
                        if (error) {
                            console.log('Error creating documents in beforeEach: ' + error);

                        }

                        Alerta.Alerta.create(
                            {
                                _id: 1,
                                message: "alerta",
                                user: 1234,
                                date: "11/10/2016",
                                hour: "13:34",

                            }, function (error, alerta1) {
                                if (error) {
                                    console.log('Error creating documents in beforeEach: ' + error);

                                }

                                done()
                            })

                    })

            });

    });

    var url = "/app/imagenes/search"

    it("returns status 200", function (done) {
        request(base_url + url, function (error, response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });


    it("busco un usuario por su id", function (done) {
        Usuario.findById(1234, (err, usuario) => {
            expect(usuario.username).to.equal("maxi");
            done()
        })

    });

    it("Quiero ver mi perfil personal", (done) => {

        perfilService.verPerfilPersonal(1234, (err, alertas, usuario) => {
            console.log(alertas);
            console.log(usuario);

            expect(usuario.username).to.equal("maxi");
            expect(alertas.length).to.equal(1);
            done();

        })

    })

});