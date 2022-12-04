const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const db = require('./connection')
const response = require('./response')

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('api siap')
})

app.get('/mahasiswa', (req, res) => {
  const sql = "SELECT * FROM mahasiswa"
  db.query(sql, (error, result) => {
    if (error) throw error
    response(200, result, "get all mahasiswa", res)
  })
})

app.get('/mahasiswa/:id', (req, res) => {
  const id = req.params.id
  const sql = `SELECT * FROM mahasiswa WHERE id = ${id}`
  db.query(sql, (error, result) => {
    if (error) throw error
    if (result.affectedRows) 
    response(200, result, "get mahasiswa by id", res)
  })
})


app.post('/mahasiswa', (req, res) => {
  const { nim, namaLengkap, kelas, alamat } = req.body
  const sql = `INSERT INTO mahasiswa (nim, nama_lengkap, kelas, alamat) VALUES ('${nim}', '${namaLengkap}', '${kelas}',' ${alamat}')`
  db.query(sql, (error, result) => {
    if (error) response(500, "invalid", "error", res)
    if (result?.affectedRows) {
      const data = {
        isSuccess: result.affectedRows,
        id: result.insertId
      }
      response(200, data, "Data added", res)
    }
  })
})

app.put('/mahasiswa', (req, res) => {
  const { nim, namaLengkap, kelas, alamat } = req.body
  const sql = `UPDATE mahasiswa SET nama_lengkap = '${namaLengkap}', kelas = '${kelas}', alamat = '${alamat}' WHERE nim = ${nim}`
  db.query(sql, (error, result) => {
    if (error) response(500, "invalid", "error", res)
    if (result?.affectedRows) {
      const data = {
        isSuccess: result.affectedRows,
        message: result.message
      }
      response(200, data, "updated", res)
    } else {
      response(404, "user not found", "eeror", res)
    }
  })
})

app.delete('/mahasiswa', (req, res) => {
  const { nim } = req.body
  const sql = `DELETE FROM mahasiswa WHERE nim = ${nim}`
  db.query(sql, (error, result) => {
    if (error) response (500, "invalid", "error", result)
    if (result?.affectedRows) {
      const data = {
        isDeleted: result.affectedRows
      }
      response(200, data, "Data Berhasil Dihapus", res)
    } else {
       response(404, "user not found", "error", res)
    }
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})