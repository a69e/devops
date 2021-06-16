import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TableChartIcon from '@material-ui/icons/TableChart';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import GroupIcon from '@material-ui/icons/Group';
import { XGrid } from '@material-ui/x-grid';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
    Chart,
    ArgumentAxis,
    ValueAxis,
    LineSeries,
    ZoomAndPan,
} from '@devexpress/dx-react-chart-material-ui';


const useStyle = makeStyles((theme) => ({
    xgridStyle: {
        '& .BoldHeader': {
            fontSize: 'large',
            fontWeight: 'bold',
        }
    },
}));

export default function DataGrid(ticker) {

    const classes = useStyle();

    // set table height *********************************************************************
    const [divHeight, setDivHeight] = useState(500);

    useEffect(() => {
        const handleResize = () => {
            var newDivHeight = window.innerHeight - 200;
            if (divHeight != newDivHeight) {
                setDivHeight(newDivHeight)
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize)
    }, [])
    // end set table height *********************************************************************


    // handle tab change *********************************************************************
    const navigate = useNavigate();

    const handleChange = (event, newValue) => {
        navigate(newValue);
        if (newValue == 'history') {
            setTimeout(() => { document.getElementsByClassName('MuiDataGrid-main')[0].children[0].innerHTML = '' }, 0)
        }
    };
    // end handle tab change *********************************************************************


    // get ticker *********************************************************************
    const [symbol, setSymbol] = useState(ticker['ticker'])

    useEffect(() => {
        setSymbol(ticker['ticker'])
    }, [ticker])
    // end get ticker *********************************************************************


    // get history data *********************************************************************
    const [data, setData] = useState([])

    const getData = () => {
        axios.get('/' + symbol)
            .then((res) => {
                if (res.data !== 'No data' && res.data !== 'Unable to connect') {
                    let temp = res.data;
                    for (let i in res.data) {
                        temp[i]['_id'] = new Date(res.data[i]['_id']['$date']).toUTCString().replace(' 00:00:00 GMT', '').replace(/\w{3}, /, '')
                    };
                    setData(temp)
                };

            })
            .catch((error) => { console.log(error) });
    }

    useEffect(() => {
        getData()
    }, [symbol])
    // end get history data *********************************************************************


    // get stock info *********************************************************************
    const [info, setInfo] = useState([{ 'longBusinessSummary': '' }])

    const getInfo = () => {
        axios.get('/info/' + symbol)
            .then((res) => {
                if (res.data !== 'No data' && res.data !== 'Unable to connect') {
                    setInfo(res.data)
                }
            })
            .catch((error) => { console.log(error) });
    }

    useEffect(() => {
        getInfo()
    }, [symbol])
    // end get stock info *********************************************************************


    // get stock holder *********************************************************************
    const [holder, setHolder] = useState([{
        'institutional': [{ 'Holder': '', 'Shares': '', 'Date Reported': '', '% Out': '', 'Value': '' }],
        'mutualfund': [{ 'Holder': '', 'Shares': '', 'Date Reported': '', '% Out': '', 'Value': '' }]
    }])

    const getHolder = () => {
        axios.get('/holder/' + symbol)
            .then((res) => {
                if (res.data !== 'No data' && res.data !== 'Unable to connect') {
                    let temp = res.data[0]['institutional'];
                    for (let i in temp) {
                        res.data[0]['institutional'][i]['Date Reported'] = new Date(temp[i]['Date Reported']['$date']).toUTCString().replace(' 00:00:00 GMT', '').replace(/\w{3}, /, '')
                    };

                    temp = res.data[0]['mutualfund'];
                    for (let i in temp) {
                        res.data[0]['mutualfund'][i]['Date Reported'] = new Date(temp[i]['Date Reported']['$date']).toUTCString().replace(' 00:00:00 GMT', '').replace(/\w{3}, /, '')
                    };

                    setHolder(res.data)
                }
            })
            .catch((error) => { console.log(error) });
    }

    useEffect(() => {
        getHolder()
    }, [symbol])
    // end get stock holder *********************************************************************


    const columns = [
        { field: '_id', headerClassName: 'BoldHeader', headerName: 'Date', width: 150 },
        { field: 'Open', headerClassName: 'BoldHeader', headerName: 'Open', width: 150 },
        { field: 'High', headerClassName: 'BoldHeader', headerName: 'High', width: 150 },
        { field: 'Low', headerClassName: 'BoldHeader', headerName: 'Low', width: 150 },
        { field: 'Close', headerClassName: 'BoldHeader', headerName: 'Close', width: 150 },
        { field: 'Volume', headerClassName: 'BoldHeader', headerName: 'Volume', width: 150 },
        { field: 'Dividends', headerClassName: 'BoldHeader', headerName: 'Dividends', width: 200 },
        { field: 'Stock Splits', headerClassName: 'BoldHeader', headerName: 'Stock Splits', width: 200 }
    ]

    return (
        <div style={{ height: divHeight }}>
            <AppBar position="static" color="default">
                <Tabs value={false} onChange={handleChange} variant="fullWidth" scrollButtons="on" indicatorColor="primary" textColor="primary" >
                    <Tab label="Chart" value="chart" icon={<ShowChartIcon />} />
                    <Tab label="Historical Data" value="history" icon={<TableChartIcon />} />
                    <Tab label="Holders" value="holders" icon={<GroupIcon />} />
                    <Tab label="Profile" value="profile" icon={<AccountBoxIcon />} />
                </Tabs>
            </AppBar>
            <Routes>
                <Route
                    path='chart'
                    element={
                        <Paper>
                            <Chart data={data}>
                                <ArgumentAxis />
                                <ValueAxis />
                                <LineSeries valueField='Close' argumentField='_id' />
                                <ZoomAndPan />
                            </Chart>
                        </Paper>}
                />
                <Route
                    path='history'
                    element={
                        <XGrid
                            rows={data}
                            columns={columns}
                            getRowId={(row) => row._id}
                            className={classes.xgridStyle}
                            disableSelectionOnClick
                            pagination />
                    }
                />
                <Route
                    path='holders'
                    element={
                        <>
                            <Typography variant="h5" >Top Institutional Holders</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell >Holder</TableCell>
                                            <TableCell align="right">Shares</TableCell>
                                            <TableCell align="right">Date Reported</TableCell>
                                            <TableCell align="right">% Out</TableCell>
                                            <TableCell align="right">Value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {holder[0]['institutional'].map((row) => (
                                            <TableRow key={row.Holder}>
                                                <TableCell >
                                                    {row['Holder']}
                                                </TableCell>
                                                <TableCell align="right">{row['Shares']}</TableCell>
                                                <TableCell align="right">{row['Date Reported']}</TableCell>
                                                <TableCell align="right">{row['% Out']}</TableCell>
                                                <TableCell align="right">{row['Value']}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Typography variant="h5" >Top Mutual Fund Holders</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell >Holder</TableCell>
                                            <TableCell align="right">Shares</TableCell>
                                            <TableCell align="right">Date Reported</TableCell>
                                            <TableCell align="right">% Out</TableCell>
                                            <TableCell align="right">Value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {holder[0]['mutualfund'].map((row) => (
                                            <TableRow key={row.Holder}>
                                                <TableCell >
                                                    {row['Holder']}
                                                </TableCell>
                                                <TableCell align="right">{row['Shares']}</TableCell>
                                                <TableCell align="right">{row['Date Reported']}</TableCell>
                                                <TableCell align="right">{row['% Out']}</TableCell>
                                                <TableCell align="right">{row['Value']}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    }
                />
                <Route
                    path='profile'
                    element={
                        <Card className={classes.root}>
                            <CardContent>
                                <Typography variant="h6" >
                                    {info[0]['longBusinessSummary']}
                                </Typography>
                            </CardContent>
                        </Card>}
                />
            </Routes>
        </div>
    )
}