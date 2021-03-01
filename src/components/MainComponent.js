import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapsComponent from './MapsComponent';
import GraphComponent from './GraphComponent';
import TableComponent from './TableComponent';
import Eyantra from '../images/eyantra.svg';
import Modal from '@material-ui/core/Modal';
import ModalComponent from './ModalComponent';

var days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];
var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

function MainComponent() {
    const [data, setData] = useState({});
    var d = new Date();
    const weekday = days[d.getDay()];
    const month = months[d.getMonth()];
    const date = d.getDate() + ' ' + month + ' ' + d.getFullYear();
    const getData = async () => {
        try {
            const res = await axios.get(
                'https://spreadsheets.google.com/feeds/list/1TbuodpAYI2Iy4W8SiEs-FyhqjC2wm3oWjhm1IWxAFs4/5/public/full?alt=json'
            );
            if (res.data.feed.entry) setData(res.data.feed.entry);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        getData();
        const interval = setInterval(() => {
            getData();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    var w = window.innerWidth;
    return (
        <div
            className="container"
            style={{
                height: '100%',
                padding: '5vh'
            }}
        >
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div>
                    <ModalComponent data={data} />
                </div>
            </Modal>

            <div className="row">
                <div
                    className="col-xs-12 col-sm-12 col-md-7"
                    style={{
                        height: '90vh'
                    }}
                >
                    <div
                        className="row"
                        style={{
                            height: '10vh'
                        }}
                    >
                        <div className="col-12">
                            <img src={Eyantra} alt="Eyantra Logo" />
                        </div>
                    </div>
                    <div
                        className="row"
                        style={{
                            height: '5vh'
                        }}
                    >
                        <div
                            className="col-12"
                            style={{
                                color: '#fff',
                                fontSize: 30
                            }}
                        >
                            Dashboard
                        </div>
                    </div>
                    <div
                        className="row"
                        style={{
                            height: '5vh',
                            width: '100%'
                        }}
                    >
                        <div
                            className="col-xs-3 col-sm-3 col-md-2"
                            style={{
                                color: '#fff',
                                fontSize: 24,
                             
                               }}
                        >
                            {weekday},
                        </div>
                        <div
                            className="col-xs-9 col-sm-9 col-md-10"
                            style={{
                                color: '#42426A',
                                fontSize: 24,
                                paddingLeft:'6%', 
                               
                            }}
                        >
                            {date}
                        </div>
                    </div>

                    <div className="row">
                        <div
                            className="col-12"
                            style={{
                                height: '70vh',
                                width: '100%'
                            }}
                        >
                            <MapsComponent data={data} />
                        </div>
                    </div>
                </div>
                <div
                    className="col-xs-12 col-sm-12 col-md-5"
                    style={{
                        height: '90vh',
                        backgroundColor: '#212329',
                        borderRadius: 20
                    }}
                >
                    <div className="row">
                        <div
                            className="col-12"
                            style={{
                                color: '#fff',
                                fontSize: 30,
                                marginTop: '2vh',
                                justifyContent: 'center'
                            }}
                        >
                            Time Taken by all Orders
                        </div>
                        <div
                            className="col-12"
                            style={{
                                height: '40vh',
                                width: '100%'
                            }}
                        >
                            <GraphComponent data={data} />
                        </div>

                        <div className="col-12">
                            <div
                                className="row"
                                style={{
                                    color: '#fff',
                                    fontSize: 30,
                                    height: '5vh',
                                    marginTop: '5vh',
                                    marginBottom: '2vh',
                                    justifyContent: 'center'
                                }}
                            >
                                <div
                                    className={
                                        w < 580
                                            ? 'col-9'
                                            : 'col-xs-6 col-sm-9 col-md-9'
                                    }
                                    style={{
                                        width: '100%'
                                    }}
                                >
                                    Order Status
                                </div>
                                <div
                                    className={
                                        w < 580
                                            ? 'col-3'
                                            : 'col-xs-6 col-sm-3 col-md-3'
                                    }
                                    style={{
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <button
                                        className="mdc-button foo-button"
                                        style={{ backgroundColor: 'none' }}
                                        onClick={handleOpen}
                                    >
                                        <span
                                            className="material-icons"
                                            style={{
                                                color: '#42426A'
                                            }}
                                        >
                                            info
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <TableComponent data={data} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default MainComponent;
