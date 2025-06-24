import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import moment from "moment";

const Entries = () => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [entryList, setEntryList] = useState([]);
  const [deleteId, setDeleteId] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    id: 0,
    description: "",
    valueEntry: 1,
    dateEntry: "",
    isCredit: false,
  });

  const [editEntry, setEditEntry] = useState({
    id: 0,
    description: "",
    valueEntry: 1,
    dateEntry: "",
    isCredit: false,
  });

  const handleChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };
  const handleChangeEdit = (e) => {
    setEditEntry({ ...editEntry, [e.target.name]: e.target.value });
  };

  const handleConfirmOpen = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setDeleteId(0);
    setConfirmOpen(false);
  };

  const handleConfirmOpenEdit = (entry) => {
    setEditEntry(entry);
    setOpenEdit(true);
  };

  const handleAddEntry = async () => {
    try {
      // const api = axios.create({
      //   baseURL: "https://localhost:7094/api/Entry/Add",
      // });

      // const response = await axios
      //   .post({
      //     url:"https://localhost:7094/api/Entry/Add",
      //     withCredentials: false,
      //     // auth: {
      //     //     username: 'usuario',
      //     //     password: 'password'
      //     // },
      //     headers: {
      //       "Access-Control-Allow-Origin": "*",
      //       // "Access-Control-Allow-Headers": "Authorization",
      //       "Access-Control-Allow-Methods":
      //         "GET, POST, OPTIONS, PUT, PATCH, DELETE",
      //      // "Content-Type": "application/json",
      //        "content-type": "multipart/form-data; charset=utf-8",
      //        "accept": "application/json"
      //     },
      //     data: {
      //       id: 0,
      //       description: "teste 123",
      //       valueEntry: 10,
      //       dateEntry: "2025-06-10",
      //       isCredit: true,
      //     },
      //     method: "POST",
      //   })
      //   .then((resp) => {
      //     console.log(resp);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });

      // const response = await axios.post(
      //    `https://localhost:7094/api/Entry/Add`,
      //    {
      //      id: 0,
      //      description: "teste 123",
      //      valueEntry: 11.0,
      //      dateEntry: "2025-06-10",
      //      isCredit: true,
      //    }
      //    ,
      //    {
      //      headers: {
      //        "Content-Type": "application/json",
      //      },
      //    }
      //  ).catch(function (errror){
      //    console.log("ERRRRRRRRRRRRRRRRRRO " + errror);
      //  });

      newEntry.valueEntry = parseFloat(newEntry.valueEntry);
      newEntry.dateEntry = moment().format("YYYY-MM-DD");
      console.log(newEntry.dateEntry);

      const response = await axios.post(
        `http://localhost:8080/api/Entry/Add`,
        newEntry
      );
      console.log(response);

      setEntryList([...entryList, response.data.result.value]);

      setNewEntry({
        id: 0,
        description: "",
        valueEntry: 1,
        dateEntry: "",
        isCredit: false,
      });

      handleClose();
    } catch (error) {
      console.log(error);
      console.log(`Ocorreu um erro ao tentar adicionar lançamento ${error}`);
      alert("Erro ao tentar adicionar o lançamento");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/Entry/Delete?id=${id}`);
      setEntryList(entryList.filter((p) => p.id !== id));
      handleConfirmClose();
    } catch (error) {
      console.log(`Ocorreu um erro ao tentar deletar ${error}`);
      alert("Erro ao tentar deletar o lançamento");
    }
  };

  const handleEditEntry = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/Entry/Update`,
        editEntry
      );

      setEntryList(
        entryList.map((p) =>
          p.id === editEntry.id ? response.data.result.value : p
        )
      );

      handleCloseEdit();
    } catch (error) {
      console.log(error);
      console.log(`Ocorreu um erro ao tentar atualizar lançamento ${error}`);
      alert("Erro ao tentar atualizar o lançamento");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  useEffect(() => {
      axios.get("http://localhost:8080/api/Entry/Get").then((response) => {
      console.log(response);
      setEntryList(response.data.result.value);
    });
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="60vh"
    >
      <div style={{display: "grid;", width:"100%", padding:"30px"}}>
        <div style={{padding:"30px", marginTop:"50px"}}>
          {/* <Box display="flex" justifyContent="flex-start"> */}
          <Button variant="contained" onClick={handleClickOpen}>
            Novo
          </Button>
          {/* </Box> */}
        </div>
        <div style={{width:"100%"}}>
          <TableContainer component={Paper} style={{ width: "100%" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Código</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entryList != null ? (
                  entryList.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{row.description}</TableCell>
                      <TableCell align="right">{row.valueEntry}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleConfirmOpen(row.id)}>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton onClick={() => handleConfirmOpenEdit(row)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <div>Loading...</div>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>Deseja deletar esse lançamento?</DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              handleDelete(deleteId);
            }}
            color="secondary"
            variant="container"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Novo lançamento</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="description"
            label="Descrição"
            type="text"
            fullWidth
            value={newEntry.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="valueEntry"
            label="Valor"
            type="text"
            fullWidth
            value={newEntry.valueEntry}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddEntry} color="primary" variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Editar lançamento</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="description"
            label="Descrição"
            type="text"
            fullWidth
            value={editEntry.description}
            onChange={handleChangeEdit}
          />
          <TextField
            margin="dense"
            name="valueEntry"
            label="Valor"
            type="text"
            fullWidth
            value={editEntry.valueEntry}
            onChange={handleChangeEdit}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleEditEntry} color="primary" variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Entries;
