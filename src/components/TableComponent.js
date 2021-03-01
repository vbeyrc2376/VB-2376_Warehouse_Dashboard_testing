import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import LinearProgress from '@material-ui/core/LinearProgress';
import Shipped from '../images/shipped.svg';
import Ordered from '../images/order.svg';
import Dispatched from '../images/dispatch.svg';

const useStyles = makeStyles((theme) => ({
    typography: {
        fontFamily: ['Montserrat']
    },
    mdroot: {
        width: '100%',
        backgroundColor: 'none',
        position: 'relative',
        overflow: 'auto',
        maxHeight: '27vh',
        maxWidth: 390,
        padding: 0
    },
    smroot: {
        width: '100%',
        backgroundColor: 'none',
        position: 'relative',
        overflow: 'auto',
        maxHeight: '22vh',
        maxWidth: 390,
        padding: 0
    },
    colorPrimary: {
        color: '#BABCC2',
        backgroundColor: '#BABCC2'
    },
    listSection: {
        backgroundColor: 'inherit',
        padding: 0
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0
    },
    subheader: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: '#212329'
    },
    itemheader: {
        color: '#BABCC2'
    },
    statusheader: {
        color: '#FFFFFF',

        width: '100%'
    }
}));

const defaultStyle = makeStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5
    },
    colorPrimary: {
        backgroundColor: '#373D4D'
    },
    barColorPrimary: {
        backgroundColor: '#21CBF3'
    }
}));
const redStyle = makeStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5
    },
    colorPrimary: {
        backgroundColor: '#373D4D'
    },
    barColorPrimary: {
        backgroundColor: '#ef476f'
    }
}));
const yellowStyle = makeStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5
    },
    colorPrimary: {
        backgroundColor: '#373D4D'
    },
    barColorPrimary: {
        backgroundColor: '#ffd166'
    }
}));

const greenStyle = makeStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5
    },
    colorPrimary: {
        backgroundColor: '#373D4D'
    },
    barColorPrimary: {
        backgroundColor: '#06d6a0'
    }
}));

function TableComponent({ data }) {
    const [packages, setPackage] = useState([]);
    var w = window.innerWidth;
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
                TimeTaken: data[i].gsx$timetaken.$t,
                Color:
                    data[i].gsx$priority.$t === 'HP'
                        ? 'red'
                        : data[i].gsx$priority.$t === 'MP'
                        ? 'yellow'
                        : 'green'
            };
            arr.push(json_data);
            setPackage(arr);
        }
    }, [data]);

    const classes = useStyles();
    const defaultClass = defaultStyle();
    const redClass = redStyle();
    const greenClass = greenStyle();
    const yellowClass = yellowStyle();

    let i = 0;
    if (data.length === null) return <div>Loading</div>;
    else {
        return (
            <div className="TableContainer">
                <List
                    className={w > 450 ? classes.mdroot : classes.smroot}
                    subheader={<li />}
                >
                    {packages.map((element, sectionId) => (
                        <li
                            key={`section-${sectionId}`}
                            className={classes.listSection}
                        >
                            <ul className={classes.ul}>
                                <ListSubheader
                                    disableSticky={false}
                                    color="primary"
                                    className={classes.subheader}
                                >{`Order ${element.OrderID}, ${element.City}`}</ListSubheader>
                                <ListItem key={`item-${sectionId}-${i++}`}>
                                    <ListItemText
                                        className={classes.itemheader}
                                        primary={`Item : ${element.Item}`}
                                    />
                                </ListItem>
                                <ListItem
                                    key={`item-${sectionId}-${i++}`}
                                    className={classes.statusheader}
                                >
                                    {element.Shipped === 'YES' ? (
                                        <ListItemText
                                            primary={`You order was shipped on ${element.ShipTime} , and is on the way!`}
                                        />
                                    ) : element.Dispatched === 'YES' ? (
                                        <ListItemText
                                            primary={`Dispatched on ${element.DispatchTime}`}
                                        />
                                    ) : (
                                        <ListItemText
                                            primary={`Ordered on ${element.OrderTime}`}
                                        />
                                    )}
                                </ListItem>
                            </ul>
                            <ul
                                className="row"
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 0
                                }}
                            >
                                <div
                                    className="col-1"
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 0
                                    }}
                                >
                                    <img
                                        src={Ordered}
                                        alt="Item Logo"
                                        height={30}
                                        width={30}
                                    />
                                </div>

                                <div className="col-4">
                                    <LinearProgress
                                        variant="determinate"
                                        value={
                                            element.Dispatched === 'YES'
                                                ? 100
                                                : 0
                                        }
                                        classes={
                                            element.Priority === 'HP'
                                                ? {
                                                      root: redClass.root,
                                                      colorPrimary:
                                                          redClass.colorPrimary,
                                                      barColorPrimary:
                                                          redClass.barColorPrimary
                                                  }
                                                : element.Priority === 'MP'
                                                ? {
                                                      root: yellowClass.root,
                                                      colorPrimary:
                                                          yellowClass.colorPrimary,
                                                      barColorPrimary:
                                                          yellowClass.barColorPrimary
                                                  }
                                                : element.Priority === 'LP'
                                                ? {
                                                      root: greenClass.root,
                                                      colorPrimary:
                                                          greenClass.colorPrimary,
                                                      barColorPrimary:
                                                          greenClass.barColorPrimary
                                                  }
                                                : {
                                                      root: defaultClass.root,
                                                      colorPrimary:
                                                          defaultClass.colorPrimary,
                                                      barColorPrimary:
                                                          defaultClass.barColorPrimary
                                                  }
                                        }
                                    />
                                </div>
                                <div
                                    className="col-1"
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 0
                                    }}
                                >
                                    <img
                                        src={Dispatched}
                                        alt="Item Logo"
                                        height={30}
                                        width={30}
                                    />
                                </div>

                                <div className="col-4">
                                    <LinearProgress
                                        variant="determinate"
                                        value={
                                            element.Shipped === 'YES' ? 100 : 0
                                        }
                                        classes={
                                            element.Priority === 'HP'
                                                ? {
                                                      root: redClass.root,
                                                      colorPrimary:
                                                          redClass.colorPrimary,
                                                      barColorPrimary:
                                                          redClass.barColorPrimary
                                                  }
                                                : element.Priority === 'MP'
                                                ? {
                                                      root: yellowClass.root,
                                                      colorPrimary:
                                                          yellowClass.colorPrimary,
                                                      barColorPrimary:
                                                          yellowClass.barColorPrimary
                                                  }
                                                : element.Priority === 'LP'
                                                ? {
                                                      root: greenClass.root,
                                                      colorPrimary:
                                                          greenClass.colorPrimary,
                                                      barColorPrimary:
                                                          greenClass.barColorPrimary
                                                  }
                                                : {
                                                      root: defaultClass.root,
                                                      colorPrimary:
                                                          defaultClass.colorPrimary,
                                                      barColorPrimary:
                                                          defaultClass.barColorPrimary
                                                  }
                                        }
                                    />
                                </div>
                                <div
                                    className="col-1"
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 0
                                    }}
                                >
                                    <img
                                        src={Shipped}
                                        alt="Item Logo"
                                        height={30}
                                        width={30}
                                    />
                                </div>
                            </ul>
                        </li>
                    ))}
                </List>
            </div>
        );
    }
}
export default TableComponent;
