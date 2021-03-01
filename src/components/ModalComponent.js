import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles((theme) => ({
    typography: {
        fontFamily: ['Montserrat']
    },
    paper: {
        fontFamily: 'Montserrat',
        position: 'absolute',
        width: '80%',
        backgroundColor: '#42426A', //theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        borderRadius: 20,
        color: 'white'
    },
    container: {
        color: 'white'
    },
    head: {
        color: 'black',
        fontSize: 'medium',
        fontWeight: 'bold'
    },
    rowelement: {
        color: 'white'
    }
}));

const columns = [
    { id: 'OrderID', label: 'OrderID', minWidth: 170 },
    { id: 'Item', label: 'Item', minWidth: 100 },
    {
        id: 'Priority',
        label: 'Population',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US')
    },
    {
        id: 'City',
        label: 'City',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US')
    },
    {
        id: 'Dispatched',
        label: 'Dispatched',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2)
    },
    {
        id: 'Shipped',
        label: 'Shipped',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2)
    },
    {
        id: 'OrderTime',
        label: 'OrderTime',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2)
    },
    {
        id: 'DispatchTime',
        label: 'DispatchTime',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2)
    },
    {
        id: 'ShipTime',
        label: 'ShipTime',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2)
    },
    {
        id: 'TimeTaken',
        label: 'TimeTaken',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2)
    }
];

const ModalComponent = ({ data }) => {
    const classes = useStyles();
    const [packages, setPackage] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        var arr = [];

        for (var i = 0; i < data.length; ++i) {
            var json_data = {
                OrderID: data[i].gsx$orderid.$t,
                Item: data[i].gsx$item.$t,
                Priority: data[i].gsx$priority.$t,
                City: data[i].gsx$city.$t,
                Dispatched: data[i].gsx$orderdispatched.$t,
                Shipped: data[i].gsx$ordershipped.$t,
                OrderTime: data[i].gsx$ordertime.$t,
                DispatchTime: data[i].gsx$dispatchtime.$t,
                ShipTime: data[i].gsx$shippingtime.$t,
                TimeTaken: data[i].gsx$timetaken.$t
            };
            arr.push(json_data);
            setPackage(arr);
        }
    }, [data]);

    if (data === null)
        return (
            <div>
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: ' 50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                    className={classes.paper}
                >
                    <h2 id="simple-modal-title">Order Status Table</h2>
                    <p id="simple-modal-description">No data...Try Again</p>
                </div>
            </div>
        );
    else {
        return (
            <div>
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: ' 50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                    className={classes.paper}
                >
                    <TableContainer className={classes.container}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{
                                                minWidth: column.minWidth
                                            }}
                                            className={classes.head}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {packages
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((row) => {
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.code}
                                            >
                                                {columns.map((column) => {
                                                    const value =
                                                        row[column.id];
                                                    return (
                                                        <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                            className={
                                                                classes.rowelement
                                                            }
                                                        >
                                                            {column.format &&
                                                            typeof value ===
                                                                'number'
                                                                ? column.format(
                                                                      value
                                                                  )
                                                                : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[9]}
                        component="div"
                        count={packages.length}
                        rowsPerPage={9}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </div>
            </div>
        );
    }
};
export default ModalComponent;
