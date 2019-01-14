const express = require('express');
const admin = express.Router();
const connection = require('../helper/db');

// Récupération d'un admin (pour vérification avant le POST) - OK
admin.get('/admin', (req, res) => {
  connection.query('SELECT * FROM admin WHERE admin.admin_id = ?',
  req.body.id, (err, result) => {
    if (err) res.status(500).send(err);
    if (result) res.status(200).send(result);
  })
})

// Récupération de tous les admin - OK
admin.get('/admin/all', (req, res) => {
  connection.query('SELECT * FROM admin', (err, result) => {
    if (err) res.status(500).send("Erreur lors de la récupération des admin");
    if (result) res.status(200).send(result);
  })
})

// Suppression d'un administrateur - OK
admin.delete('/admin/:id', (req, res) => {
  connection.query('DELETE FROM admin WHERE id = ?', req.params.id, (err, result) => {
    if (err) res.status(500).send("Erreur lors de la suppression");
    if (result) res.status(200).send("Admin supprimé");
  })
})

module.exports = admin;