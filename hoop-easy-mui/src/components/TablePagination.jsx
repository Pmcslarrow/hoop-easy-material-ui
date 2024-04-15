import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import DialogBox from './DialogBox';
import SubmitGameData from './SubmitGameData';
import VerifyGame from './VerifyGame';
import { createTeammateArrayFromJson } from '../utils/jsonFunc';


function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};



export default function CustomPaginationActionsTable({rows, columnNames, isMyGames, user, setRefresh, refresh}) {
    const theme = useTheme()
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(4);
    const [selectedGame, setSelectedGame] = React.useState()
    const [selectedComponent, setSelectedComponent] = React.useState()
    const [dialogOpen, setDialogOpen] = React.useState(false);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (game) => {
        setSelectedGame(game)
        if (game.col1 === 'confirmed') {
            setSelectedComponent(<SubmitGameData user={user} game={game} refresh={refresh} setRefresh={setRefresh} handleClose={handleClose}/>)
            setDialogOpen(true)
        }

        if (game.col1 === 'verification') {
            setSelectedComponent(<VerifyGame user={user} game={game} refresh={refresh} setRefresh={setRefresh} handleClose={handleClose}re/>)
            setDialogOpen(true)
        }
    }

    const handleClose = () => {
        setDialogOpen(false)
    };

    const createUsefulSentence = (status) => {
        switch(status) {
            case 'pending':
                return 'Waiting for people to join'
            case 'confirmed':
                return 'Click to submit scores'
            case 'verification':
                return 'Click to verify the game'
            default:
                return status
        }
    }

    return (
        <TableContainer component={Paper}>
        <DialogBox Component={selectedComponent} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} handleClose={handleClose}/>
        <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
            <TableHead>
                <TableRow>
                {columnNames.map((column, i) => ( 
                    <TableCell
                    key={Math.random().toString(16).slice(2)}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    >
                    {column.label}
                    </TableCell>
                ))}
                </TableRow>
            </TableHead>
            <TableBody>
            {(rowsPerPage > 0
                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : rows
            ).map((row) => (
                <TableRow
                    {...(isMyGames ? { sx: {
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: theme.palette.secondary.lightBlue,
                        },
                    }} : {})}
                    key={Math.random().toString(16).slice(2)}
                    onClick={() => handleRowClick(row)}
                >
                    <TableCell component="th" scope="row" >
                        {isMyGames ? createUsefulSentence(row.col1) : row.col1}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right" >
                        {row.col2}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right">
                        {row.col3}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right">
                        {row.col4}
                    </TableCell>
                </TableRow>
            ))}
            {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
                </TableRow>
            )}
            </TableBody>
            <TableFooter>
            <TableRow>
                <TablePagination
                rowsPerPageOptions={[5]}
                colSpan={3}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                    select: {
                    inputProps: {
                        'aria-label': 'rows per page',
                    },
                    native: true,
                    },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                />
            </TableRow>
            </TableFooter>
        </Table>
        </TableContainer>
    );
}
