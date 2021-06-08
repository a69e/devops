import axios from 'axios';
import { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  LineSeries,
  ZoomAndPan,
} from '@devexpress/dx-react-chart-material-ui';

export default function App() {
    const [data, setData] = useState([])

    const getData = () => {
      axios.get('/hsbc')
      .then((res) => {
        let temp = res.data;
        for (let i in res.data) {
          temp[i]['_id'] = new Date(res.data[i]['_id']['$date']).toUTCString()
        }
        setData(temp)
      })
      .catch((error) => { console.log(error) });
    }

    useEffect(() => {
      getData()
    }, [])

    return (
        <Paper>
          <Chart data={data}>
            <ArgumentAxis />
            <ValueAxis />
            <LineSeries valueField='Close' argumentField='_id' />
            <ZoomAndPan />
          </Chart>
        </Paper>
    )
}