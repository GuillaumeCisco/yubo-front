import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TableFooter,
  TablePagination, TextField
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import {isEmpty} from 'lodash';

import {API_URL} from "../../../config";
import TablePaginationActions from '../../../utils/pagination';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const UsersList = () => {

  const classes = useStyles();

  const [hasError, setErrors] = useState(false);
  const [users, setUsers] = useState({});
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [search, setSearch] = useState('');
  const [isDeletedFilter, setIsDeletedFilter] = useState(false);

  const history = useHistory();

  async function fetchData(page=1, limit=5, filters={}) {
    let url = `${API_URL}/users?page=${page + 1}&limit=${limit}`;

    if (!isEmpty(filters)) {
      Object.entries(filters).forEach(([k, v]) => {
        url += `&${k}=${v}`;
      })
    }

    const res = await fetch(url);
    res
      .json()
      .then(res => setUsers(res))
      .catch(err => setErrors(err));
  }

  useEffect(() => {
    const filters = {};
    if (isDeletedFilter) {
      filters.isDeleted = true;
    }
    if (search) {
      filters.search = search;
    }

    fetchData(page, rowsPerPage, filters);
  }, [page, rowsPerPage, isDeletedFilter, search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const select = (id) => () => {
    history.push(`/users/${id}`);
  }

  const handleIsDeletedFilter = () => {
    setIsDeletedFilter(!isDeletedFilter);
  }

  const handleSearch = (e) => {
    setSearch(e.target.value);
  }

  return (<>
    <div>
      <FormControl component="fieldset" >
        <FormLabel component="legend">Search</FormLabel>
        <FormGroup row>
          <TextField id="standard-basic" label="search" value={search} onChange={handleSearch} />
        </FormGroup>
      </FormControl>
      <FormControl component="fieldset" >
        <FormLabel component="legend">Filters</FormLabel>
        <FormGroup row>
          <FormControlLabel
              control={<Checkbox checked={isDeletedFilter} onChange={handleIsDeletedFilter} name="isDeleted" />}
              label="is Deleted"
          />
        </FormGroup>
      </FormControl>
    </div>
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>id</TableCell>
            <TableCell align="right">name</TableCell>
            <TableCell align="right">username</TableCell>
            <TableCell align="right">country</TableCell>
            <TableCell align="right">city</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users && users.data && users.data.map((row) => (
              <TableRow key={row.id} onClick={select(row.id)}>
                <TableCell component="th" scope="row">{row.id}</TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.username}</TableCell>
                <TableCell align="right">{row.country}</TableCell>
                <TableCell align="right">{row.city}</TableCell>
              </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={3}
                count={users.count}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
    </>);
}

export default UsersList;
